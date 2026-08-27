package mg.taxibrousse.dto.airtel;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AirtelTransactionRequest {

    private BigDecimal amount;
    private String country;
    private String currency;
    private String id;
}
