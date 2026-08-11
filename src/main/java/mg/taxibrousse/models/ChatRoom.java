package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.ChatRoomEntity;
import mg.taxibrousse.entities.enums.ChatRoomType;

import java.util.Objects;

import static java.util.Optional.ofNullable;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class ChatRoom extends BaseDto<ChatRoomEntity> {

    private String roomId;
    private String type;
    private String participants;
    private Boolean isActive;
    private String title;
    private String lastMessage;
    private String lastMessageSender;
    private String metadata;
    private Long unreadCount;

    public static ChatRoom fromEntity(ChatRoomEntity entity) {
        if (entity == null) {
            return null;
        }

        var model = new ChatRoom();
        model.setBaseDto(entity);
        model.roomId = entity.getRoomId();
        model.type = ofNullable(entity.getType()).map(Enum::name).orElse(null);
        model.participants = entity.getParticipants();
        model.isActive = entity.getIsActive();
        model.title = entity.getTitle();
        model.lastMessage = entity.getLastMessage();
        model.lastMessageSender = entity.getLastMessageSender();
        model.metadata = entity.getMetadata();

        return model;
    }

    public static ChatRoomBuilder<?, ?> toBuilder(ChatRoomEntity entity) {
        if (entity == null) {
            return ChatRoom.builder();
        }
        return ChatRoom.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .roomId(entity.getRoomId())
                .type(ofNullable(entity.getType()).map(Enum::name).orElse(null))
                .participants(entity.getParticipants())
                .isActive(entity.getIsActive())
                .title(entity.getTitle())
                .lastMessage(entity.getLastMessage())
                .lastMessageSender(entity.getLastMessageSender())
                .metadata(entity.getMetadata());
    }

    public static ChatRoom fromEntityLight(ChatRoomEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public ChatRoomEntity toEntity(ChatRoomEntity entity) {
        entity = Objects.requireNonNullElse(entity, new ChatRoomEntity());
        setBaseEntity(entity);
        entity.setRoomId(roomId);
        entity.setType(ofNullable(type).map(ChatRoomType::valueOf).orElse(null));
        entity.setParticipants(participants);
        entity.setIsActive(ofNullable(isActive).orElse(true));
        entity.setTitle(title);
        entity.setLastMessage(lastMessage);
        entity.setLastMessageSender(lastMessageSender);
        entity.setMetadata(metadata);

        return entity;
    }
}
