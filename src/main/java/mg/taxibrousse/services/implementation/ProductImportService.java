package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.shop.BulkImportError;
import mg.taxibrousse.dto.shop.BulkImportResult;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.entities.ProductCategoryEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.repositories.IInventoryRepository;
import mg.taxibrousse.repositories.IProductCategoryRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.services.IProductImportService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.HashSet;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductImportService implements IProductImportService {

    private static final String[] HEADERS = {"sku", "name", "shortDescription", "description", "price", "originalPrice", "currency", "stock", "weight", "categorySlug", "isActive", "isFeatured",
            "isNew", "isBestSeller", "tags"};

    private final IProductRepository productRepository;
    private final IProductCategoryRepository categoryRepository;
    private final IInventoryRepository inventoryRepository;
    private final PlatformTransactionManager transactionManager;

    @Override
    public BulkImportResult importCsv(MultipartFile file, boolean dryRun) {
        if (file == null || file.isEmpty()) {
            throw new ShopException("error_file_required", "exception_file_required");
        }

        TransactionTemplate template = buildTemplate();
        return template.execute(status -> {
            BulkImportResult result = new BulkImportResult();
            result.setDryRun(dryRun);

            CSVFormat format = CSVFormat.DEFAULT.builder().setHeader(HEADERS).setSkipHeaderRecord(true).setIgnoreEmptyLines(true).setIgnoreSurroundingSpaces(true).setTrim(true).build();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)); CSVParser parser = CSVParser.parse(reader, format)) {

                Set<String> skusInBatch = new HashSet<>();
                for (CSVRecord record : parser) {
                    result.setTotalRows(result.getTotalRows() + 1);
                    int line = (int) record.getRecordNumber() + 1; // +1 for header line
                    try {
                        processRecord(record, line, skusInBatch, result);
                    } catch (RowImportException ex) {
                        result.getErrors().add(ex.toError(line));
                        result.setFailureCount(result.getFailureCount() + 1);
                    } catch (Exception ex) {
                        log.warn("Unexpected error importing line {}: {}", line, ex.getMessage());
                        result.getErrors().add(new BulkImportError(line, null, "error_row_failed", ex.getMessage()));
                        result.setFailureCount(result.getFailureCount() + 1);
                    }
                }
            } catch (IOException ex) {
                throw new ShopException("error_invalid_csv", "exception_invalid_csv", ex.getMessage());
            }

            if (dryRun) {
                status.setRollbackOnly();
            }
            return result;
        });
    }

    private void processRecord(CSVRecord record, int line, Set<String> skusInBatch, BulkImportResult result) {
        String sku = required(record, "sku", line);
        boolean duplicateInBatch = !skusInBatch.add(sku);
        if (duplicateInBatch) {
            throw new RowImportException("sku", "error_duplicate_sku_in_batch", "SKU repeated in import: " + sku);
        }

        String name = required(record, "name", line);
        BigDecimal price = parsePositiveDecimal(record, "price", line, true);
        Integer stock = parseNonNegativeInt(record, "stock", line);
        BigDecimal originalPrice = parseOptionalDecimal(record, "originalPrice", line);
        BigDecimal weight = parseOptionalDecimal(record, "weight", line);
        String currency = optional(record, "currency");
        String shortDescription = optional(record, "shortDescription");
        String description = optional(record, "description");
        String categorySlug = optional(record, "categorySlug");

        ProductCategoryEntity category = null;
        boolean hasCategorySlug = StringUtils.hasText(categorySlug);
        if (hasCategorySlug) {
            category = categoryRepository.findBySlug(categorySlug).orElseThrow(() -> new RowImportException("categorySlug", "error_category_not_found", "Category slug not found: " + categorySlug));
        }

        Optional<ProductEntity> existing = productRepository.findFirstBySku(sku);
        boolean isUpdate = existing.isPresent();
        ProductEntity entity = existing.orElseGet(ProductEntity::new);

        entity.setSku(sku);
        entity.setName(name);
        entity.setShortDescription(shortDescription);
        entity.setDescription(description);
        entity.setPrice(price);
        entity.setOriginalPrice(originalPrice);
        if (StringUtils.hasText(currency)) {
            entity.setCurrency(currency);
        }
        entity.setStock(stock);
        entity.setWeight(weight);
        entity.setCategory(category);
        entity.setIsActive(parseBoolean(record, "isActive", entity.getIsActive()));
        entity.setIsFeatured(parseBoolean(record, "isFeatured", entity.getIsFeatured()));
        entity.setIsNew(parseBoolean(record, "isNew", entity.getIsNew()));
        entity.setIsBestSeller(parseBoolean(record, "isBestSeller", entity.getIsBestSeller()));

        boolean hasSlug = StringUtils.hasText(entity.getSlug());
        if (!hasSlug) {
            entity.setSlug(generateUniqueSlug(name, sku));
        }

        ProductEntity saved = productRepository.save(entity);
        syncInventory(saved);

        result.setSuccessCount(result.getSuccessCount() + 1);
        if (isUpdate) {
            result.getUpdatedSkus().add(sku);
        } else {
            result.getCreatedSkus().add(sku);
        }
    }

    private void syncInventory(ProductEntity product) {
        InventoryEntity inv = inventoryRepository.findFirstByProductIdAndVariantIsNull(product.getId()).orElseGet(() -> {
            InventoryEntity created = new InventoryEntity();
            created.setProduct(product);
            created.setVariant(null);
            created.setReserved(0);
            return created;
        });
        inv.setQuantity(product.getStock() != null ? product.getStock() : 0);
        inventoryRepository.save(inv);
    }

    private String generateUniqueSlug(String name, String sku) {
        String base = slugify(name);
        boolean emptyBase = base.isBlank();
        if (emptyBase) {
            base = slugify(sku);
        }
        String candidate = base;
        int attempt = 1;
        while (productRepository.existsBySlug(candidate)) {
            candidate = base + "-" + attempt;
            attempt++;
            if (attempt > 500) {
                candidate = base + "-" + sku.toLowerCase(Locale.ROOT);
                break;
            }
        }
        return candidate;
    }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String noAccent = normalized.replaceAll("\\p{M}", "");
        String lower = noAccent.toLowerCase(Locale.ROOT);
        String slug = lower.replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
        return slug.length() > 200 ? slug.substring(0, 200) : slug;
    }

    private TransactionTemplate buildTemplate() {
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionTemplate template = new TransactionTemplate(transactionManager, def);
        return template;
    }

    // --- CSV value helpers -----------------------------------------------------

    private String optional(CSVRecord record, String name) {
        boolean hasColumn = record.isMapped(name);
        if (!hasColumn) {
            return null;
        }
        String raw = record.get(name);
        if (StringUtils.hasText(raw)) {
            return raw.trim();
        }
        return null;
    }

    private String required(CSVRecord record, String name, int line) {
        String value = optional(record, name);
        if (value == null) {
            throw new RowImportException(name, "error_required_field", "Missing required field: " + name);
        }
        return value;
    }

    private BigDecimal parsePositiveDecimal(CSVRecord record, String name, int line, boolean required) {
        String raw = optional(record, name);
        if (raw == null) {
            if (required) {
                throw new RowImportException(name, "error_required_field", "Missing required field: " + name);
            }
            return null;
        }
        try {
            BigDecimal value = new BigDecimal(raw);
            if (value.signum() < 0) {
                throw new RowImportException(name, "error_invalid_value", name + " must be >= 0");
            }
            return value;
        } catch (NumberFormatException ex) {
            throw new RowImportException(name, "error_invalid_number", name + " is not a valid number: " + raw);
        }
    }

    private BigDecimal parseOptionalDecimal(CSVRecord record, String name, int line) {
        return parsePositiveDecimal(record, name, line, false);
    }

    private Integer parseNonNegativeInt(CSVRecord record, String name, int line) {
        String raw = optional(record, name);
        if (raw == null) {
            return 0;
        }
        try {
            int value = Integer.parseInt(raw);
            if (value < 0) {
                throw new RowImportException(name, "error_invalid_value", name + " must be >= 0");
            }
            return value;
        } catch (NumberFormatException ex) {
            throw new RowImportException(name, "error_invalid_number", name + " is not a valid integer: " + raw);
        }
    }

    private Boolean parseBoolean(CSVRecord record, String name, Boolean current) {
        String raw = optional(record, name);
        if (raw == null) {
            return current;
        }
        String lower = raw.toLowerCase(Locale.ROOT);
        boolean truthy = lower.equals("true") || lower.equals("1") || lower.equals("yes") || lower.equals("y");
        boolean falsy = lower.equals("false") || lower.equals("0") || lower.equals("no") || lower.equals("n");
        if (truthy) {
            return Boolean.TRUE;
        }
        if (falsy) {
            return Boolean.FALSE;
        }
        return current;
    }

    private static final class RowImportException extends RuntimeException {

        private final String field;
        private final String code;

        RowImportException(String field, String code, String message) {
            super(message);
            this.field = field;
            this.code = code;
        }

        BulkImportError toError(int line) {
            return new BulkImportError(line, field, code, getMessage());
        }
    }
}
