package mg.taxibrousse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationSearchRequest {

    private String status;
    private String phoneNumber;
    private String bookingReference;
    private String paymentStatus;
    private int page = 0;
    private int size = 15;
}
