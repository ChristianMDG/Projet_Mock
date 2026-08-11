package mg.taxibrousse.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class SpringSession {

    @Id
    private String primaryId;

    private String sessionId;
    private Long creationTime;
    private Long lastAccessTime;
    private Integer maxInactiveInterval;
    private Long expiryTime;
    private String principalName;
}
