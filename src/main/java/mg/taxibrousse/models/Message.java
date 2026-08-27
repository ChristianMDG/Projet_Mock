package mg.taxibrousse.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.MessageEntity;
import mg.taxibrousse.entities.enums.MessageType;

import java.time.LocalDateTime;
import java.util.Objects;

import static java.util.Optional.ofNullable;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Message extends BaseDto<MessageEntity> {

    @Override
    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getCreatedAt() {
        return super.getCreatedAt();
    }

    @Override
    @JsonProperty("updatedAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getUpdatedAt() {
        return super.getUpdatedAt();
    }

    private String messageId;
    private String roomId;
    private String senderId;
    private String senderName;
    private String senderAvatar;
    private MessageType type;
    private String content;
    private String metadata;
    private Boolean isRead;
    private LocalDateTime deliveredAt;
    private LocalDateTime readAt;
    private String replyToMessageId;

    public static Message fromEntity(MessageEntity entity) {
        if (entity == null) {
            return null;
        }

        var model = new Message();
        model.setBaseDto(entity);
        model.messageId = entity.getMessageId();
        model.roomId = entity.getRoomId();
        model.senderId = entity.getSenderId();
        model.senderName = entity.getSenderName();
        model.senderAvatar = entity.getSenderAvatar();
        model.type = entity.getType();
        model.content = entity.getContent();
        model.metadata = entity.getMetadata();
        model.isRead = entity.getIsRead();
        model.deliveredAt = entity.getDeliveredAt();
        model.readAt = entity.getReadAt();
        model.replyToMessageId = entity.getReplyToMessageId();

        return model;
    }

    public static MessageBuilder<?, ?> toBuilder(MessageEntity entity) {
        if (entity == null) {
            return Message.builder();
        }
        return Message.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .messageId(entity.getMessageId())
                .roomId(entity.getRoomId())
                .senderId(entity.getSenderId())
                .senderName(entity.getSenderName())
                .senderAvatar(entity.getSenderAvatar())
                .type(entity.getType())
                .content(entity.getContent())
                .metadata(entity.getMetadata())
                .isRead(entity.getIsRead())
                .deliveredAt(entity.getDeliveredAt())
                .readAt(entity.getReadAt())
                .replyToMessageId(entity.getReplyToMessageId());
    }

    public static Message fromEntityLight(MessageEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public MessageEntity toEntity(MessageEntity entity) {
        entity = Objects.requireNonNullElse(entity, new MessageEntity());
        setBaseEntity(entity);
        entity.setMessageId(messageId);
        entity.setRoomId(roomId);
        entity.setSenderId(senderId);
        entity.setSenderName(senderName);
        entity.setSenderAvatar(senderAvatar);
        entity.setType(ofNullable(type).orElse(MessageType.TEXT));
        entity.setContent(content);
        entity.setMetadata(metadata);
        entity.setIsRead(ofNullable(isRead).orElse(false));
        entity.setDeliveredAt(deliveredAt);
        entity.setReadAt(readAt);
        entity.setReplyToMessageId(replyToMessageId);

        return entity;
    }
}
