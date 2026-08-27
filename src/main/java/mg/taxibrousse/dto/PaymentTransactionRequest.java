package mg.taxibrousse.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransactionRequest {

    private Long facturationId;
    private Long orderId;
    private Long rentalReservationId;
    private String operatorName;
    private BigDecimal amount;
    private String phoneNumber;
}
