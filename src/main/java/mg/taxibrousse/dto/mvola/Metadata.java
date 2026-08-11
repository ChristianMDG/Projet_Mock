package mg.taxibrousse.dto.mvola;

/**
 * Represents metadata key-value pair in MVola transaction.
 * Simple record to replace JSONArray with key-value pairs.
 */
public record Metadata(String key, String value) {
    
    public static Metadata partnerName(String name) {
        return new Metadata("partnerName", name);
    }
    
    public static Metadata foreignCurrency(String currency) {
        return new Metadata("fc", currency);
    }
    
    public static Metadata amountForeignCurrency(String amount) {
        return new Metadata("amountFc", amount);
    }
}
