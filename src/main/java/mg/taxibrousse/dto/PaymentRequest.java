package mg.taxibrousse.dto;

import lombok.*;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PaymentRequest {

    private Long payableId;
    private PayableType payableType;
    private BigDecimal amount;
    private String paymentMethod;
    private String phoneNumber;
    private String operatorName;
    private String returnUrl;

    public static boolean isValidAmount(PaymentRequest request) {
        return request != null && request.payableId != null && request.payableType != null && request.amount != null && request.amount.signum() > 0;
    }

    public static boolean isValidReservationId(PaymentRequest paymentRequest, Long id) {
        return paymentRequest != null && paymentRequest.payableType == PayableType.RESERVATION && Objects.equals(paymentRequest.payableId, id);
    }

    public static boolean hasValidPhoneNumber(PaymentRequest request) {
        return request != null && request.phoneNumber != null && request.phoneNumber.replaceAll("[^0-9]", "").length() >= 9;
    }

    public String getDescription() {
        if (payableType == null) {
            return "Paiement";
        }
        return switch (payableType) {
            case ORDER -> MessageFormat.format("Paiement commande Boutique {0}", String.valueOf(payableId));
            case RENTAL_RESERVATION -> MessageFormat.format("Paiement location vehicule {0}", String.valueOf(payableId));
            default -> MessageFormat.format("Paiement reservation Taxibrousse {0}", String.valueOf(payableId));
        };
    }
}
