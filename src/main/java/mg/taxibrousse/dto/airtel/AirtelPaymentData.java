package mg.taxibrousse.dto.airtel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirtelPaymentData {
    @JsonProperty("transaction")
    private Transaction transaction;

    @Getter
    @Setter
    public static class Transaction {
        private String id;
        private String message;
        private String status;

        @JsonProperty("airtel_money_id")
        private String airtelMoneyId;
    }
}
