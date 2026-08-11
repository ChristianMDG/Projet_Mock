package mg.taxibrousse.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationWithoutVoyageurRequest {

    private Long voyageId;
    private Long classeId;
    private Long crafterId;
    private List<String> seatNumbers;
    private String notes;
}
