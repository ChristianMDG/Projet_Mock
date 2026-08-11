package mg.taxibrousse.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.taxibrousse.entities.UserInfoEntity;
import mg.taxibrousse.entities.enums.CinTypeEnum;
import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;

import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
public class UserInfo extends UserAccount {

    protected String firstName;
    protected String lastName;
    protected String email;
    protected String phone;
    protected String address;

    protected String idNumber;

    protected CinTypeEnum idType;
    protected Boolean isActive;
    protected LanguagePreferenceEnum languagePreference;
    protected Cloudinary photo;

    public static UserInfo fromEntity(UserInfoEntity entity) {
        if (entity == null) {
            return null;
        }

        UserInfo model = new UserInfo();
        model.setBaseUserInfoFields(entity, model);
        return model;
    }

    public static UserInfoBuilder<?, ?> toBuilder(UserInfoEntity entity) {
        if (entity == null) {
            return UserInfo.builder();
        }
        return UserInfo.builder()
                .id(entity.getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .username(entity.getUsername())
                .isAdmin(entity.isAdmin())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .idNumber(entity.getIdNumber())
                .idType(entity.getIdType())
                .isActive(entity.getIsActive())
                .languagePreference(entity.getLanguagePreference());
    }

    public static UserInfo fromEntityLight(UserInfoEntity entity) {
        return toBuilder(entity).build();
    }

    protected void setBaseUserInfoFields(UserInfoEntity entity) {
        setBaseUserAccountFields(entity);
        entity.setFirstName(firstName);
        entity.setLastName(lastName);
        entity.setEmail(email);
        entity.setPhone(phone);
        entity.setAddress(address);
        entity.setIdNumber(idNumber);
        entity.setIdType(idType);
        entity.setIsActive(isActive);
        entity.setLanguagePreference(languagePreference);
        entity.setPhoto(photo != null ? photo.toEntity() : null);
    }

    protected void setBaseUserInfoFields(UserInfoEntity entity, UserInfo model) {
        setBaseUserAccountFields(entity, model);
        model.firstName = entity.getFirstName();
        model.lastName = entity.getLastName();
        model.email = entity.getEmail();
        model.phone = entity.getPhone();
        model.address = entity.getAddress();
        model.idNumber = entity.getIdNumber();
        model.idType = entity.getIdType();
        model.isActive = entity.getIsActive();
        model.languagePreference = entity.getLanguagePreference();
        
        try {
            model.photo = Cloudinary.fromEntity(entity.getPhoto());
        } catch (Exception e) {
            model.photo = null;
        }
    }

    public UserInfoEntity toEntity(UserInfoEntity entity) {
        entity = Objects.requireNonNullElse(entity, new UserInfoEntity());
        setBaseUserInfoFields(entity);
        return entity;
    }

    @Override
    public UserInfoEntity toEntity() {
        return toEntity(new UserInfoEntity());
    }

    public boolean hasPassword() {
        return password != null && !password.isEmpty();
    }
}
