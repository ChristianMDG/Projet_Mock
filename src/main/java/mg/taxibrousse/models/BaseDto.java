package mg.taxibrousse.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.BaseEntity;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public abstract class BaseDto<E extends BaseEntity> implements Serializable {

    private static final long serialVersionUID = 1L;

    protected Long id;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    protected LocalDateTime createdAt;

    @JsonIgnore
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    protected LocalDateTime updatedAt;

    public static <E, D> List<D> mapEntities(Iterable<E> entities, Function<E, D> mapper) {
        if (entities == null) {
            return List.of();
        }

        List<D> result = new ArrayList<>();
        for (E e : entities) {
            D dto = mapper.apply(e);
            if (dto == null) {
                continue;
            }
            result.add(dto);
        }
        return result;
    }

    public static <M, E> List<E> mapModels(Iterable<M> models, Function<M, E> mapper) {
        if (models == null) {
            return List.of();
        }

        List<E> result = new ArrayList<>();
        for (M m : models) {
            E entity = mapper.apply(m);
            if (entity != null) {
                result.add(entity);
            }
        }
        return result;
    }

    /**
     * Converts a {@link BaseDto} instance to an entity instance of the
     * specified class, setting only the identity (ID) field. If the provided
     * DTO is {@code null}, a new entity instance is returned with no ID set.
     *
     * @param entityClass the class of the entity to instantiate
     * @param dto the DTO containing the ID to set on the entity
     * @param <E> the type of the entity, extending {@link BaseEntity}
     * @return a new entity instance with the ID set from the DTO, or
     * {@code null} if instantiation fails
     */
    public static <E extends BaseEntity> E toIdentity(Class<E> entityClass, BaseDto<E> dto) {
        if (Optional.ofNullable(dto).map(BaseDto::getId).orElse(0L) <= 0) {
            return null;
        }
        try {
            E e = entityClass.getConstructor().newInstance();
            e.setId(dto.getId());
            return e;
        } catch (IllegalAccessException | IllegalArgumentException | InstantiationException | NoSuchMethodException | SecurityException | InvocationTargetException ignored) {
            return null;
        }
    }

    /**
     * Creates a list of entity identities from a list of DTOs, setting only the
     * ID field.
     *
     * @param entityClass the class of the entity
     * @param dtos the list of DTOs
     * @return list of entities with only ID set
     */
    public static <E extends BaseEntity, D extends BaseDto<E>> Set<E> toIdentities(Class<E> entityClass, Iterable<D> dtos) {
        Set<E> entities = new HashSet<>();
        if (dtos == null) {
            return entities;
        }
        for (D dto : dtos) {
            E identity = toIdentity(entityClass, dto);
            if (identity == null) {
                continue;
            }
            entities.add(identity);
        }
        return entities;
    }

    public Long getId() {
        return this.id == null ? 0L : this.id;
    }

    protected void setBaseDto(E entity) {
        if (entity == null) {
            return;
        }
        id = entity.getId();
        createdAt = entity.getCreatedAt();
        updatedAt = entity.getUpdatedAt();
    }

    protected E setBaseEntity(E entity) {
        if (entity == null) {
            return null;
        }
        entity.setId(id);
        entity.setCreatedAt(createdAt);
        entity.setUpdatedAt(updatedAt);
        return entity;
    }

    public abstract E toEntity(E entity);

    public E toEntity() {
        return toEntity(null);
    }
}
