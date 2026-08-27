package mg.taxibrousse.services.implementation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import static java.util.Optional.ofNullable;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.entities.ClasseEntity;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.entities.enums.ReservationStatusEnum;
import mg.taxibrousse.entities.enums.SeatStatusEnum;
import mg.taxibrousse.exceptions.InvalidPaymentException;
import mg.taxibrousse.exceptions.InvalidSeatException;
import mg.taxibrousse.exceptions.ReservationNotFoundException;
import mg.taxibrousse.models.Reservation;
import mg.taxibrousse.models.Seat;
import mg.taxibrousse.repositories.ICrafterRepository;
import mg.taxibrousse.repositories.IFacturationRepository;
import mg.taxibrousse.repositories.IReservationRepository;
import mg.taxibrousse.repositories.ISeatRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.IReservationService;
import mg.taxibrousse.services.IReservationSmsService;
import mg.taxibrousse.services.IGuichetSmsService;
import mg.taxibrousse.services.IWhatsAppNotificationService;

@Service
@RequiredArgsConstructor
public class ReservationService implements IReservationService {

    private static final BigDecimal COMMISSION_RATE = new BigDecimal("0.05");

    private final IReservationRepository reservationRepository;
    private final ISeatRepository seatRepository;
    private final IReservationSmsService reservationSmsService;
    private final IGuichetSmsService guichetSmsService;
    private final IFacturationRepository facturationRepository;
    private final IVoyageRepository voyageRepository;
    private final ICrafterRepository crafterRepository;
    private final EntityManager entityManager;
    private final IWhatsAppNotificationService whatsAppNotificationService;
    private final IPaymentTransactionRepository paymentTransactionRepository;

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Reservation save(Reservation reservation) {
        // Generate booking reference if not provided
        reservation.setBookingReference(StringUtils.hasText(reservation.getBookingReference()) ? reservation.getBookingReference() : generateBookingReference());

        List<SeatEntity> seatEntities = new ArrayList<>();
        if (reservation.getSeats() != null && !reservation.getSeats().isEmpty()) {
            Long defaultVoyageId = reservation.getVoyage() != null ? reservation.getVoyage().getId() : null;
            for (Seat seat : reservation.getSeats()) {
                Long vId = seat.getVoyage() != null && seat.getVoyage().getId() != null ? seat.getVoyage().getId() : defaultVoyageId;
                Integer sNum = StringUtils.hasText(seat.getSeatNum()) ? Integer.valueOf(seat.getSeatNum()) : null;

                SeatEntity seatEntity = null;
                if (seat.getId() != null) {
                    seatEntity = seatRepository.findById(seat.getId()).orElse(null);
                }
                if (seatEntity == null && vId != null && sNum != null) {
                    seatEntity = seatRepository.findByVoyageIdAndSeatNumber(vId, sNum).orElse(null);
                }

                if (seatEntity == null) {
                    seatEntity = seat.toEntity();
                    if (seatEntity.getVoyage() == null && vId != null) {
                        seatEntity.setVoyage(voyageRepository.findById(vId).orElse(null));
                    }
                } else {
                    if (StringUtils.hasText(seat.getSeatStatus())) {
                        seatEntity.setSeatStatus(SeatStatusEnum.valueOf(seat.getSeatStatus()));
                    } else {
                        seatEntity.setSeatStatus(SeatStatusEnum.RESERVED);
                    }
                    if (StringUtils.hasText(seat.getPosition())) {
                        seatEntity.setPosition(seat.getPosition());
                    }
                }
                seatEntities.add(seatEntity);
            }
        }

        var entity = reservation.toEntity();
        var saved = reservationRepository.save(entity);

        for (SeatEntity seatEntity : seatEntities) {
            seatEntity.setReservation(saved);
            if (seatEntity.getSeatStatus() == null) {
                seatEntity.setSeatStatus(SeatStatusEnum.RESERVED);
            }
        }
        var savedSeats = seatRepository.saveAll(seatEntities);
        saved.setSeats(savedSeats);

        // Reload reservation with full voyage graph for SMS notification (includes koperative, gares, ville)
        ReservationEntity reservationForSms = reservationRepository.findByIdWithDetails(saved.getId()).orElse(saved);
        guichetSmsService.sendReservationNotification(reservationForSms);

        return Reservation.fromEntity(saved);
    }

