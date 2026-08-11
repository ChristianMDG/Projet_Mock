package mg.taxibrousse.dto.mvola;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.Builder.Default;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MVolaTokenResponse {
    
    @JsonProperty("access_token")
    private String accessToken;
    
    private String scope;
    
    @JsonProperty("token_type")
    private String tokenType;
    
    @JsonProperty("expires_in")
    private int expiresIn;
    
    @Default
    private Instant createdAt = Instant.now();

    public boolean isExpired() {
        return createdAt.plusSeconds(expiresIn).isBefore(Instant.now());
    }
}
