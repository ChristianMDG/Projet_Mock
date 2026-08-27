package mg.taxibrousse.dto.shop;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Result of a bulk product import.
 *
 * <p>
 * CSV columns (in this exact order):
 *
 * <pre>
 * sku, name, shortDescription, description, price, originalPrice, currency,
 * stock, weight, categorySlug, isActive, isFeatured, isNew, isBestSeller, tags
 * </pre>
 *
 * <p>
 * Notes:
 * <ul>
 * <li>{@code sku} and {@code name} are mandatory. {@code price} must be ≥ 0. {@code stock} must be ≥ 0.</li>
 * <li>{@code tags} is a pipe-separated list (reserved for future use).</li>
 * <li>Rows referencing a missing {@code categorySlug} emit {@code error_category_not_found} and are skipped.</li>
 * <li>Upsert is keyed by {@code sku}. An existing product is updated; otherwise a new one is created.</li>
 * <li>A matching {@link mg.taxibrousse.entities.InventoryEntity} row (no variant) is created or synchronized.</li>
 * </ul>
 */
@Getter
@Setter
public class BulkImportResult {

    private int totalRows;
    private int successCount;
    private int failureCount;
    private List<BulkImportError> errors = new ArrayList<>();
    private List<String> createdSkus = new ArrayList<>();
    private List<String> updatedSkus = new ArrayList<>();
    private boolean dryRun;
}
