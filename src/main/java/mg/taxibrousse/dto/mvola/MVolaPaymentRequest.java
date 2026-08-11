package mg.taxibrousse.dto.mvola;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MVolaPaymentRequest {

    private String amount;

    @Builder.Default
    private String currency = "Ar";

    @Builder.Default
    private String descriptionText = "Paiement reservation Taxibrousse";

    private String requestingOrganisationTransactionReference;

    @Builder.Default
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private OffsetDateTime requestDate = OffsetDateTime.now(ZoneOffset.UTC);

    private String originalTransactionReference;

    @JsonSerialize(using = MVolaApiSerializer.PartyListSerializer.class)
    private List<Party> debitParty;

    @JsonSerialize(using = MVolaApiSerializer.PartyListSerializer.class)
    private List<Party> creditParty;

    @JsonSerialize(using = MVolaApiSerializer.MetadataListSerializer.class)
    private List<Metadata> metadata;
}
