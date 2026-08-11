package mg.taxibrousse.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mg.taxibrousse.entities.enums.CinTypeEnum;
import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;
import org.springframework.util.StringUtils;

import java.util.List;

import static jakarta.persistence.CascadeType.ALL;

@Getter
@Setter
@Entity(name = "UserInfo")
@DiscriminatorValue(value = "USER")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class UserInfoEntity extends UserAccountEntity {

    @Column(nullable = true, unique = true, length = 100)
    private String email;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(length = 100)
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER, cascade = ALL)
    private CloudinaryEntity photo;

    @Column(length = 500)
    private String address;

    @Column(nullable = true, length = 50)
    private String idNumber;

    @Column
    @Enumerated(EnumType.STRING)
    private CinTypeEnum idType;

    @Column
    private Boolean isActive = true;

    @Column(length = 10)
    @Enumerated(EnumType.STRING)
    private LanguagePreferenceEnum languagePreference;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userinfo")
    private List<CloudinaryEntity> uploads;

    public String getEmail() {
        return StringUtils.hasText(email) ? email : null;
    }

    public void setEmail(String email) {
        this.email = StringUtils.hasText(email) ? email : null;
    }
}
