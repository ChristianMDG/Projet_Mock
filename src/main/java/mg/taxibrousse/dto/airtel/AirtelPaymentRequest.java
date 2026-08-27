package mg.taxibrousse.dto.airtel;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AirtelPaymentRequest {

    private String reference;
    private AirtelSubscriber subscriber;
    private AirtelTransactionRequest transaction;
}
