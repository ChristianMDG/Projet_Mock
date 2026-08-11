package mg.taxibrousse.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PaymentRequest {
    private Long reservationId;
    private BigDecimal amount;
    private String paymentMethod;
    private String phoneNumber;
    private String operatorName;
    private String returnUrl;

    public static boolean isValidAmount(PaymentRequest request) {
        return request != null
                && request.amount != null
                && request.amount.compareTo(BigDecimal.ZERO) > 0
                && request.reservationId != null;
    }

    public static boolean isValidReservationId(PaymentRequest paymentRequest, Long id) {
        return paymentRequest != null
                && paymentRequest.getReservationId() != null
                && paymentRequest.getReservationId().equals(id);
    }

    public static boolean hasValidPhoneNumber(PaymentRequest request) {
        return request != null 
                && request.phoneNumber != null 
                && request.phoneNumber.replaceAll("[\\s\\-]", "").length() >= 9;
    }
}
