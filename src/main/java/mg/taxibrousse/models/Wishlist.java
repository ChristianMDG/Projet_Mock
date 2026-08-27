package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.UserAccountEntity;
import mg.taxibrousse.entities.WishlistEntity;

import java.util.List;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Wishlist extends BaseDto<WishlistEntity> {

    private Long userAccountId;
    private List<WishlistItem> items;

    public static Wishlist fromEntity(WishlistEntity entity) {
        if (entity == null) {
            return null;
        }
        var model = new Wishlist();
        model.setBaseDto(entity);
        if (entity.getUserAccount() != null) {
            model.setUserAccountId(entity.getUserAccount().getId());
        }
        model.setItems(mapEntities(entity.getItems(), WishlistItem::fromEntity));
        return model;
    }

    public static WishlistBuilder<?, ?> toBuilder(WishlistEntity entity) {
        if (entity == null) {
            return Wishlist.builder();
        }
        return Wishlist.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .userAccountId(entity.getUserAccount() != null ? entity.getUserAccount().getId() : null);
    }

    public static Wishlist fromEntityLight(WishlistEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public WishlistEntity toEntity(WishlistEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, WishlistEntity::new);
        setBaseEntity(entity);
        if (userAccountId != null) {
            UserAccountEntity user = new UserAccountEntity();
            user.setId(userAccountId);
            entity.setUserAccount(user);
        }
        return entity;
    }
}
