package mg.taxibrousse.dto.airtel;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class AirtelCallbackRequest {

    private String hash;
    private Transaction transaction;

    @Getter
    @Setter
    public static class Transaction {

        private String id;
        private String message;

        @JsonProperty("status_code")
        private String statusCode;

        @JsonProperty("airtel_money_id")
        private String airtelMoneyId;
    }
}
