package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.ReservationWithoutVoyageurRequest;
import mg.taxibrousse.models.Classe;
import mg.taxibrousse.models.Crafter;
import mg.taxibrousse.models.Reservation;
import mg.taxibrousse.models.Seat;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.services.IReservationBatchService;
import mg.taxibrousse.services.IReservationService;
import mg.taxibrousse.services.ISeatService;
import mg.taxibrousse.services.IVoyageService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationBatchService implements IReservationBatchService {

    private static final int DEFAULT_SEAT_CAPACITY = 18;
    private static final int MAX_DAYS_AHEAD = 7;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final IVoyageService voyageService;
    private final IReservationService reservationService;
    private final ISeatService seatService;

    private boolean isBatchEnabled = true;
    private final Random random = new Random();

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record CrafterConfigLayout(List<List<SeatLayoutItem>> seats) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SeatLayoutItem(Integer id, Boolean hide, Boolean disable, String position) {
        public boolean isUsable() {
            return Boolean.FALSE.equals(hide) && Boolean.FALSE.equals(disable) && id != null && id > 0;
        }
    }

    @Override
    public void pauseBatch() {
        this.isBatchEnabled = false;
        log.info("Reservation Batch is now PAUSED.");
    }

    @Override
    public void playBatch() {
        this.isBatchEnabled = true;
        log.info("Reservation Batch is now RESUMED.");
    }

    @Override
    public boolean isBatchEnabled() {
        return isBatchEnabled;
    }

    @Override
    @Scheduled(cron = "0 0 */2 * * ?")
    public void runDailyBatch() {
        if (isBatchEnabled) {
            executeBatch();
        } else {
            log.info("Reservation Batch skipped because it is paused.");
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public void executeBatch() {
        long startTime = System.currentTimeMillis();
        log.info("Starting Reservation Batch with seat configuration support...");

        LocalDate today = LocalDate.now();
        LocalDate maxDate = today.plusDays(MAX_DAYS_AHEAD);

        List<Voyage> voyages = voyageService.findVoyagesByDateRange(today, maxDate);

        if (voyages.isEmpty()) {
            log.info("No voyages found in date range {} to {}", today, maxDate);
            return;
        }

        int processedCount = 0;
        int skippedCount = 0;
        int errorCount = 0;
        int totalSeatsReserved = 0;

        for (Voyage voyage : voyages) {
            Optional<Long> voyageIdOpt = Optional.ofNullable(voyage).map(Voyage::getId);
            Optional<LocalDateTime> departureTimeOpt = Optional.ofNullable(voyage).map(Voyage::getDepartureTime);

            if (voyageIdOpt.isEmpty() || departureTimeOpt.isEmpty()) {
                skippedCount++;
                continue;
            }

            long diff = ChronoUnit.DAYS.between(today, departureTimeOpt.get().toLocalDate());
            if (diff < 0 || diff > MAX_DAYS_AHEAD) {
                skippedCount++;
                continue;
            }

            try {
                List<String> usableSeatNumbers = getUsableSeatNumbersForCrafter(voyage.getCrafter());
                int seatCapacity = usableSeatNumbers.size();

                int targetOccupancy = calculateTargetOccupancy((int) diff, seatCapacity);

                List<Seat> existingSeats = seatService.findByVoyageId(voyageIdOpt.get());
                int currentOccupied = existingSeats.size();

                if (currentOccupied < targetOccupancy) {
                    int seatsToAdd = targetOccupancy - currentOccupied;
                    int reserved = reserveRandomSeats(voyage, seatsToAdd, existingSeats, usableSeatNumbers);
                    if (reserved > 0) {
                        processedCount++;
                        totalSeatsReserved += reserved;
                    } else {
                        skippedCount++;
                    }
                } else {
                    skippedCount++;
                }
            } catch (Exception e) {
                log.error("Error processing voyage {}: {}", voyageIdOpt.orElse(null), e.getMessage());
                errorCount++;
            }
        }

        long duration = System.currentTimeMillis() - startTime;
        log.info("Batch completed in {}ms - Processed: {}, Seats reserved: {}, Skipped: {}, Errors: {}", duration, processedCount, totalSeatsReserved, skippedCount, errorCount);
    }

    /**
     * Resolves all valid passenger seat numbers for a vehicle based on its configuration:
     * 1. Custom seatConfig JSON layout (if defined on the Crafter)
     * 2. Standard configuration file name (10places.json, 18places.json, 22places.json)
     * 3. Nominal seatCapacity fallback
     */
    private List<String> getUsableSeatNumbersForCrafter(Crafter crafter) {
        return Optional.ofNullable(crafter)
                .flatMap(c -> Optional.ofNullable(c.getSeatConfig())
                        .map(this::parseUsableSeatsFromConfig)
                        .filter(seats -> Boolean.FALSE.equals(seats.isEmpty())))
                .or(() -> Optional.ofNullable(crafter)
                        .map(Crafter::getConfigName)
                        .filter(StringUtils::hasText)
                        .map(this::getSeatsByConfigName)
                        .filter(seats -> Boolean.FALSE.equals(seats.isEmpty())))
                .orElseGet(() -> {
                    int capacity = Optional.ofNullable(crafter)
                            .map(Crafter::getSeatCapacity)
                            .orElse(DEFAULT_SEAT_CAPACITY);
                    return switch (capacity) {
                        case 10 -> List.of("1", "3", "4", "5", "6", "7", "8", "9", "10", "12");
                        case 18 -> IntStream.rangeClosed(3, 20).mapToObj(String::valueOf).toList();
                        case 22 -> IntStream.rangeClosed(3, 24).mapToObj(String::valueOf).toList();
                        default -> IntStream.rangeClosed(3, capacity).mapToObj(String::valueOf).toList();
                    };
                });
    }

    /**
     * Parses usable passenger seats from a seatConfig object or JSON string using typed DTO.
     * Excludes hidden spaces (hide = true) and driver/disabled seats (disable = true).
     */
    private List<String> parseUsableSeatsFromConfig(Object seatConfig) {
        return Optional.ofNullable(seatConfig)
                .map(config -> {
                    try {
                        CrafterConfigLayout layout = (config instanceof String rawJson)
                                ? OBJECT_MAPPER.readValue(rawJson, CrafterConfigLayout.class)
                                : OBJECT_MAPPER.convertValue(config, CrafterConfigLayout.class);

                        return Optional.ofNullable(layout)
                                .map(CrafterConfigLayout::seats)
                                .stream()
                                .flatMap(List::stream)
                                .filter(Objects::nonNull)
                                .flatMap(List::stream)
                                .filter(Objects::nonNull)
                                .filter(SeatLayoutItem::isUsable)
                                .map(seat -> String.valueOf(seat.id()))
                                .toList();
                    } catch (Exception e) {
                        log.warn("Could not parse seatConfig object: {}", e.getMessage());
                        return List.<String>of();
                    }
                })
                .orElseGet(List::of);
    }

    /**
     * Standard seat numbers for predefined layout configurations.
     */
    private List<String> getSeatsByConfigName(String configName) {
        return Optional.ofNullable(configName)
                .map(String::trim)
                .map(String::toLowerCase)
                .map(name -> switch (name) {
                    case "10places.json", "10places" -> List.of("1", "3", "4", "5", "6", "7", "8", "9", "10", "12");
                    case "18places.json", "18places" -> IntStream.rangeClosed(3, 20).mapToObj(String::valueOf).toList();
                    case "22places.json", "22places" -> IntStream.rangeClosed(3, 24).mapToObj(String::valueOf).toList();
                    default -> List.<String>of();
                })
                .orElseGet(List::of);
    }

    /**
     * Calculates the target number of occupied seats on a voyage based on days left before departure.
     */
    private int calculateTargetOccupancy(int daysUntilDeparture, int seatCapacity) {
        double minRatio;
        double maxRatio;

        switch (daysUntilDeparture) {
            case 0 -> {
                minRatio = 0.90;
                maxRatio = 1.00;
            }
            case 1 -> {
                minRatio = 0.80;
                maxRatio = 0.95;
            }
            case 2 -> {
                minRatio = 0.65;
                maxRatio = 0.85;
            }
            case 3 -> {
                minRatio = 0.50;
                maxRatio = 0.75;
            }
            case 4 -> {
                minRatio = 0.40;
                maxRatio = 0.65;
            }
            case 5 -> {
                minRatio = 0.30;
                maxRatio = 0.50;
            }
            case 6 -> {
                minRatio = 0.20;
                maxRatio = 0.40;
            }
            default -> {
                minRatio = 0.15;
                maxRatio = 0.35;
            }
        }

        int minSeats = (int) Math.round(seatCapacity * minRatio);
        int maxSeats = (int) Math.round(seatCapacity * maxRatio);

        if (maxSeats < minSeats) {
            maxSeats = minSeats;
        }

        int target = minSeats + (maxSeats > minSeats ? random.nextInt(maxSeats - minSeats + 1) : 0);
        return Math.min(target, seatCapacity);
    }

    private int reserveRandomSeats(Voyage voyage, int count, List<Seat> existingSeats, List<String> usableSeatNumbers) {
        Set<String> reservedSeatNumbers = existingSeats.stream()
                .map(Seat::getSeatNum)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<String> availableSeatNumbers = usableSeatNumbers.stream()
                .filter(seatNum -> Boolean.FALSE.equals(reservedSeatNumbers.contains(seatNum)))
                .collect(Collectors.toList());

        if (availableSeatNumbers.isEmpty()) {
            return 0;
        }

        Collections.shuffle(availableSeatNumbers);
        List<String> seatsToBook = availableSeatNumbers.stream().limit(count).toList();

        if (seatsToBook.isEmpty()) {
            return 0;
        }

        ReservationWithoutVoyageurRequest request = new ReservationWithoutVoyageurRequest();
        request.setVoyageId(voyage.getId());
        Optional.ofNullable(voyage.getClasse()).map(Classe::getId).ifPresent(request::setClasseId);
        Optional.ofNullable(voyage.getCrafter()).map(Crafter::getId).ifPresent(request::setCrafterId);

        request.setSeatNumbers(seatsToBook);
        request.setNotes("AUTO_BATCH");

        try {
            Reservation reservation = reservationService.confirmReservationWithoutVoyageur(request);
            log.info("Auto-reserved {} seats for voyage {} (target: {}, reservation #{})", seatsToBook.size(), voyage.getId(), count, reservation.getId());
            return seatsToBook.size();
        } catch (Exception e) {
            log.error("Failed to reserve seats for voyage {}: {}", voyage.getId(), e.getMessage());
            return 0;
        }
    }
}
