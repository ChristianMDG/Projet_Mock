package mg.taxibrousse.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Structured error for a single row of a CSV product import.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkImportError {

    /** 1-based line number inside the uploaded CSV, including the header line. */
    private Integer line;
    /** Optional column name that caused the failure. */
    private String field;
    /** Stable error code (e.g. {@code error_category_not_found}). */
    private String code;
    /** Human-readable message. */
    private String message;
}
