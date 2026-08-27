package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.MessageType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "messages", indexes = {@Index(name = "idx_room_id_created_at", columnList = "roomId, createdAt"), @Index(name = "idx_sender_id_created_at", columnList = "senderId, createdAt"),
        @Index(name = "idx_unread_messages", columnList = "isRead, roomId")})
@Entity(name = "Message")
@NoArgsConstructor
public class MessageEntity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String messageId;

    @Column(nullable = false)
    private String roomId;

    @Column(nullable = false)
    private String senderId;

    @Column(nullable = false)
    private String senderName;

    @Column
    private String senderAvatar;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.TEXT;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String metadata;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column
    private LocalDateTime deliveredAt;

    @Column
    private LocalDateTime readAt;

    @Column
    private String replyToMessageId;

    @Override
    protected void onCreate() {
        super.onCreate();
        if (type == null) {
            type = MessageType.TEXT;
        }
        if (isRead == null) {
            isRead = false;
        }
    }
}