    /**
     * Processes payment for a reservation
     *
     * @param reservationId The ID of the reservation to process payment for
     * @param amount The payment amount
     * @return Updated reservation with payment information
     */
    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Reservation processPayment(Long reservationId, BigDecimal amount) {
        ReservationEntity reservation = getReservationById(reservationId);

        validatePaymentAmount(amount, reservation.getTotalAmount());

        FacturationEntity facturation = getOrCreateFacturation(reservation);
        BigDecimal newTotalPaid = updateFacturationWithPayment(facturation, amount);
        updatePaymentStatus(facturation, reservation, newTotalPaid);

        facturationRepository.save(facturation);
        ReservationEntity savedReservation = reservationRepository.save(reservation);
        return Reservation.fromEntity(savedReservation);
    }

    private ReservationEntity getReservationById(Long reservationId) {
        return reservationRepository.findByIdWithDetails(reservationId).orElseThrow(() -> new ReservationNotFoundException("exception_reservation_not_found"));
    }

    private void validatePaymentAmount(BigDecimal amount, BigDecimal totalAmount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentException("exception_payment_amount_zero");
        }
        if (amount.compareTo(totalAmount) > 0) {
            throw new InvalidPaymentException("exception_payment_amount_exceeds_total");
        }
    }

    private FacturationEntity getOrCreateFacturation(ReservationEntity reservation) {
        FacturationEntity facturation = reservation.getFacturation();
        if (facturation == null) {
            facturation = createNewFacturation(reservation);
            reservation.setFacturation(facturation);
        }
        return facturation;
    }

    private FacturationEntity createNewFacturation(ReservationEntity reservation) {
        // Aligned with FacturationService.createFacturation to keep both creation paths consistent.
        // Semantics:
        // - amount = subtotal (frozen at creation)
        // - taxAmount = tax amount
        // - totalAmount = grand total to pay = amount + taxAmount (frozen, never mutated by payments)
        // - remainingAmount = totalAmount - cumulative payments
        BigDecimal reservationTotal = ofNullable(reservation.getTotalAmount()).orElse(BigDecimal.ZERO);
        FacturationEntity facturation = new FacturationEntity();
        facturation.setReservation(reservation);
        facturation.setInvoiceNumber(generateInvoiceNumber());
        facturation.setAmount(reservationTotal);
        facturation.setTaxAmount(BigDecimal.ZERO);
        facturation.setTotalAmount(reservationTotal);
        facturation.setRemainingAmount(reservationTotal);
        facturation.setPaymentStatus(PaymentStatusEnum.PENDING);
        facturation.setDueDate(LocalDateTime.now().plusDays(7));
        return facturation;
    }

    /**
     * Applies a payment to the facturation without mutating the invoice subtotal/grand total.
     *
     * <p>
     * {@code amount} and {@code totalAmount} represent the invoice itself and are frozen at
     * creation. Only {@code remainingAmount} (and {@code paymentDate}/{@code paymentStatus}) are
     * updated as payments come in. The cumulative paid amount is derived from
     * {@code totalAmount - remainingAmount}.
     *
     * @return the new cumulative paid amount after applying {@code amount}.
     */
    private BigDecimal updateFacturationWithPayment(FacturationEntity facturation, BigDecimal amount) {
        BigDecimal invoiceTotal = ofNullable(facturation.getTotalAmount()).orElse(BigDecimal.ZERO);
        BigDecimal currentRemaining = ofNullable(facturation.getRemainingAmount()).orElse(invoiceTotal);

        // Exclude fee from the payment applied to the facturation
        BigDecimal fee = BigDecimal.ZERO;
        // If this is the initial payment and it's less than the invoice total, it's an advance payment which includes a 5% fee
        if (currentRemaining.compareTo(invoiceTotal) == 0 && amount.compareTo(invoiceTotal) < 0) {
            fee = invoiceTotal.multiply(COMMISSION_RATE);
            facturation.setCommission(fee);
            facturation.setAdvanceAmount(amount.subtract(fee).max(BigDecimal.ZERO));
        }

        BigDecimal actualPayment = amount.subtract(fee).max(BigDecimal.ZERO);

        BigDecimal currentPaid = invoiceTotal.subtract(currentRemaining).max(BigDecimal.ZERO);
        BigDecimal newTotalPaid = currentPaid.add(actualPayment);

        BigDecimal newRemaining = invoiceTotal.subtract(newTotalPaid).max(BigDecimal.ZERO);
        facturation.setRemainingAmount(newRemaining);
        facturation.setPaymentDate(LocalDateTime.now());

        return newTotalPaid;
    }

    private void updatePaymentStatus(FacturationEntity facturation, ReservationEntity reservation, BigDecimal totalPaid) {
        reservation.setStatus(ReservationStatusEnum.CONFIRMED);

        if (totalPaid.compareTo(reservation.getTotalAmount()) >= 0) {
            facturation.setPaymentStatus(PaymentStatusEnum.PAID);

            // Send confirmation SMS
            reservationSmsService.sendConfirmationSms(reservation);

            // Send WhatsApp notification after successful payment
            try {
                whatsAppNotificationService.sendReservationConfirmation(reservation);
            } catch (Exception e) {
                // Log error but don't fail the payment process
                // WhatsApp notification is not critical
            }
        } else {
            facturation.setPaymentStatus(PaymentStatusEnum.PARTIALLY_PAID);
        }
    }

    /**
     * Generates a unique invoice number.
     * Format: INV-YYYYMMDD-XXXX
     */
    private String generateInvoiceNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("INV-%s-%s", dateStr, randomStr);
    }

    /**
     * Generates a unique booking reference.
     * Format: TXB-YYYYMMDD-HHMMSS-XXXX
     */
    private String generateBookingReference() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String timeStr = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        String randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        String reference = String.format("TXB-%s-%s-%s", dateStr, timeStr, randomStr);

        // Ensure uniqueness
        // Ensure uniqueness by checking if the reference already exists
        while (reservationRepository.existsByBookingReference(reference)) {
            randomStr = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
            reference = String.format("TXB-%s-%s-%s", dateStr, timeStr, randomStr);
        }

        return reference;
    }

    @Override
    public Reservation findById(Long id) {
        return reservationRepository.findByIdWithDetails(id).map(Reservation::fromEntity).map(this::enrichReservation).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findByVoyageId(Long voyageId) {
        return reservationRepository.findByVoyageId(voyageId).stream().map(entity -> {
            var reservation = Reservation.fromEntity(entity);
            if (entity.getSeats() != null && !entity.getSeats().isEmpty()) {
                reservation.setSeats(entity.getSeats().stream().map(Seat::fromEntity).toList());
            }
            return reservation;
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findActiveByVoyageId(Long voyageId) {
        return reservationRepository.findActiveByVoyageId(voyageId, ReservationStatusEnum.getCancellationStatuses()).stream().map(entity -> {
            var reservation = Reservation.fromEntity(entity);
            if (entity.getSeats() != null && !entity.getSeats().isEmpty()) {
                reservation.setSeats(entity.getSeats().stream().map(Seat::fromEntity).toList());
            }
            return reservation;
        }).toList();
    }

    @Override
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public void deleteById(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Reservation cancelReservation(Long id, ReservationStatusEnum cancelStatus) {
        ReservationEntity reservation = getReservationById(id);

        if (reservation.getStatus().isCancelled()) {
            throw new IllegalArgumentException("reservation_already_cancelled");
        }

        if (cancelStatus.isValidCancellationStatus()) {
            seatRepository.deleteByReservationId(id);
            reservationRepository.updateStatus(id, cancelStatus);
            resetFraisOnCancellation(reservation);
        }

        return Reservation.fromEntity(reservation);
    }

    private void resetFraisOnCancellation(ReservationEntity reservation) {
        ofNullable(reservation.getFacturation())
                .map(FacturationEntity::getId)
                .ifPresent(paymentTransactionRepository::resetFraisRetraitByFacturationId);
    }

    @Override
    public boolean isSeatAvailable(Long voyageId, String seatNumber) {
        try {
            Integer seatNum = Integer.valueOf(seatNumber);
            return !reservationRepository.existsByVoyageIdAndSeatNumberAndStatusNotCancelled(voyageId, seatNum);
        } catch (NumberFormatException e) {
            throw new InvalidSeatException("exception_invalid_seat_number");
        }
    }

    // Implementation of the service to get reservations by voyageur
    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findByVoyageurId(Long voyageurId) {
        List<ReservationEntity> entities = reservationRepository.findFutureByVoyageurId(voyageurId, LocalDateTime.now());
        return entities.stream().map(Reservation::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Reservation> findAllPageable(String status, String phoneNumber, String bookingReference, String paymentStatus, Pageable pageable) {
        Specification<ReservationEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(status)) {
                try {
                    ReservationStatusEnum statusEnum = ReservationStatusEnum.valueOf(status.toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), statusEnum));
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore filter
                }
            }

            if (StringUtils.hasText(paymentStatus)) {
                List<PaymentStatusEnum> statuses = new ArrayList<>();
                for (String part : paymentStatus.split(",")) {
                    try {
                        statuses.add(PaymentStatusEnum.valueOf(part.trim().toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        // Invalid paymentStatus part, ignore
                    }
                }
                if (statuses.size() > 0) {
                    predicates.add(root.get("facturation").get("paymentStatus").in(statuses));
                }
            }

            if (StringUtils.hasText(phoneNumber)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("voyageur").get("phone")), "%" + phoneNumber.trim().toLowerCase() + "%"));
            }

            if (StringUtils.hasText(bookingReference)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("bookingReference")), "%" + bookingReference.trim().toLowerCase() + "%"));
            }

            // Exclude batch generated reservations
            predicates.add(criteriaBuilder.or(criteriaBuilder.isNull(root.get("notes")), criteriaBuilder.notEqual(root.get("notes"), "AUTO_BATCH")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // Always sort by id DESC so the newest reservations appear first
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "id"));

        Page<ReservationEntity> entities = reservationRepository.findAll(spec, sortedPageable);
        return entities.map(Reservation::fromEntity).map(this::enrichReservation);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Reservation confirmReservation(Long id) {
        ReservationEntity reservation = getReservationById(id);

        if (reservation.getStatus() == ReservationStatusEnum.CONFIRMED) {
            throw new IllegalArgumentException("reservation_already_confirmed");
        }

        if (reservation.getStatus().isCancelled()) {
            throw new IllegalArgumentException("reservation_cancelled_cannot_confirm");
        }

        reservation.setStatus(ReservationStatusEnum.CONFIRMED);
        ReservationEntity savedReservation = reservationRepository.save(reservation);
        return Reservation.fromEntity(savedReservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reservation> findByPhoneNumberOrIdNumber(String phoneNumber, String idNumber) {
        return reservationRepository.findByPhoneNumberOrIdNumber(phoneNumber, idNumber).stream().map(Reservation::fromEntity).toList();
    }

    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Reservation confirmReservationWithoutVoyageur(ReservationWithoutVoyageurRequest request) {
        if (request.getVoyageId() == null) {
            throw new IllegalArgumentException("voyage_id_required");
        }

        // crafterId is optional: allow null to create reservations without assigning a crafter

        if (request.getSeatNumbers() == null || request.getSeatNumbers().isEmpty()) {
            throw new IllegalArgumentException("seat_numbers_required");
        }

        VoyageEntity voyageEntity = voyageRepository.findById(request.getVoyageId()).orElseThrow(() -> new RuntimeException("Voyage not found with id: " + request.getVoyageId()));

        // Classe is optional
        ClasseEntity classeEntity = null;
        if (request.getClasseId() != null) {
            classeEntity = entityManager.find(ClasseEntity.class, request.getClasseId());
            if (classeEntity == null) {
                throw new RuntimeException("Classe not found with id: " + request.getClasseId());
            }
        }

        // Use provided crafterId, or fall back to the voyage's crafter
        CrafterEntity crafterEntity;
        if (request.getCrafterId() != null) {
            crafterEntity = crafterRepository.findById(request.getCrafterId()).orElseThrow(() -> new RuntimeException("Crafter not found with id: " + request.getCrafterId()));
        } else {
            crafterEntity = voyageEntity.getCrafter();
        }

        // Check seat availability
        for (String seatNumber : request.getSeatNumbers()) {
            if (!isSeatAvailable(request.getVoyageId(), seatNumber)) {
                throw new InvalidSeatException("seat_already_reserved: " + seatNumber);
            }
        }

        // Create reservation without voyageur
        var reservationEntity = new ReservationEntity();
        reservationEntity.setVoyage(voyageEntity);
        reservationEntity.setClasse(classeEntity);
        reservationEntity.setVoyageur(null);
        reservationEntity.setBookingReference(generateBookingReference());
        reservationEntity.setStatus(ReservationStatusEnum.CONFIRMED);
        reservationEntity.setBookingDate(LocalDateTime.now());
        reservationEntity.setTotalAmount(BigDecimal.ZERO);
        reservationEntity.setSeatCount(request.getSeatNumbers().size());
        reservationEntity.setNotes(request.getNotes());

        var savedReservation = reservationRepository.save(reservationEntity);

        // Create seats
        List<SeatEntity> seats = new ArrayList<>();
        for (String seatNumber : request.getSeatNumbers()) {
            var seatEntity = new SeatEntity();
            seatEntity.setReservation(savedReservation);
            seatEntity.setVoyage(voyageEntity);
            seatEntity.setCrafter(crafterEntity);
            seatEntity.setSeatNumber(Integer.valueOf(seatNumber));
            seatEntity.setSeatStatus(SeatStatusEnum.RESERVED);
            seats.add(seatEntity);
        }
        seatRepository.saveAll(seats);

        return Reservation.fromEntity(savedReservation);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Reservation attachVoyageur(Long reservationId, Long voyageurId) {
        ReservationEntity reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + reservationId));

        VoyageurEntity voyageur = entityManager.find(VoyageurEntity.class, voyageurId);
        if (voyageur == null) {
            throw new RuntimeException("Voyageur not found: " + voyageurId);
        }

        reservation.setVoyageur(voyageur);
        return Reservation.fromEntity(reservationRepository.save(reservation));
    }

    private Reservation enrichReservation(Reservation reservation) {
        if (reservation != null && reservation.getFacturation() != null) {
            Long facturationId = reservation.getFacturation().getId();
            var transactions = paymentTransactionRepository.findByFacturationIdOrderByInitiatedAtDesc(facturationId);
            boolean hasTransactions = transactions.size() > 0;
            if (hasTransactions) {
                var tx = transactions.get(0);
                reservation.getFacturation().setPaymentMethodIdentifier(tx.getOperatorName());
                reservation.getFacturation().setPaymentPhoneNumber(tx.getPhoneNumber());
                reservation.getFacturation().setFraisRetrait(tx.getFraisRetrait());
                reservation.getFacturation().setFraisTransfert(tx.getFraisTransfert());
                reservation.getFacturation().setFraisTotal(tx.getFraisTotal());
                reservation.getFacturation().setFraisTransaction(tx.getFraisTransaction());
                reservation.getFacturation().setCommissionSeats(tx.getCommissionSeats());
                reservation.getFacturation().setCommissionFee(tx.getCommissionFee());
            }
        }
        return reservation;
    }
}
