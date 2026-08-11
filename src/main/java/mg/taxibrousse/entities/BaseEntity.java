package mg.taxibrousse.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @Column(insertable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // Strapi CMS fields
    @Column(length = 25)
    private String documentId;

    @Column
    private LocalDateTime publishedAt;

    @Column(length = 255)
    private String locale;

    @Column(name = "created_by_id")
    private Integer createdById;

    @Column(name = "updated_by_id")
    private Integer updatedById;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.publishedAt = LocalDateTime.now();
        if (this.documentId == null) {
            this.documentId = generateStrapiDocumentId();
        }
    }

    public String generateStrapiDocumentId() {
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(24);
        for (int i = 0; i < 24; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.locale = "mg";

        if (this.documentId == null) {
            this.documentId = generateStrapiDocumentId();
        }
    }
}
