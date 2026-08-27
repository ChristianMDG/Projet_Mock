package mg.taxibrousse.services.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.KoperativeWeeklySummary;
import mg.taxibrousse.dto.VoyageClasses;
import mg.taxibrousse.dto.VoyageMonthlyResponse;
import mg.taxibrousse.dto.VoyageWeeklyResponse;
import mg.taxibrousse.dto.VoyageWeeklyResult;
import mg.taxibrousse.entities.BaseEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.entities.enums.DepartureTimeGroupEnum;
import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.models.VoyageScheduler;
import mg.taxibrousse.models.Commission;
import mg.taxibrousse.params.VoyageFilter;
import mg.taxibrousse.repositories.IRouteRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.services.ICommissionService;
import mg.taxibrousse.services.IVoyageService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoyageService implements IVoyageService {

    private final IVoyageRepository voyageRepository;
    private final IRouteRepository routeRepository;
    private final ObjectMapper objectMapper;
    private final ICommissionService commissionService;

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "seats"}, allEntries = true)
    public Voyage save(Voyage voyage) {
        return saveVoyageEntity(voyage.toEntity());
    }

    @Override
    public Page<Voyage> findAllVoyages(Pageable pageable) {
        Page<VoyageEntity> entityPage = voyageRepository.findAllWithRelations(pageable);
        return entityPage.map(Voyage::fromEntity);
    }

    @Override
    @Cacheable(value = "voyages", key = "#id", unless = "#result == null")
    public Voyage findVoyageById(Long id) {
        VoyageEntity entity = voyageRepository.findById(id).orElse(null);
        return Voyage.fromEntity(entity);
    }

    @Override
    @CacheEvict(value = {"voyages", "routes"}, allEntries = true)
    public void deleteById(Long id) {
        voyageRepository.deleteById(id);
    }

    @Override
    @Cacheable(value = "voyages", key = "'koperative-' + #koperativeId")
    public List<Voyage> findVoyagesByKoperativeId(Long koperativeId) {
        return convertToVoyages(voyageRepository.findByKoperativeId(koperativeId));
    }

    @Override
    @Transactional
    @CacheEvict(value = {"voyages", "routes"}, allEntries = true)
    public List<Voyage> scheduleVoyage(VoyageScheduler request) {
        List<Voyage> voyages = new ArrayList<>();
        if (request.getRecurrenceType() == RecurrenceTypeEnum.ONE_OFF) {
            voyages.add(saveVoyageEntity(request.toVoyage().toEntity()));
        } else {
            Voyage template = request.toTemplateVoyage(objectMapper);
            template.setIsTemplate(true);
            template = saveVoyageEntity(template.toEntity());
            voyages.addAll(generateRecurringInstances(template, 100));
        }
        return voyages;
    }

    private Voyage saveVoyageEntity(VoyageEntity entity) {
        if (entity.getPriceKoperative() != null && entity.getKoperative() != null) {
            BigDecimal commissionAmount = commissionService.findByKoperativeIdAndAmount(entity.getKoperative().getId(), entity.getPriceKoperative()).map(Commission::getFrais).orElse(BigDecimal.ZERO);
            entity.setPricePerSeat(entity.getPriceKoperative().add(commissionAmount));
        }
        VoyageEntity saved = voyageRepository.save(entity);
        syncRouteMinPrice(saved);
        return Voyage.fromEntity(saved);
    }

    /** Propagate the cheapest voyage pricePerSeat to its Route.fraisTaxibrousse. */
    private void syncRouteMinPrice(VoyageEntity voyage) {
        Long routeId = Optional.ofNullable(voyage.getRoute()).map(BaseEntity::getId).orElse(null);
        if (routeId == null) {
            return;
        }
        BigDecimal minPrice = voyageRepository.findMinPricePerSeatByRouteId(routeId);
        if (minPrice == null) {
            return;
        }
        routeRepository.findById(routeId).ifPresent(route -> {
            BigDecimal current = route.getFraisTaxibrousse();
            if (minPrice.equals(current))
                return;
            route.setFraisTaxibrousse(minPrice);
            routeRepository.save(route);
        });
    }

    private List<Voyage> convertToVoyages(List<VoyageEntity> entities) {
        return entities.stream().map(Voyage::fromEntity).toList();
    }

    @Override
    public List<Voyage> generateRecurringInstances(Voyage template, int maxInstances) {
        if (template.getRecurrenceStartDate() == null || template.getRecurrenceEndDate() == null) {
            return List.of();
        }
        if (template.getRecurrenceStartDate().isAfter(template.getRecurrenceEndDate())) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        List<Voyage> instances = new ArrayList<>();
        LocalDateTime current = template.getRecurrenceStartDate().atTime(template.getDepartureTime().toLocalTime());
        LocalDateTime end = template.getRecurrenceEndDate().atTime(23, 59);

        while (current.isBefore(end) && instances.size() < maxInstances) {
            Voyage instance = createInstanceFromTemplate(template, current);
            instances.add(saveVoyageEntity(instance.toEntity()));
            current = getNextOccurrence(current, template);
        }

        log.info("Generated {} instances from {} to {}", instances.size(), template.getRecurrenceStartDate(), template.getRecurrenceEndDate());
        return instances;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Voyage> findVoyagesByDateRange(LocalDate startDate, LocalDate endDate) {
        var startDateTime = startDate.atStartOfDay();
        var endDateTime = endDate.atTime(LocalTime.MAX);
        return convertToVoyages(voyageRepository.findByDepartureTimeBetween(startDateTime, endDateTime));
    }

    @Override
    @Cacheable(value = "voyages", key = "'available:' + #departureGareId + ':' + #arrivalGareId + ':' + #departureDate", unless = "#result == null or #result.isEmpty()")
    public List<Voyage> findAvailableVoyages(Long departureGareId, Long arrivalGareId, LocalDateTime departureDate) {
        return convertToVoyages(voyageRepository.findAvailableVoyages(departureGareId, arrivalGareId, departureDate));
    }

    @Override
    @Cacheable(value = "voyages", key = "'gare:' + #gareId")
    public List<Voyage> findScheduledVoyagesByGare(Long gareId) {
        return convertToVoyages(voyageRepository.findByGareIdAndStatus(gareId, VoyageStatusEnum.SCHEDULED));
    }

    @Override
    public List<Voyage> findScheduledVoyagesByGares(List<Long> gareIds) {
        return convertToVoyages(voyageRepository.findByGareIdsAndStatus(gareIds, VoyageStatusEnum.SCHEDULED));
    }

    @Override
    public List<Voyage> findFilteredVoyages(VoyageFilter filter) {
        List<VoyageEntity> entities = voyageRepository.findFilteredVoyages(filter.getKoperativeId(),
                filter.getDepartureVilleId(),
                filter.getArrivalVilleId(),
                filter.getDepartureGareId(),
                filter.getArrivalGareId());

        return convertToVoyages(applyClientSideFilters(entities, filter));
    }

    private List<VoyageEntity> applyClientSideFilters(List<VoyageEntity> entities, VoyageFilter filter) {
        Predicate<VoyageEntity> predicate = dateMatcher(filter).and(statusMatcher(filter)).and(passengersMatcher(filter)).and(departureTimeGroupMatcher(filter));
        return entities.stream().filter(predicate).toList();
    }

    private Predicate<VoyageEntity> departureTimeGroupMatcher(VoyageFilter filter) {
        DepartureTimeGroupEnum group = filter.getDepartureTimeGroup();
        if (group == null) {
            return entity -> true;
        }
        return entity -> group == getDepartureTimeGroup(entity.getDepartureTime().toLocalTime());
    }

    private DepartureTimeGroupEnum getDepartureTimeGroup(LocalTime time) {
        if (isBetween(time, LocalTime.of(5, 0), LocalTime.of(12, 0))) {
            return DepartureTimeGroupEnum.MORNING;
        }
        if (isBetween(time, LocalTime.of(12, 0), LocalTime.of(18, 0))) {
            return DepartureTimeGroupEnum.AFTERNOON;
        }
        return DepartureTimeGroupEnum.NIGHT;
    }

    private boolean isBetween(LocalTime time, LocalTime start, LocalTime end) {
        return (time.equals(start) || time.isAfter(start)) && time.isBefore(end);
    }

    private Predicate<VoyageEntity> dateMatcher(VoyageFilter filter) {
        LocalDate from = filter.getDepartureFrom();
        LocalDate to = filter.getDepartureTo();
        LocalDate exact = filter.getDepartureDate();
        LocalDateTime now = LocalDateTime.now();

        if (Objects.isNull(from) && Objects.isNull(to) && Objects.isNull(exact)) {
            return entity -> entity.getDepartureTime() != null && !entity.getDepartureTime().isBefore(now);
        }

        return entity -> {
            if (Objects.isNull(entity.getDepartureTime())) {
                return false;
            }
            if (entity.getDepartureTime().isBefore(now)) {
                return false;
            }
            LocalDate entityDate = entity.getDepartureTime().toLocalDate();
            boolean afterFrom = Objects.isNull(from) || entityDate.isAfter(from);
            boolean beforeTo = Objects.isNull(to) || entityDate.isBefore(to);
            boolean matchesExact = Objects.isNull(exact) || entityDate.isEqual(exact);
            return afterFrom && beforeTo && matchesExact;
        };
    }

    private Predicate<VoyageEntity> statusMatcher(VoyageFilter filter) {
        VoyageStatusEnum status = filter.getStatus();
        if (Objects.isNull(status)) {
            return entity -> true;
        }
        return entity -> entity.getStatus() == status;
    }

    private Predicate<VoyageEntity> passengersMatcher(VoyageFilter filter) {
        Integer passengers = filter.getPassengers();
        if (Objects.isNull(passengers)) {
            return entity -> true;
        }
        return entity -> entity.getAvailableSeats() >= passengers;
    }

    private Voyage createInstanceFromTemplate(Voyage template, LocalDateTime departureTime) {
        var instance = new Voyage();
        instance.setKoperative(template.getKoperative());
        instance.setRoute(template.getRoute());
        instance.setDepartureGare(template.getDepartureGare());
        instance.setArrivalGare(template.getArrivalGare());
        instance.setCrafter(template.getCrafter());
        instance.setChauffeur(template.getChauffeur());
        instance.setClasse(template.getClasse());
        instance.setAvailableSeats(template.getAvailableSeats());
        instance.setPricePerSeat(template.getPricePerSeat());
        instance.setPourcentageMinimumAvance(template.getPourcentageMinimumAvance());
        instance.setDescription(template.getDescription());
        instance.setDepartureTime(departureTime);
        if (template.getEstimatedArrivalTime() != null) {
            long duration = ChronoUnit.MINUTES.between(template.getDepartureTime(), template.getEstimatedArrivalTime());
            instance.setEstimatedArrivalTime(departureTime.plusMinutes(duration));
        }
        instance.setRecurrenceType(RecurrenceTypeEnum.ONE_OFF);
        instance.setIsTemplate(false);
        instance.setParentTemplate(template);
        instance.setStatus(Objects.requireNonNullElse(template.getStatus(), VoyageStatusEnum.SCHEDULED));
        return instance;
    }

    private LocalDateTime getNextOccurrence(LocalDateTime current, Voyage template) {
        return switch (template.getRecurrenceType()) {
            case DAILY -> current.plusDays(1);
            case WEEKLY -> getNextWeeklyOccurrence(current, template);
            case MONTHLY -> getNextMonthlyOccurrence(current, template);
            case CUSTOM -> current.plusDays(Optional.ofNullable(template.getCustomInterval()).orElse(1));
            case ONE_OFF -> throw new IllegalStateException("ONE_OFF cannot be used in recurring generation");
        };
    }

    private LocalDateTime getNextWeeklyOccurrence(LocalDateTime current, Voyage template) {
        List<Integer> weekdays = parseIntList(template.getWeekdays(), "weekdays");
        if (weekdays.isEmpty()) {
            throw new IllegalArgumentException("Weekly recurrence requires at least one weekday");
        }

        for (int i = 1; i <= 14; i++) {
            LocalDateTime next = current.plusDays(i);
            if (weekdays.contains(next.getDayOfWeek().getValue())) {
                return next;
            }
        }

        throw new IllegalStateException(String.format("No weekly occurrence found within 14 days: %s", weekdays));
    }

    private LocalDateTime getNextMonthlyOccurrence(LocalDateTime current, Voyage template) {
        List<Integer> monthlyDates = parseIntList(template.getMonthlyDates(), "monthly dates");
        if (monthlyDates.isEmpty()) {
            throw new IllegalArgumentException("Monthly recurrence requires at least one date");
        }

        List<Integer> validDates = monthlyDates.stream().filter(d -> d >= 1 && d <= 31).sorted().toList();

        if (validDates.isEmpty()) {
            throw new IllegalArgumentException("Monthly dates must be between 1 and 31");
        }

        LocalDateTime search = current.plusDays(1);
        LocalDateTime maxSearch = current.plusMonths(2);

        while (search.isBefore(maxSearch)) {
            if (validDates.contains(search.getDayOfMonth())) {
                return search;
            }
            search = search.plusDays(1);
        }

        throw new IllegalStateException(String.format("No monthly occurrence found within 2 months: %s", monthlyDates));
    }

    private List<Integer> parseIntList(String json, String label) {
        if (json == null) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            log.error("Error parsing {}: {}", label, json, e);
            return List.of();
        }
    }

    @Override
    public Page<Voyage> findPreviousVoyages(Long voyageurId, Pageable pageable) {
        return voyageRepository.findByPreviousDate(voyageurId, pageable).map(Voyage::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public VoyageWeeklyResponse getWeeklyResults(VoyageFilter filter) {
        LocalDate baseDate = filter.getDepartureDate();
        String language = filter.getLanguage();

        // Simplified locale-aware week calculation
        Locale locale = getLocaleFromLanguage(language);
        DayOfWeek firstDayOfWeek = WeekFields.of(locale).getFirstDayOfWeek();

        // Calculate week boundaries
        LocalDate weekStartDate = baseDate.with(TemporalAdjusters.previousOrSame(firstDayOfWeek));
        LocalDate weekEndDate = weekStartDate.plusDays(6);

        LocalDateTime weekStart = weekStartDate.atStartOfDay();
        LocalDateTime weekEnd = weekEndDate.atTime(LocalTime.MAX); // Move as many filters as possible to the repository

        List<VoyageEntity> allFilteredVoyages = voyageRepository.findWeeklyFiltered(weekStart,
                weekEnd,
                filter.getKoperativeId(),
                filter.getDepartureGareId(),
                filter.getDepartureVilleId(),
                filter.getArrivalGareId(),
                filter.getArrivalVilleId(),
                null,
                null,
                filter.getPassengers());

        LocalDateTime now = LocalDateTime.now();
        Map<LocalDate, List<VoyageEntity>> voyagesByDate = allFilteredVoyages.stream()
                .filter(v -> v.getDepartureTime().isAfter(now))
                .collect(Collectors.groupingBy(v -> v.getDepartureTime().toLocalDate()));

        List<VoyageWeeklyResult> weeklyResults = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate currentDate = weekStartDate.plusDays(i);
            List<VoyageEntity> dayVoyages = voyagesByDate.getOrDefault(currentDate, List.of());

            List<DepartureTimeGroupEnum> availableTimeGroups = calculateAvailableTimeGroups(dayVoyages);

            List<VoyageEntity> filteredDayVoyages = dayVoyages.stream().filter(departureTimeGroupMatcher(filter)).toList();

            VoyageWeeklyResult dailyResult = buildDailyResult(currentDate, filteredDayVoyages);
            dailyResult.setAvailableTimeGroups(availableTimeGroups);
            weeklyResults.add(dailyResult);
        }

        List<VoyageEntity> finalFilteredVoyages = allFilteredVoyages.stream().filter(departureTimeGroupMatcher(filter)).toList();
        var koperativeSummaries = buildKoperativeSummaries(finalFilteredVoyages);

        return new VoyageWeeklyResponse(Long.valueOf(baseDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"))), weekStartDate, weekEndDate, baseDate, weeklyResults, koperativeSummaries);
    }

    private List<KoperativeWeeklySummary> buildKoperativeSummaries(List<VoyageEntity> voyages) {
        if (voyages.isEmpty()) {
            return List.of();
        }

        return voyages.stream().collect(Collectors.groupingBy(v -> v.getKoperative().getId())).values().stream().map(KoperativeWeeklySummary::from).toList();
    }

    /**
     * Maps language codes to appropriate locales for week calculation
     */
    private Locale getLocaleFromLanguage(String language) {
        return switch (language) {
            case "fr" -> Locale.FRANCE;
            case "en" -> Locale.US;
            default -> Locale.US; // MG, US
        };
    }

    private VoyageWeeklyResult buildDailyResult(LocalDate date, List<VoyageEntity> voyages) {
        VoyageWeeklyResult result = new VoyageWeeklyResult();
        result.setDate(date);
        result.setResultId(Long.valueOf(date.format(DateTimeFormatter.ofPattern("yyyyMMdd"))));

        if (voyages.isEmpty()) {
            result.setMinPrice(null);
            result.setMaxPrice(null);
            result.setAvgPrice(null);
            result.setTotalVoyages(0);
            result.setTotalAvailableSeats(0);
            result.setHasVoyages(false);
            result.setVoyages(List.of());
            result.setKoperatives(List.of());
            return result;
        }

        List<BigDecimal> prices = voyages.stream().map(VoyageEntity::getPricePerSeat).toList();
        List<Koperative> availableKoperatives = voyages.stream().map(VoyageEntity::getKoperative).distinct().map(Koperative::fromEntityForSearch).toList();

        BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(null);
        BigDecimal maxPrice = prices.stream().max(BigDecimal::compareTo).orElse(null);
        BigDecimal avgPrice = calculateAverage(prices);

        int totalSeats = voyages.stream().mapToInt(VoyageEntity::getAvailableSeats).sum();

        result.setMinPrice(minPrice);
        result.setMaxPrice(maxPrice);
        result.setAvgPrice(avgPrice);
        result.setTotalVoyages(voyages.size());
        result.setTotalAvailableSeats(totalSeats);
        result.setHasVoyages(true);
        result.setVoyages(voyages.stream().map(Voyage::fromEntityForSearch).toList());
        result.setKoperatives(availableKoperatives);
        return result;
    }

    private BigDecimal calculateAverage(List<BigDecimal> prices) {
        if (prices.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sum = prices.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(prices.size()), 2, RoundingMode.HALF_UP);
    }

    @Override
    public Voyage findVoyageByReservationId(Long reservationId) {
        VoyageEntity entity = voyageRepository.findByReservationId(reservationId);
        return Voyage.fromEntity(entity);
    }

    @Override
    public VoyageMonthlyResponse getMonthlyResults(Long departureVilleId, Long arrivalVilleId, String month, Long koperativeId, Integer passengers, String language) {
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();

        List<VoyageEntity> voyages = voyageRepository.findMonthlyFiltered(monthStart.atStartOfDay(),
                monthEnd.atTime(LocalTime.MAX),
                departureVilleId,
                arrivalVilleId,
                koperativeId,
                (passengers != null && passengers > 0) ? passengers : null);

        Map<LocalDate, List<VoyageEntity>> voyagesByDate = voyages.stream().collect(Collectors.groupingBy(v -> v.getDepartureTime().toLocalDate()));

        List<VoyageMonthlyResponse.DayResult> days = new ArrayList<>();
        for (int day = 1; day <= yearMonth.lengthOfMonth(); day++) {
            LocalDate date = yearMonth.atDay(day);
            List<VoyageEntity> dayVoyages = voyagesByDate.getOrDefault(date, List.of());
            days.add(buildMonthlyDayResult(date, dayVoyages));
        }

        return new VoyageMonthlyResponse(days, monthStart, monthEnd);
    }

    private VoyageMonthlyResponse.DayResult buildMonthlyDayResult(LocalDate date, List<VoyageEntity> voyages) {
        if (voyages.isEmpty()) {
            return new VoyageMonthlyResponse.DayResult(date, false, null, null, 0, 0);
        }

        List<BigDecimal> prices = voyages.stream().map(VoyageEntity::getPricePerSeat).toList();

        BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(null);
        BigDecimal maxPrice = prices.stream().max(BigDecimal::compareTo).orElse(null);
        int totalSeats = voyages.stream().mapToInt(VoyageEntity::getAvailableSeats).sum();

        return new VoyageMonthlyResponse.DayResult(date, true, minPrice, maxPrice, voyages.size(), totalSeats);
    }

    @Override
    public List<VoyageClasses> findGroupedFilteredVoyages(VoyageFilter filter) {
        // Fetch entities directly — avoids the heavy Voyage::fromEntity mapping of findFilteredVoyages
        List<VoyageEntity> entities = voyageRepository.findFilteredVoyages(filter.getKoperativeId(),
                filter.getDepartureVilleId(),
                filter.getArrivalVilleId(),
                filter.getDepartureGareId(),
                filter.getArrivalGareId());

        // Apply client-side filters (date, status, passengers) on the entity level
        List<VoyageEntity> filtered = applyClientSideFilters(entities, filter);

        // Map to lean projection and group
        Map<String, List<Voyage>> grouped = filtered.stream()
                .filter(e -> e.getKoperative() != null && e.getDepartureTime() != null && e.getDepartureGare() != null && e.getArrivalGare() != null)
                .map(Voyage::fromEntityForGrouped)
                .collect(Collectors.groupingBy(Voyage::getKoperativeDepartureDateKey, LinkedHashMap::new, Collectors.toList()));

        return grouped.values().stream().map(group -> {
            Voyage rep = group.getFirst();
            VoyageClasses vg = new VoyageClasses();
            vg.setKoperative(rep.getKoperative());
            vg.setDepartureGare(rep.getDepartureGare());
            vg.setArrivalGare(rep.getArrivalGare());
            vg.setDepartureTime(rep.getDepartureTime().toString());
            vg.setEstimatedArrivalTime(Optional.ofNullable(rep.getEstimatedArrivalTime()).map(LocalDateTime::toString).orElse(null));
            vg.setVoyages(group);
            return vg;
        }).toList();
    }

    @Override
    public List<VoyageClasses> findGroupedFilteredVoyagesByKoperative(VoyageFilter filter) {
        if (filter.getKoperativeId() == null) {
            return List.of();
        }

        List<VoyageEntity> entities = voyageRepository.findFilteredVoyagesByKoperative(filter.getKoperativeId(),
                filter.getDepartureVilleId(),
                filter.getArrivalVilleId(),
                filter.getDepartureGareId(),
                filter.getArrivalGareId());

        List<VoyageEntity> filtered = applyClientSideFilters(entities, filter);

        Map<String, List<Voyage>> grouped = filtered.stream()
                .filter(e -> e.getKoperative() != null && e.getDepartureTime() != null && e.getDepartureGare() != null && e.getArrivalGare() != null)
                .map(Voyage::fromEntityForGrouped)
                .collect(Collectors.groupingBy(Voyage::getKoperativeDepartureDateKey, LinkedHashMap::new, Collectors.toList()));

        return grouped.values().stream().map(group -> {
            Voyage rep = group.getFirst();
            VoyageClasses vg = new VoyageClasses();
            vg.setKoperative(rep.getKoperative());
            vg.setDepartureGare(rep.getDepartureGare());
            vg.setArrivalGare(rep.getArrivalGare());
            vg.setDepartureTime(rep.getDepartureTime().toString());
            vg.setEstimatedArrivalTime(Optional.ofNullable(rep.getEstimatedArrivalTime()).map(LocalDateTime::toString).orElse(null));
            vg.setVoyages(group);
            return vg;
        }).toList();
    }

    private List<DepartureTimeGroupEnum> calculateAvailableTimeGroups(List<VoyageEntity> voyages) {
        if (voyages == null || voyages.isEmpty()) {
            return List.of();
        }
        return voyages.stream().map(v -> getDepartureTimeGroup(v.getDepartureTime().toLocalTime())).distinct().toList();
    }
}
