package mg.taxibrousse.dto.airtel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirtelStatus {
    private String code;
    private String message;

    @JsonProperty("result_code")
    private String resultCode;

    @JsonProperty("response_code")
    private String responseCode;

    private Boolean success;
}
