package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.GuichetEntity;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.PaymentStatusEnum;
import mg.taxibrousse.repositories.IGuichetRepository;
import mg.taxibrousse.services.IGuichetSmsService;
import mg.taxibrousse.services.ISmsService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GuichetSmsService implements IGuichetSmsService {

    private final ISmsService smsService;
    private final IGuichetRepository guichetRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Override
    @Async
    public void sendReservationNotification(ReservationEntity reservation) {
        try {
            if (reservation.getVoyageur() == null) {
                log.warn("Skipping guichet SMS: voyageur is null for reservation {}", reservation.getId());
                return;
            }

            boolean isPaymentIncomplete = Optional.ofNullable(reservation.getFacturation())
                    .map(FacturationEntity::getPaymentStatus)
                    .map(status -> status != PaymentStatusEnum.PAID && status != PaymentStatusEnum.PARTIALLY_PAID)
                    .orElse(true);

            if (isPaymentIncomplete) {
                log.warn("Skipping guichet SMS: payment not completed for reservation {}", reservation.getId());
                return;
            }

            VoyageEntity voyage = reservation.getVoyage();
            if (voyage == null || voyage.getDepartureGare() == null || voyage.getKoperative() == null) {
                log.warn("Cannot send guichet SMS: voyage, departure gare, or koperative is null for reservation {}", reservation.getId());
                return;
            }

            // Find the specific guichet for this voyage (by gare and koperative)
            var guichetOpt = guichetRepository.findByGareIdAndKoperativeIdWithOperateurs(voyage.getDepartureGare().getId(), voyage.getKoperative().getId());

            if (guichetOpt.isEmpty()) {
                log.debug("No guichet found for gare {} and koperative {} for reservation {}", voyage.getDepartureGare().getId(), voyage.getKoperative().getId(), reservation.getId());
                return;
            }

            GuichetEntity guichet = guichetOpt.get();

            if (guichet.getSmsPhone() == null || guichet.getSmsPhone().trim().isEmpty()) {
                log.debug("Skipping SMS for guichet {} - no SMS phone configured", guichet.getName());
                return;
            }

            String message = buildGuichetNotificationMessage(reservation, guichet);
            log.info("Built SMS message for reservation {}: {}", reservation.getBookingReference(), message);
            smsService.sendSms(guichet.getSmsPhone(), message);
            log.info("Guichet SMS sent for reservation {} to guichet {} ({})", reservation.getBookingReference(), guichet.getName(), guichet.getSmsPhone());

        } catch (Exception e) {
            log.error("Failed to send guichet SMS for reservation {}: {}", reservation.getId(), e.getMessage());
        }
    }

    private String buildGuichetNotificationMessage(ReservationEntity reservation, GuichetEntity guichet) {
        VoyageEntity voyage = reservation.getVoyage();

        String seatCount = String.valueOf(reservation.getSeats().size());

        Optional<VoyageurEntity> voyageurOpt = Optional.ofNullable(reservation.getVoyageur());

        String firstName = voyageurOpt.map(VoyageurEntity::getFirstName).orElse("Client").trim();
        String lastName = voyageurOpt.map(VoyageurEntity::getLastName).orElse("Inconnu").trim();
        String phone = voyageurOpt.map(VoyageurEntity::getPhone).orElse("N/A");
        String idNumber = voyageurOpt.map(VoyageurEntity::getIdNumber).orElse("N/A");

        String message = String.format("Reservation: %s -> %s.\n" + "%s %s.\n" + "Plasy: %s.\n" + "%s %s (%s).\n" + "%s. Ho arahinay antso avy eo.",
                voyage.getDepartureGare().getVille().getName(),
                voyage.getArrivalGare().getVille().getName(),
                voyage.getDepartureTime().format(DATE_FORMATTER),
                voyage.getDepartureTime().format(TIME_FORMATTER),
                seatCount,
                firstName,
                lastName,
                phone,
                idNumber);

        return message;
    }
}
