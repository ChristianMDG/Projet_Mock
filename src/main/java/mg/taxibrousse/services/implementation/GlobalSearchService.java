package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.search.GlobalSearchHitDto;
import mg.taxibrousse.dto.search.GlobalSearchResponse;
import mg.taxibrousse.entities.CategoryEntity;
import mg.taxibrousse.entities.ProductCategoryEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.repositories.ICategoryRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.ISeatRepository;
import mg.taxibrousse.repositories.IVoyageRepository;
import mg.taxibrousse.search.documents.CategorySearchDocument;
import mg.taxibrousse.search.documents.ProductSearchDocument;
import mg.taxibrousse.search.documents.VoyageSearchDocument;
import mg.taxibrousse.search.repositories.ICategorySearchRepository;
import mg.taxibrousse.search.repositories.IProductSearchRepository;
import mg.taxibrousse.search.repositories.IVoyageSearchRepository;
import mg.taxibrousse.services.IGlobalSearchService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GlobalSearchService implements IGlobalSearchService {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final IVoyageRepository voyageRepository;
    private final IProductRepository productRepository;
    private final ICategoryRepository categoryRepository;
    private final ISeatRepository seatRepository;
    private final IVoyageSearchRepository voyageSearchRepository;
    private final IProductSearchRepository productSearchRepository;
    private final ICategorySearchRepository categorySearchRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            rebuildIndex();
        } catch (Exception e) {
            log.warn("Search index initialization deferred: {}", e.getMessage());
        }
    }

    @Override
    public GlobalSearchResponse search(String query, String categoryFilter, int limit) {
        long startTime = System.currentTimeMillis();
        int maxHits = limit > 0 ? limit : 8;
        Pageable pageable = PageRequest.of(0, maxHits);
        String cleanQuery = StringUtils.hasText(query) ? query.trim() : null;

        List<GlobalSearchHitDto> voyages = Collections.emptyList();
        List<GlobalSearchHitDto> products = Collections.emptyList();
        List<GlobalSearchHitDto> categories = Collections.emptyList();
        long totalVoyages = 0;
        long totalProducts = 0;
        long totalCategories = 0;

        try {
            Page<VoyageSearchDocument> voyagePage = searchVoyagesPage(cleanQuery, pageable);
            voyages = voyagePage.getContent().stream().map(this::fromVoyageDoc).toList();
            totalVoyages = voyagePage.getTotalElements();

            Page<ProductSearchDocument> productPage = searchProductsPage(cleanQuery, pageable);
            products = productPage.getContent().stream().map(this::fromProductDoc).toList();
            totalProducts = productPage.getTotalElements();

            Page<CategorySearchDocument> categoryPage = searchCategoriesPage(cleanQuery, PageRequest.of(0, 5));
            categories = categoryPage.getContent().stream().map(this::fromCategoryDoc).toList();
            totalCategories = categoryPage.getTotalElements();
        } catch (Exception e) {
            log.warn("Elasticsearch query failed: {}", e.getMessage());
        }

        return GlobalSearchResponse.builder()
                .voyages(voyages)
                .products(products)
                .categories(categories)
                .totalVoyages(totalVoyages)
                .totalProducts(totalProducts)
                .totalCategories(totalCategories)
                .totalMatches(totalVoyages + totalProducts + totalCategories)
                .tookMs(System.currentTimeMillis() - startTime)
                .build();
    }

    private Page<VoyageSearchDocument> searchVoyagesPage(String query, Pageable pageable) {
        return StringUtils.hasText(query)
                ? voyageSearchRepository.search(query, pageable)
                : voyageSearchRepository.findAll(pageable);
    }

    private Page<ProductSearchDocument> searchProductsPage(String query, Pageable pageable) {
        return StringUtils.hasText(query)
                ? productSearchRepository.search(query, pageable)
                : productSearchRepository.findAll(pageable);
    }

    private Page<CategorySearchDocument> searchCategoriesPage(String query, Pageable pageable) {
        return StringUtils.hasText(query)
                ? categorySearchRepository.search(query, pageable)
                : categorySearchRepository.findAll(pageable);
    }

    @Override
    public synchronized void cleanIndex() {
        log.info("Cleaning global search Elasticsearch indexes...");
        try {
            voyageSearchRepository.deleteAll();
            productSearchRepository.deleteAll();
            categorySearchRepository.deleteAll();
        } catch (Exception e) {
            log.warn("Could not delete Elasticsearch indexes: {}", e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron = "${taxibrousse.search.reindex-cron:0 0 0 * * ?}", zone = "Indian/Antananarivo")
    public synchronized void rebuildIndex() {
        log.info("Rebuilding global search indexes with Elasticsearch starter...");
        long start = System.currentTimeMillis();

        cleanIndex();

        indexVoyages();
        indexProducts();
        indexCategories();

        log.info("Elasticsearch search indexes successfully rebuilt in {} ms.", System.currentTimeMillis() - start);
    }

    @Override
    @Transactional(readOnly = true)
    @Scheduled(cron = "${taxibrousse.search.reindex-voyage-cron:0 0 16 * * ?}", zone = "Indian/Antananarivo")
    public synchronized void reindexVoyages() {
        log.info("Cleaning and reindexing voyages in Elasticsearch (removing past/late departures)...");
        long start = System.currentTimeMillis();
        try {
            voyageSearchRepository.deleteAll();
            indexVoyages();
            log.info("Voyages successfully reindexed in {} ms.", System.currentTimeMillis() - start);
        } catch (Exception e) {
            log.warn("Failed to reindex voyages: {}", e.getMessage());
        }
    }

    private void indexVoyages() {
        LocalDateTime since = LocalDateTime.now();
        List<VoyageEntity> upcoming = voyageRepository.findUpcomingVoyagesForSearchIndex(since);
        Map<Long, Long> reservedSeatsMap = loadReservedSeatsMap(upcoming);
        Set<String> seenSchedules = new HashSet<>();

        List<VoyageSearchDocument> documents = upcoming.stream()
                .filter(v -> seenSchedules.add(toScheduleKey(v)))
                .map(v -> toVoyageDoc(v, reservedSeatsMap))
                .toList();

        try {
            voyageSearchRepository.saveAll(documents);
            log.info("Indexed {} voyages into Elasticsearch", documents.size());
        } catch (Exception e) {
            log.warn("Failed to index voyages into Elasticsearch: {}", e.getMessage());
        }
    }

    private Map<Long, Long> loadReservedSeatsMap(List<VoyageEntity> voyages) {
        if (voyages.isEmpty()) {
            return Collections.emptyMap();
        }
        try {
            List<Long> voyageIds = voyages.stream().map(VoyageEntity::getId).toList();
            return seatRepository.findReservedSeatsCountByVoyageIds(voyageIds).stream()
                    .collect(Collectors.toMap(
                            row -> ((Number) row[0]).longValue(),
                            row -> ((Number) row[1]).longValue(),
                            (existing, replacement) -> existing
                    ));
        } catch (Exception e) {
            log.warn("Could not load reserved seats for voyages: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    private String toScheduleKey(VoyageEntity v) {
        return String.format("%s_%s_%s_%s",
                v.getKoperative().getId(),
                v.getDepartureGare().getId(),
                v.getArrivalGare().getId(),
                v.getDepartureTime().toLocalTime());
    }

    private VoyageSearchDocument toVoyageDoc(VoyageEntity v, Map<Long, Long> reservedSeatsMap) {
        String depVille = v.getDepartureGare().getVille().getName();
        String arrVille = v.getArrivalGare().getVille().getName();
        String timeStr = TIME_FORMATTER.format(v.getDepartureTime());
        String koperativeName = v.getKoperative().getName();
        String depGare = v.getDepartureGare().getName();
        String dateStr = v.getDepartureTime().toLocalDate().toString();

        int totalSeats = v.getAvailableSeats();
        int reservedCount = reservedSeatsMap.getOrDefault(v.getId(), 0L).intValue();
        int actualAvailableSeats = Math.max(0, totalSeats - reservedCount);

        return VoyageSearchDocument.builder()
                .id(String.valueOf(v.getId()))
                .type("VOYAGE")
                .title(String.format("%s ➔ %s", depVille, arrVille))
                .subtitle(String.format("%s • %s", koperativeName, depGare))
                .badge(timeStr)
                .extraInfo(dateStr)
                .departureVilleName(depVille)
                .arrivalVilleName(arrVille)
                .departureDate(dateStr)
                .imageUrl(v.getKoperative().getLogoUrl())
                .price(v.getPricePerSeat())
                .availableSeats(actualAvailableSeats)
                .searchableText(buildSearchText(depVille, arrVille, koperativeName, depGare, timeStr))
                .build();
    }

    private void indexProducts() {
        Map<Long, String> imagesMap = loadPrimaryImages();
        List<ProductSearchDocument> documents = productRepository.findAllActiveForSearchIndex().stream()
                .map(p -> toProductDoc(p, imagesMap))
                .toList();

        try {
            productSearchRepository.saveAll(documents);
            log.info("Indexed {} products into Elasticsearch", documents.size());
        } catch (Exception e) {
            log.warn("Failed to index products into Elasticsearch: {}", e.getMessage());
        }
    }

    private Map<Long, String> loadPrimaryImages() {
        try {
            return productRepository.findProductPrimaryImages().stream()
                    .collect(Collectors.toMap(
                            row -> ((Number) row[0]).longValue(),
                            row -> (String) row[1],
                            (existing, replacement) -> existing
                    ));
        } catch (Exception e) {
            log.warn("Could not load product primary images: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    private ProductSearchDocument toProductDoc(ProductEntity p, Map<Long, String> imagesMap) {
        String categoryName = Optional.ofNullable(p.getCategory())
                .map(ProductCategoryEntity::getName)
                .orElse("");
        return ProductSearchDocument.builder()
                .id(String.valueOf(p.getId()))
                .type("PRODUCT")
                .title(p.getName())
                .subtitle(categoryName)
                .badge(resolveProductBadge(p))
                .extraInfo(p.getSku())
                .imageUrl(resolveProductImageUrl(p, imagesMap))
                .slug(p.getSlug())
                .price(p.getPrice())
                .searchableText(buildSearchText(p.getName(), p.getSku(), categoryName, p.getShortDescription()))
                .build();
    }

    private void indexCategories() {
        List<CategorySearchDocument> documents = categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                .map(this::toCategoryDoc)
                .toList();

        try {
            categorySearchRepository.saveAll(documents);
            log.info("Indexed {} categories into Elasticsearch", documents.size());
        } catch (Exception e) {
            log.warn("Failed to index categories into Elasticsearch: {}", e.getMessage());
        }
    }

    private CategorySearchDocument toCategoryDoc(CategoryEntity c) {
        return CategorySearchDocument.builder()
                .id(String.valueOf(c.getId()))
                .type("CATEGORY")
                .title(c.getName())
                .subtitle("shop_category_subtitle")
                .badge("shop_category_badge")
                .slug(c.getSlug())
                .searchableText(buildSearchText(c.getName(), c.getDescription()))
                .build();
    }

    private String resolveProductBadge(ProductEntity p) {
        if (Boolean.TRUE.equals(p.getIsBestSeller())) {
            return "shop_best_seller";
        }
        if (Boolean.TRUE.equals(p.getIsNew())) {
            return "shop_badge_new";
        }
        return "shop_badge_product";
    }

    private String resolveProductImageUrl(ProductEntity p, Map<Long, String> imagesMap) {
        String primaryUrl = imagesMap.get(p.getId());
        if (StringUtils.hasText(primaryUrl)) {
            return primaryUrl;
        }
        var images = p.getImages();
        if (images != null && images.size() > 0) {
            return images.stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .findFirst()
                    .orElse(images.getFirst())
                    .getUrl();
        }
        return null;
    }

    private static String buildSearchText(String... parts) {
        return Arrays.stream(parts)
                .filter(StringUtils::hasText)
                .collect(Collectors.joining(" "));
    }

    private GlobalSearchHitDto fromVoyageDoc(VoyageSearchDocument doc) {
        return GlobalSearchHitDto.builder()
                .id(doc.getId())
                .type(doc.getType())
                .title(doc.getTitle())
                .subtitle(doc.getSubtitle())
                .badge(doc.getBadge())
                .extraInfo(doc.getExtraInfo())
                .departureVilleName(doc.getDepartureVilleName())
                .arrivalVilleName(doc.getArrivalVilleName())
                .departureDate(doc.getDepartureDate())
                .imageUrl(doc.getImageUrl())
                .price(doc.getPrice())
                .availableSeats(doc.getAvailableSeats())
                .build();
    }

    private GlobalSearchHitDto fromProductDoc(ProductSearchDocument doc) {
        return GlobalSearchHitDto.builder()
                .id(doc.getId())
                .type(doc.getType())
                .title(doc.getTitle())
                .subtitle(doc.getSubtitle())
                .badge(doc.getBadge())
                .extraInfo(doc.getExtraInfo())
                .imageUrl(doc.getImageUrl())
                .slug(doc.getSlug())
                .price(doc.getPrice())
                .build();
    }

    private GlobalSearchHitDto fromCategoryDoc(CategorySearchDocument doc) {
        return GlobalSearchHitDto.builder()
                .id(doc.getId())
                .type(doc.getType())
                .title(doc.getTitle())
                .subtitle(doc.getSubtitle())
                .badge(doc.getBadge())
                .imageUrl(doc.getImageUrl())
                .slug(doc.getSlug())
                .build();
    }
}
