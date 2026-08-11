package mg.taxibrousse.utils;

import java.util.regex.Pattern;

/**
 * Utility class for phone number operations in Madagascar
 */
public class PhoneUtils {

    // Pattern for normalized phone format (034000000)
    // Supports 032, 033, 034, 035, 038, 039
    private static final Pattern MADA_PHONE_PATTERN = Pattern.compile("^0(32|33|34|35|38|39)\\d{7}$");

    private PhoneUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Normalize phone number to local storage format (e.g., 0340000000)
     * Handles inputs like "+261 34...", "261 34...", "34..."
     *
     * @param phone Input phone number
     * @return Normalized 10-digit phone number starting with 0, or empty string if input is null/empty
     */
    public static String normalizePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return "";
        }

        // Remove all non-digits
        String cleaned = phone.replaceAll("\\D", "");

        // Handle international format (26134... -> 34...)
        if (cleaned.startsWith("261")) {
            cleaned = cleaned.substring(3);
        }

        // Add leading 0 if missing (34... -> 034...)
        if (cleaned.length() == 9) {
            cleaned = "0" + cleaned;
        }

        return cleaned;
    }

    /**
     * Validate Madagascar phone number
     *
     * @param phone Phone number to validate
     * @return true if valid Madagascar mobile number
     */
    public static boolean isValidMadagascarPhone(String phone) {
        String normalized = normalizePhone(phone);
        return !normalized.isEmpty() && MADA_PHONE_PATTERN.matcher(normalized).matches();
    }

    /**
     * Convert phone number to international format (+261...)
     *
     * @param phone Phone number
     * @return Phone number in international format, or original if invalid
     */
    public static String toInternationalFormat(String phone) {
        String normalized = normalizePhone(phone);
        if (isValidMadagascarPhone(normalized)) {
            // 0340000000 -> +261340000000
            return "+261" + normalized.substring(1);
        }
        return phone;
    }

    /**
     * Format phone number for display (+261 34 000 000)
     *
     * @param phone Phone number
     * @return Formatted phone number
     */
    public static String formatForDisplay(String phone) {
        String normalized = normalizePhone(phone);
        if (isValidMadagascarPhone(normalized)) {
            // 0340000000 -> +261 34 000 000
            // substring(1) gives 340000000
            String withoutLeadingZero = normalized.substring(1);
            String operator = withoutLeadingZero.substring(0, 2); // 34
            String part1 = withoutLeadingZero.substring(2, 5);    // 000
            String part2 = withoutLeadingZero.substring(5);       // 0000
    
            return String.format("+261 %s %s %s", operator, part1, part2);
        }

        return phone;
    }

    /**
     * Get operator name from phone number
     *
     * @param phone Phone number
     * @return Operator name or "Unknown"
     */
    public static String getOperatorName(String phone) {
        if (!isValidMadagascarPhone(phone)) {
            return "Unknown";
        }

        String normalized = normalizePhone(phone);
        String prefix = normalized.substring(0, 3);

        switch (prefix) {
            case "034", "035":
                return "TELMA";
            case "032", "033":
                return "AIRTEL";
            case "038", "039":
                return "ORANGE";
            default:
                return "Unknown";
        }
    }
}
