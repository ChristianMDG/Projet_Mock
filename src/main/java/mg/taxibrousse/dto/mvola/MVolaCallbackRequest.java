package mg.taxibrousse.dto.mvola;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MVolaCallbackRequest {
    private String transactionStatus;
    private String serverCorrelationId;
    private String transactionReference;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime requestDate;

    private List<Fee> fees;
    private List<Party> debitParty;
    private List<Party> creditParty;
    private List<Metadata> metadata;
}
