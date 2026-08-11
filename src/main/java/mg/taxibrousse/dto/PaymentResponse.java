package mg.taxibrousse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.models.Reservation;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private boolean success;
    private Reservation reservation;
    private BigDecimal remainingAmount;
    private String message;
}
