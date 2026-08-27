package mg.taxibrousse.dto.mvola;

/**
 * Represents a party (debit or credit) in MVola transaction.
 * Simple record to replace JSONArray with key-value pairs.
 */
public record Party(String key, String value) {

    public static Party msisdn(String phoneNumber) {
        return new Party("msisdn", phoneNumber);
    }
}
