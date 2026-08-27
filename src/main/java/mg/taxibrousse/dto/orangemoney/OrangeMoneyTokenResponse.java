package mg.taxibrousse.dto.orangemoney;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Orange Money OAuth2 token response.
 * <p>
 * Contains access token for authenticating API requests.
 * Token expiration is calculated with a 30-second buffer for safety.
 * </p>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrangeMoneyTokenResponse {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("token_type")
    @Builder.Default
    private String tokenType = "Bearer";

    @JsonProperty("expires_in")
    @Builder.Default
    private int expiresIn = 3600;

    private long expiresAt;

    /**
     * Constructor for Jackson deserialization.
     * Automatically calculates expiration time with 30-second buffer.
     */
    @JsonCreator
    public OrangeMoneyTokenResponse(@JsonProperty("access_token") String accessToken, @JsonProperty("token_type") String tokenType, @JsonProperty("expires_in") int expiresIn) {
        this.accessToken = accessToken;
        this.tokenType = tokenType == null ? "Bearer" : tokenType;
        this.expiresIn = expiresIn <= 0 ? 3600 : expiresIn;
        this.expiresAt = System.currentTimeMillis() + (this.expiresIn * 1000L) - 30000;
    }

    /**
     * Check if token has expired.
     *
     * @return true if token is expired or about to expire
     */
    public boolean isExpired() {
        return expiresAt <= System.currentTimeMillis();
    }
}
