package mg.taxibrousse.dto.airtel;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirtelTokenResponse {
    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("expires_in")
    private int expiresIn = 180;

    @JsonProperty("token_type")
    private String tokenType;

    // computed expiry timestamp (ms)
    private long expiresAt;

    /**
     * Constructor for Jackson deserialization.
     * Automatically calculates expiration time with 30-second buffer.
     */
    @JsonCreator
    public AirtelTokenResponse(
            @JsonProperty("access_token") String accessToken,
            @JsonProperty("token_type") String tokenType,
            @JsonProperty("expires_in") int expiresIn
    ) {
        this.accessToken = accessToken;
        this.tokenType = tokenType == null ? "Bearer " : tokenType;
        this.expiresIn = expiresIn <= 0 ? 180 : expiresIn;
        this.expiresAt = System.currentTimeMillis() + (this.expiresIn * 1000L) - 30000L;
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
