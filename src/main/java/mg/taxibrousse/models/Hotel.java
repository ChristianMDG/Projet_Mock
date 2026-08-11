package mg.taxibrousse.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.HotelEntity;

import java.math.BigDecimal;
import java.util.Objects;

@Setter
@Getter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
public class Hotel extends BaseDto<HotelEntity> {

    private String name;
    private String address;
    private String phone;
    private String email;
    private BigDecimal rating;
    private String amenities;

    public static Hotel fromEntity(HotelEntity entity) {
        if (entity == null) {
            return null;
        }
        var dto = new Hotel();
        dto.setBaseDto(entity);
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setRating(entity.getRating());
        dto.setAmenities(entity.getAmenities());
        return dto;
    }

    public static HotelBuilder<?, ?> toBuilder(HotelEntity entity) {
        return Hotel.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .name(entity.getName())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .rating(entity.getRating())
                .amenities(entity.getAmenities());
    }

    public static Hotel fromEntityLight(HotelEntity entity) {
        return toBuilder(entity).build();
    }

    @Override
    public HotelEntity toEntity(HotelEntity entity) {
        entity = Objects.requireNonNullElse(entity, new HotelEntity());
        setBaseEntity(entity);
        entity.setName(name);
        entity.setAddress(address);
        entity.setPhone(phone);
        entity.setEmail(email);
        entity.setRating(rating);
        entity.setAmenities(amenities);
        return entity;
    }
}
