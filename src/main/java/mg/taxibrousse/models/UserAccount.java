package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.UserAccountEntity;

import java.util.List;
import java.util.Objects;
import org.springframework.util.StringUtils;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class UserAccount extends BaseDto<UserAccountEntity> {

    protected String username;
    protected String password;
    protected boolean isAdmin;
    protected List<Authority> authorities;

    public static UserAccount fromEntity(UserAccountEntity entity) {
        var model = new UserAccount();
        model.setBaseUserAccountFields(entity, model);
        if (entity.getAuthorities() == null) {
            return model;
        }

        model.setAuthorities(entity.getAuthorities().stream().map(Authority::fromEntity).toList());
        return model;
    }

    public static UserAccountBuilder<?, ?> toBuilder(UserAccountEntity entity) {
        if (entity == null) {
            return UserAccount.builder();
        }
        UserAccountBuilder<?, ?> builder = UserAccount.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .username(entity.getUsername())
                .isAdmin(entity.isAdmin());

        if (entity.getAuthorities() != null) {
            builder.authorities(entity.getAuthorities().stream().map(Authority::fromEntity).toList());
        }

        return builder;
    }

    public static UserAccount fromEntityLight(UserAccountEntity entity) {
        return toBuilder(entity).build();
    }

    protected void setBaseUserAccountFields(UserAccountEntity entity) {
        setBaseEntity(entity);
        if (StringUtils.hasText(username)) {
            entity.setUsername(username);
        }
        entity.setAdmin(isAdmin);
    }

    protected void setBaseUserAccountFields(UserAccountEntity entity, UserAccount model) {
        model.setBaseDto(entity);
        model.username = entity.getUsername();
        model.isAdmin = entity.isAdmin();
        if (entity.getAuthorities() == null) {
            return;
        }

        model.setAuthorities(entity.getAuthorities().stream().map(Authority::fromEntity).toList());
    }

    @Override
    public UserAccountEntity toEntity(UserAccountEntity entity) {
        entity = Objects.requireNonNullElseGet(entity, UserAccountEntity::new);
        setBaseUserAccountFields(entity);
        return entity;
    }
}
