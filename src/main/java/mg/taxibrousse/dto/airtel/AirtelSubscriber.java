package mg.taxibrousse.dto.airtel;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AirtelSubscriber {
    private String country;
    private String currency;
    private String msisdn;
}
