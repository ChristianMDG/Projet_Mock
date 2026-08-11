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
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.enums.RecurrenceTypeEnum;
import mg.taxibrousse.entities.enums.VoyageStatusEnum;
import mg.taxibrousse.models.Koperative;
import mg.taxibrousse.models.Voyage;
import mg.taxibrousse.models.VoyageScheduler;
import mg.taxibrousse.params.VoyageFilter;
import mg.taxibrousse.repositories.IVoyageRepository;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoyageService implements IVoyageService {

    private final IVoyageRepository voyageRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    @CacheEvict(value = "voyages", key = "#voyage.id", condition = "#voyage.id != null")
    public Voyage save(Voyage voyage) {
        return Voyage.fromEntity(voyageRepository.save(voyage.toEntity()));
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
    @CacheEvict(value = "voyages", key = "#id")
    public void deleteById(Long id) {
        voyageRepository.deleteById(id);
    }

    @Override
    public List<Voyage> findVoyagesByKoperativeId(Long koperativeId) {
        return convertToVoyages(voyageRepository.findByKoperativeId(koperativeId));
    }

    @Override
    @Transactional
    public List<Voyage> scheduleVoyage(VoyageScheduler request) {
        validateResourceAvailability(request);

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

    private void validateResourceAvailability(VoyageScheduler request) {
        boolean hasCrafter = request.getCrafterId() != null;
        boolean hasChauffeur = request.getChauffeurId() != null;
        boolean resourcesUnavailable = !isResourceAvailable(
                request.getCrafterId(),
                request.getChauffeurId(),
                request.getDepartureTime(),
                request.getEstimatedArrivalTime(),
                null
        );
        if (hasCrafter && hasChauffeur && resourcesUnavailable) {
            throw new IllegalArgumentException("Resources are not available for the specified time");
        }
    }

    private Voyage saveVoyageEntity(VoyageEntity entity) {
        return Voyage.fromEntity(voyageRepository.save(entity));
    }

    private List<Voyage> convertToVoyages(List<VoyageEntity> entities) {
        return entities.stream().map(Voyage::fromEntity).toList();
    }

    @Override
    public List<Voyage> generateRecurringInstances(Voyage template, int maxInstances) {
        if (!hasValidRecurrenceDates(template)) {
            return List.of();
        }

        List<Voyage> instances = new ArrayList<>();
        LocalDateTime currentDateTime = template.getDepartureTime();
        LocalDateTime endDateTime = template.getRecurrenceEndDate().atTime(23, 59);
        int count = 0;

        while (currentDateTime.isBefore(endDateTime) && count < maxInstances) {
            Voyage instance = createInstanceFromTemplate(template, currentDateTime);

            if (isInstanceResourceAvailable(instance)) {
                instances.add(saveVoyageEntity(instance.toEntity()));
                count++;
            }

            currentDateTime = getNextOccurrence(currentDateTime, template);
        }
        return instances;
    }

    private boolean hasValidRecurrenceDates(Voyage template) {
        return template.getRecurrenceStartDate() != null && template.getRecurrenceEndDate() != null;
    }

    private boolean isInstanceResourceAvailable(Voyage instance) {
        Long crafterId = instance.getCrafter() != null ? instance.getCrafter().getId() : null;
        Long chauffeurId = instance.getChauffeur() != null ? instance.getChauffeur().getId() : null;

        return isResourceAvailable(
                crafterId,
                chauffeurId,
                instance.getDepartureTime(),
                instance.getEstimatedArrivalTime(),
                null
        );
    }

    @Override
    public boolean isResourceAvailable(
            Long crafterId,
            Long chauffeurId,
            LocalDateTime departureTime,
            LocalDateTime estimatedArrivalTime,
            Long excludeVoyageId
    ) {
        if (crafterId == null && chauffeurId == null) {
            return true;
        }
        return !voyageRepository.isResourceConflicting(
                crafterId,
                chauffeurId,
                departureTime,
                estimatedArrivalTime,
                excludeVoyageId
        );
    }

    @Override
    public List<Voyage> findVoyagesByDateRange(LocalDate startDate, LocalDate endDate) {
        var startDateTime = startDate.atStartOfDay();
        var endDateTime = endDate.atTime(LocalTime.MAX);
        return convertToVoyages(voyageRepository.findByDepartureTimeBetween(startDateTime, endDateTime));
    }

    @Override
    public List<Voyage> findAvailableVoyages(Long departureGareId, Long arrivalGareId, LocalDateTime departureDate) {
        return convertToVoyages(voyageRepository.findAvailableVoyages(departureGareId, arrivalGareId, departureDate));
    }

    @Override
    public List<Voyage> findScheduledVoyagesByGare(Long gareId) {
        return convertToVoyages(voyageRepository.findByGareIdAndStatus(gareId, VoyageStatusEnum.SCHEDULED));
    }

    @Override
    public List<Voyage> findScheduledVoyagesByGares(List<Long> gareIds) {
        return convertToVoyages(voyageRepository.findByGareIdsAndStatus(gareIds, VoyageStatusEnum.SCHEDULED));
    }

    @Override
    public List<Voyage> findFilteredVoyages(VoyageFilter filter) {
        List<VoyageEntity> entities = voyageRepository.findFilteredVoyages(
                filter.getKoperativeId(),
                filter.getDepartureVilleId(),
                filter.getArrivalVilleId(),
                filter.getDepartureGareId(),
                filter.getArrivalGareId()
        );

        return convertToVoyages(applyClientSideFilters(entities, filter));
    }

    private List<VoyageEntity> applyClientSideFilters(List<VoyageEntity> entities, VoyageFilter filter) {
        return entities
                .stream()
                .filter(entity -> isDateMatch(entity, filter.getDepartureDate()))
                .filter(entity -> isStatusMatch(entity, filter.getStatus()))
                .filter(entity -> isPassengerMatch(entity, filter.getPassengers()))
                .toList();
    }

    private boolean isDateMatch(VoyageEntity entity, LocalDate filterDate) {
        if (filterDate == null) {
            return true;
        }
        return (entity.getDepartureTime() != null && entity.getDepartureTime().toLocalDate().equals(filterDate));
    }

    private boolean isStatusMatch(VoyageEntity entity, VoyageStatusEnum status) {
        if (status == null) {
            return true;
        }
        return entity.getStatus() == status;
    }

    private boolean isPassengerMatch(VoyageEntity entity, Integer passengers) {
        if (passengers == null || passengers <= 0) {
            return true;
        }
        return entity.getAvailableSeats() >= passengers;
    }

    private Voyage createInstanceFromTemplate(Voyage template, LocalDateTime departureTime) {
        var instance = new Voyage();
        copyTemplateProperties(instance, template);
        setInstanceTiming(instance, template, departureTime);
        setInstanceDefaults(instance, template);
        return instance;
    }

    private void copyTemplateProperties(Voyage instance, Voyage template) {
        instance.setKoperative(template.getKoperative());
        instance.setRoute(template.getRoute());
        instance.setDepartureGare(template.getDepartureGare());
        instance.setArrivalGare(template.getArrivalGare());
        instance.setCrafter(template.getCrafter());
        instance.setChauffeur(template.getChauffeur());
        instance.setClasse(template.getClasse());
        instance.setAvailableSeats(template.getAvailableSeats());
        instance.setPricePerSeat(template.getPricePerSeat());
        instance.setDescription(template.getDescription());
    }

    private void setInstanceTiming(Voyage instance, Voyage template, LocalDateTime departureTime) {
        instance.setDepartureTime(departureTime);

        if (template.getEstimatedArrivalTime() != null) {
            long duration = ChronoUnit.MINUTES.between(template.getDepartureTime(), template.getEstimatedArrivalTime());
            instance.setEstimatedArrivalTime(departureTime.plusMinutes(duration));
        }
    }

    private void setInstanceDefaults(Voyage instance, Voyage template) {
        instance.setRecurrenceType(RecurrenceTypeEnum.ONE_OFF);
        instance.setIsTemplate(false);
        instance.setParentTemplate(template);
        instance.setStatus(template.getStatus() != null ? template.getStatus() : VoyageStatusEnum.SCHEDULED);
    }

    private LocalDateTime getNextOccurrence(LocalDateTime current, Voyage template) {
        return switch (template.getRecurrenceType()) {
            case WEEKLY ->
                getNextWeeklyOccurrence(current, template);
            case MONTHLY ->
                getNextMonthlyOccurrence(current, template);
            case CUSTOM -> {
                int interval = Optional.ofNullable(template.getCustomInterval()).orElse(1);
                yield current.plusDays(interval);
            }
            default ->
                current.plusDays(1);
        };
    }

    private LocalDateTime getNextWeeklyOccurrence(LocalDateTime current, Voyage template) {
        List<Integer> weekdays = parseWeekdays(template.getWeekdays());
        if (weekdays.isEmpty()) {
            return current.plusWeeks(1);
        }

        for (int i = 1; i <= 7; i++) {
            LocalDateTime next = current.plusDays(i);
            if (weekdays.contains(next.getDayOfWeek().getValue())) {
                return next;
            }
        }
        return current.plusWeeks(1);
    }

    private LocalDateTime getNextMonthlyOccurrence(LocalDateTime current, Voyage template) {
        List<Integer> monthlyDates = parseMonthlyDates(template.getMonthlyDates());
        if (monthlyDates.isEmpty()) {
            return current.plusMonths(1);
        }

        for (int i = 1; i <= 31; i++) {
            LocalDateTime next = current.plusDays(i);
            if (monthlyDates.contains(next.getDayOfMonth())) {
                return next;
            }
        }
        return current.plusMonths(1);
    }

    private List<Integer> parseWeekdays(String weekdaysJson) {
        if (weekdaysJson == null) {
            return List.of();
        }
        try {
            return objectMapper.readValue(weekdaysJson, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            log.error("Error parsing weekdays: {}", weekdaysJson, e);
            return List.of();
        }
    }

    private List<Integer> parseMonthlyDates(String monthlyDatesJson) {
        if (monthlyDatesJson == null) {
            return List.of();
        }
        try {
            return objectMapper.readValue(monthlyDatesJson, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            log.error("Error parsing monthly dates: {}", monthlyDatesJson, e);
            return List.of();
        }
    }

    // Enhanced Scheduler Methods Implementation
    @Override
    @Transactional
    public int processActiveTemplates() {
        List<VoyageEntity> activeTemplates = voyageRepository.findActiveTemplates();
        int totalGenerated = 0;

        for (VoyageEntity templateEntity : activeTemplates) {
            Voyage template = Voyage.fromEntity(templateEntity);
            List<Voyage> newInstances = generateRecurringInstances(template, 50);
            totalGenerated += newInstances.size();

            log.info("Generated {} instances for template ID: {}", newInstances.size(), template.getId());
        }

        log.info("Processed {} active templates, generated {} total instances", activeTemplates.size(), totalGenerated);
        return totalGenerated;
    }

    @Override
    @Transactional
    public int batchGenerateInstances(List<Long> templateIds, int maxInstancesPerTemplate) {
        int totalGenerated = 0;

        for (Long templateId : templateIds) {
            VoyageEntity templateEntity = voyageRepository.findById(templateId).orElse(null);
            if (templateEntity != null && Boolean.TRUE.equals(templateEntity.getIsTemplate())) {
                Voyage template = Voyage.fromEntity(templateEntity);
                List<Voyage> newInstances = generateRecurringInstances(template, maxInstancesPerTemplate);
                totalGenerated += newInstances.size();
            }
        }

        log.info("Batch generated {} total instances for {} templates", totalGenerated, templateIds.size());
        return totalGenerated;
    }

    @Override
    public List<Voyage> findInstancesByTemplate(Long templateId) {
        return convertToVoyages(voyageRepository.findByParentTemplateId(templateId));
    }

    @Override
    @Transactional
    public List<Voyage> updateTemplateAndRegenerate(Long templateId, Voyage updatedTemplate) {
        // Update the template
        updatedTemplate.setId(templateId);
        updatedTemplate.setIsTemplate(true);
        Voyage savedTemplate = saveVoyageEntity(updatedTemplate.toEntity());

        // Cancel future instances that haven't started yet
        cancelFutureInstances(templateId, LocalDate.now().plusDays(1));

        // Generate new instances based on updated template
        List<Voyage> newInstances = generateRecurringInstances(savedTemplate, 100);

        List<Voyage> result = new ArrayList<>();
        result.add(savedTemplate);
        result.addAll(newInstances);

        return result;
    }

    @Override
    @Transactional
    public int cancelFutureInstances(Long templateId, LocalDate fromDate) {
        List<VoyageEntity> futureInstances = voyageRepository
                .findByParentTemplateId(templateId)
                .stream()
                .filter(instance -> instance.getDepartureTime().toLocalDate().isAfter(fromDate.minusDays(1)))
                .filter(instance -> instance.getStatus() == VoyageStatusEnum.SCHEDULED)
                .toList();

        int cancelledCount = 0;
        for (VoyageEntity instance : futureInstances) {
            instance.setStatus(VoyageStatusEnum.CANCELLED);
            voyageRepository.save(instance);
            cancelledCount++;
        }

        log.info("Cancelled {} future instances for template ID: {}", cancelledCount, templateId);
        return cancelledCount;
    }

    @Override
    public List<Voyage> findPreviousVoyages(Long voyageurId) {
        List<VoyageEntity> entities = voyageRepository.findByPreviousDate(voyageurId);

        return entities.stream()
                .map(Voyage::fromEntity)
                .toList();
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
        LocalDateTime weekEnd = weekEndDate.atTime(LocalTime.MAX);        // Move as many filters as possible to the repository
        List<VoyageEntity> filteredVoyages = voyageRepository.findWeeklyFiltered(
                weekStart, weekEnd,
                filter.getKoperativeId(),
                filter.getDepartureGareId(),
                filter.getDepartureVilleId(),
                filter.getArrivalGareId(),
                filter.getArrivalVilleId(),
                null, null,
                filter.getPassengers()
        );

        Map<LocalDate, List<VoyageEntity>> voyagesByDate = filteredVoyages.stream()
                .collect(Collectors.groupingBy(v -> v.getDepartureTime().toLocalDate()));

        List<VoyageWeeklyResult> weeklyResults = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate currentDate = weekStartDate.plusDays(i);
            List<VoyageEntity> dayVoyages = voyagesByDate.getOrDefault(currentDate, List.of());
            weeklyResults.add(buildDailyResult(currentDate, dayVoyages));
        }

        var koperativeSummaries = buildKoperativeSummaries(filteredVoyages);

        return new VoyageWeeklyResponse(
                Long.valueOf(baseDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"))),
                weekStartDate, weekEndDate,
                baseDate, weeklyResults, koperativeSummaries
        );
    }

    private List<KoperativeWeeklySummary> buildKoperativeSummaries(List<VoyageEntity> voyages) {
        if (voyages.isEmpty()) {
            return List.of();
        }

        return voyages.stream()
                .collect(Collectors.groupingBy(v -> v.getKoperative().getId()))
                .values().stream().map(KoperativeWeeklySummary::from)
                .sorted((a, b) -> b.getVoyageCount().compareTo(a.getVoyageCount()))
                .toList();
    }

    /**
     * Maps language codes to appropriate locales for week calculation
     */
    private Locale getLocaleFromLanguage(String language) {
        return switch (language) {
            case "fr" ->
                Locale.FRANCE;
            case "en" ->
                Locale.US;
            default ->
                Locale.US; // MG, US
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

        List<BigDecimal> prices = voyages.stream()
                .map(VoyageEntity::getPricePerSeat)
                .toList();
        List<Koperative> availableKoperatives = voyages.stream()
                .map(VoyageEntity::getKoperative)
                .distinct()
                .map(k -> Koperative.fromEntity(k, false))
                .toList();

        BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(null);
        BigDecimal maxPrice = prices.stream().max(BigDecimal::compareTo).orElse(null);
        BigDecimal avgPrice = calculateAverage(prices);

        int totalSeats = voyages.stream()
                .mapToInt(VoyageEntity::getAvailableSeats)
                .sum();

        result.setMinPrice(minPrice);
        result.setMaxPrice(maxPrice);
        result.setAvgPrice(avgPrice);
        result.setTotalVoyages(voyages.size());
        result.setTotalAvailableSeats(totalSeats);
        result.setHasVoyages(true);
        result.setVoyages(voyages.stream().map(Voyage::fromEntity).toList());
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
    public VoyageMonthlyResponse getMonthlyResults(
            Long departureVilleId,
            Long arrivalVilleId,
            String month,
            Long koperativeId,
            Integer passengers,
            String language
    ) {
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate monthStart = yearMonth.atDay(1);
        LocalDate monthEnd = yearMonth.atEndOfMonth();

        List<VoyageEntity> voyages = voyageRepository.findMonthlyFiltered(
                monthStart.atStartOfDay(),
                monthEnd.atTime(LocalTime.MAX),
                departureVilleId,
                arrivalVilleId,
                koperativeId,
                (passengers != null && passengers > 0) ? passengers : null
        );

        Map<LocalDate, List<VoyageEntity>> voyagesByDate = voyages.stream()
                .collect(Collectors.groupingBy(v -> v.getDepartureTime().toLocalDate()));

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

        List<BigDecimal> prices = voyages.stream()
                .map(VoyageEntity::getPricePerSeat)
                .toList();

        BigDecimal minPrice = prices.stream().min(BigDecimal::compareTo).orElse(null);
        BigDecimal maxPrice = prices.stream().max(BigDecimal::compareTo).orElse(null);
        int totalSeats = voyages.stream().mapToInt(VoyageEntity::getAvailableSeats).sum();

        return new VoyageMonthlyResponse.DayResult(date, true, minPrice, maxPrice, voyages.size(), totalSeats);
    }

    @Override
    public List<VoyageClasses> findGroupedFilteredVoyages(VoyageFilter filter) {
        List<Voyage> voyages = findFilteredVoyages(filter);

        Map<String, List<Voyage>> grouped = voyages.stream()
                .collect(Collectors.groupingBy(v -> {
                    String koperativeId = v.getKoperative() != null ? String.valueOf(v.getKoperative().getId()) : "null";
                    String depTime = v.getDepartureTime() != null ? v.getDepartureTime().toString() : "null";
                    String depGareId = v.getDepartureGare() != null ? String.valueOf(v.getDepartureGare().getId()) : "null";
                    String arrGareId = v.getArrivalGare() != null ? String.valueOf(v.getArrivalGare().getId()) : "null";
                    return koperativeId + "-" + depTime + "-" + depGareId + "-" + arrGareId;
                }));

        return grouped.values().stream()
                .map(group -> {
                    Voyage rep = group.get(0);
                    VoyageClasses vg = new VoyageClasses();
                    vg.setKoperative(rep.getKoperative());
                    vg.setDepartureGare(rep.getDepartureGare());
                    vg.setArrivalGare(rep.getArrivalGare());
                    vg.setDepartureTime(rep.getDepartureTime() != null ? rep.getDepartureTime().toString() : null);
                    vg.setEstimatedArrivalTime(rep.getEstimatedArrivalTime() != null ? rep.getEstimatedArrivalTime().toString() : null);
                    vg.setVoyages(group);
                    return vg;
                })
                .sorted(Comparator.comparing(VoyageClasses::getDepartureTime, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }
}
