package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.AuthorityEntity;
import org.springframework.security.core.GrantedAuthority;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class Authority extends BaseDto<AuthorityEntity> implements GrantedAuthority {

    private String name;

    /**
     * Creates an Authority model from an AuthorityEntity.
     *
     * @param entity The entity to convert from
     * @return A new Authority model or null if the entity is null
     */
    public static Authority fromEntity(AuthorityEntity entity) {
        if (entity == null) {
            return null;
        }

        var model = new Authority();
        model.setBaseDto(entity);
        model.setName(entity.getName());
        return model;
    }

    /**
     * Creates a builder from an AuthorityEntity with primitive fields
     * populated.
     *
     * @param entity The entity to build from
     * @return A new AuthorityBuilder with primitive fields set
     */
    public static AuthorityBuilder<?, ?> toBuilder(AuthorityEntity entity) {
        return Authority.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName());
    }

    public static Authority fromEntityLight(AuthorityEntity entity) {
        return toBuilder(entity).build();
    }

    /**
     * Creates a new Authority with the given name.
     *
     * @param name The authority name
     * @return A new Authority instance
     */
    public static Authority of(String name) {
        var authority = new Authority();
        authority.setName(name);
        return authority;
    }

    /**
     * Converts this model to an entity, using the provided entity instance or
     * creating a new one if null.
     *
     * @param entity The entity to update, or null to create a new one
     * @return The updated or new entity
     */
    @Override
    public AuthorityEntity toEntity(AuthorityEntity entity) {
        entity = Objects.requireNonNullElse(entity, new AuthorityEntity());
        setBaseEntity(entity);
        entity.setName(this.name);
        return entity;
    }

    /**
     * Converts this model to a new entity instance.
     *
     * @return A new entity with values from this model
     */
    @Override
    public AuthorityEntity toEntity() {
        return toEntity(new AuthorityEntity());
    }

    /**
     * Returns the authority name.
     *
     * @return The authority name
     */
    @Override
    public String getAuthority() {
        return name;
    }

    /**
     * Returns a string representation of this authority.
     *
     * @return The authority name
     */
    @Override
    public String toString() {
        return getAuthority();
    }

    /**
     * Compares this authority with another object for equality. Two authorities
     * are equal if they have the same name (case-sensitive).
     *
     * @param obj The object to compare with
     * @return true if equal, false otherwise
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Authority other = (Authority) obj;
        return Objects.equals(name, other.name);
    }

    /**
     * Returns a hash code for this authority.
     *
     * @return A hash code based on the authority name
     */
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
