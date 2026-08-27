package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.CrafterEntity;
import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.SeatStatusEnum;
import mg.taxibrousse.models.Seat;
import mg.taxibrousse.repositories.ICrafterRepository;
import mg.taxibrousse.repositories.ISeatRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.ISeatService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatService implements ISeatService {

    private final ISeatRepository seatRepository;
    private final IVoyageRepository voyageRepository;
    private final ICrafterRepository crafterRepository;

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public Seat save(Seat seat) {
        SeatEntity entity = seat.toEntity();
        SeatEntity saved = seatRepository.save(entity);
        return Seat.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "seats", key = "'id:' + #id", unless = "#result == null")
    public Seat findById(Long id) {
        Optional<SeatEntity> entity = seatRepository.findById(id);
        return entity.map(Seat::fromEntity).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "seats", key = "'voyage:' + #voyageId")
    public List<Seat> findByVoyageId(Long voyageId) {
        List<SeatEntity> entities = seatRepository.findByVoyageIdOrderBySeatNumber(voyageId);
        return entities.stream().map(Seat::fromEntityLight).toList();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "seats", key = "'crafter:' + #crafterId")
    public List<Seat> findByCrafterId(Long crafterId) {
        List<SeatEntity> entities = seatRepository.findByCrafterIdOrderBySeatNumber(crafterId);
        return entities.stream().map(Seat::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Seat findByVoyageIdAndSeatNumber(Long voyageId, Integer seatNumber) {
        Optional<SeatEntity> entity = seatRepository.findByVoyageIdAndSeatNumber(voyageId, seatNumber);
        return entity.map(Seat::fromEntity).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Seat> findByVoyageIdAndStatus(Long voyageId, SeatStatusEnum status) {
        List<SeatEntity> entities = seatRepository.findByVoyageIdAndSeatStatus(voyageId, status);
        return entities.stream().map(Seat::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Seat> findByVoyageIdAndReservationId(Long voyageId, Long reservationId) {
        List<SeatEntity> entities = seatRepository.findByVoyageIdAndReservationId(voyageId, reservationId);
        return entities.stream().map(Seat::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Seat> findByReservationId(Long reservationId) {
        List<SeatEntity> entities = seatRepository.findByReservationId(reservationId);
        return entities.stream().map(Seat::fromEntityLight).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAvailableSeatsCount(Long voyageId) {
        return seatRepository.countAvailableSeatsByVoyageId(voyageId);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public List<Seat> initializeSeatsForVoyage(Long voyageId, Long crafterId) {
        // Check if seats already exist for this voyage
        List<SeatEntity> existingSeats = seatRepository.findByVoyageIdOrderBySeatNumber(voyageId);
        if (!existingSeats.isEmpty()) {
            log.info("Seats already initialized for voyage {}", voyageId);
            return existingSeats.stream().map(Seat::fromEntity).toList();
        }

        // Get voyage and crafter
        Optional<VoyageEntity> voyageOpt = voyageRepository.findById(voyageId);
        Optional<CrafterEntity> crafterOpt = crafterRepository.findById(crafterId);

        if (voyageOpt.isEmpty() || crafterOpt.isEmpty()) {
            log.error("Voyage {} or Crafter {} not found", voyageId, crafterId);
            return new ArrayList<>();
        }

        VoyageEntity voyage = voyageOpt.get();
        CrafterEntity crafter = crafterOpt.get();

        // Create seats based on crafter capacity
        List<SeatEntity> newSeats = new ArrayList<>();
        for (int i = 1; i <= crafter.getSeatCapacity(); i++) {
            SeatEntity seat = new SeatEntity();
            seat.setVoyage(voyage);
            seat.setCrafter(crafter);
            seat.setSeatNumber(i);
            seat.setSeatStatus(SeatStatusEnum.AVAILABLE);
            newSeats.add(seat);
        }

        List<SeatEntity> savedSeats = seatRepository.saveAll(newSeats);
        log.info("Initialized {} seats for voyage {}", savedSeats.size(), voyageId);

        return savedSeats.stream().map(Seat::fromEntity).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public Seat updateSeatStatus(Long seatId, SeatStatusEnum status) {
        Optional<SeatEntity> entityOpt = seatRepository.findById(seatId);
        if (entityOpt.isEmpty()) {
            log.error("Seat with ID {} not found", seatId);
            return null;
        }

        SeatEntity entity = entityOpt.get();
        entity.setSeatStatus(status);
        SeatEntity saved = seatRepository.save(entity);

        log.info("Updated seat {} status to {}", seatId, status);
        return Seat.fromEntity(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public Seat reserveSeat(Long voyageId, Integer seatNumber) {
        Optional<SeatEntity> entityOpt = seatRepository.findByVoyageIdAndSeatNumber(voyageId, seatNumber);
        if (entityOpt.isEmpty()) {
            log.error("Seat {} not found for voyage {}", seatNumber, voyageId);
            return null;
        }

        SeatEntity entity = entityOpt.get();
        if (!entity.isAvailable()) {
            log.warn("Seat {} for voyage {} is not available for reservation", seatNumber, voyageId);
            return null;
        }

        entity.setSeatStatus(SeatStatusEnum.RESERVED);
        SeatEntity saved = seatRepository.save(entity);

        log.info("Reserved seat {} for voyage {}", seatNumber, voyageId);
        return Seat.fromEntity(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public Seat releaseSeat(Long voyageId, Integer seatNumber) {
        Optional<SeatEntity> entityOpt = seatRepository.findByVoyageIdAndSeatNumber(voyageId, seatNumber);
        if (entityOpt.isEmpty()) {
            log.error("Seat {} not found for voyage {}", seatNumber, voyageId);
            return null;
        }

        SeatEntity entity = entityOpt.get();
        entity.setSeatStatus(SeatStatusEnum.AVAILABLE);
        SeatEntity saved = seatRepository.save(entity);

        log.info("Released seat {} for voyage {}", seatNumber, voyageId);
        return Seat.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSeatAvailable(Long voyageId, Integer seatNumber) {
        Optional<SeatEntity> entityOpt = seatRepository.findByVoyageIdAndSeatNumber(voyageId, seatNumber);
        return entityOpt.map(SeatEntity::isAvailable).orElse(false);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public void deleteById(Long id) {
        seatRepository.deleteById(id);
        log.info("Deleted seat with ID {}", id);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public List<Seat> updateMultipleSeatsStatus(Long voyageId, List<Integer> seatNumbers, SeatStatusEnum status) {
        List<SeatEntity> seats = seatRepository.findByVoyageIdAndSeatNumberIn(voyageId, seatNumbers);

        for (SeatEntity seat : seats) {
            seat.setSeatStatus(status);
        }

        List<SeatEntity> updatedSeats = seatRepository.saveAll(seats);
        log.info("Updated {} seats status to {} for voyage {}", updatedSeats.size(), status, voyageId);

        return updatedSeats.stream().map(Seat::fromEntity).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public List<Seat> resetVoyageSeats(Long voyageId) {
        List<SeatEntity> seats = seatRepository.findByVoyageIdOrderBySeatNumber(voyageId);

        for (SeatEntity seat : seats) {
            seat.setSeatStatus(SeatStatusEnum.AVAILABLE);
            seat.setReservation(null);
            seat.setNotes(null);
        }

        List<SeatEntity> resetSeats = seatRepository.saveAll(seats);
        log.info("Reset {} seats for voyage {}", resetSeats.size(), voyageId);

        return resetSeats.stream().map(Seat::fromEntity).toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = {"seats", "voyages"}, allEntries = true)
    public List<Seat> releaseSeatsByReservation(Long voyageId, Long reservationId) {
        List<SeatEntity> seats = seatRepository.findByVoyageIdAndReservationId(voyageId, reservationId);

        for (SeatEntity seat : seats) {
            seat.setSeatStatus(SeatStatusEnum.AVAILABLE);
            seat.setReservation(null);
            seat.setNotes(null);
        }

        List<SeatEntity> releasedSeats = seatRepository.saveAll(seats);
        log.info("Released {} seats for reservation {} in voyage {}", releasedSeats.size(), reservationId, voyageId);

        return releasedSeats.stream().map(Seat::fromEntity).toList();
    }
}
