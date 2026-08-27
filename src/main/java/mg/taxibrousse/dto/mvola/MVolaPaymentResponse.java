package mg.taxibrousse.dto.mvola;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MVolaPaymentResponse {

    private String status;

    @JsonProperty("serverCorrelationId")
    private String serverCorrelationId;

    @JsonProperty("notificationMethod")
    private String notificationMethod;
}
