package mg.taxibrousse.dto.airtel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirtelPaymentResponse {

    @JsonProperty("data")
    private AirtelPaymentData data;

    @JsonProperty("status")
    private AirtelStatus status;
}
