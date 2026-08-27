package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mg.taxibrousse.entities.enums.ChatRoomType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
public class ChatRoomEntity extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String roomId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatRoomType type;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String participants; // JSON array of user IDs/identifiers

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private String title; // Human-readable room title

    @Column
    private String lastMessage;

    @Column
    private String lastMessageSender;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String metadata; // Additional room metadata (voyage info, etc.)

    public ChatRoomEntity(String roomId, ChatRoomType type) {
        this.roomId = roomId;
        this.type = type;
    }
}
