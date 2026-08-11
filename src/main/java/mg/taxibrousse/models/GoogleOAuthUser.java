package mg.taxibrousse.models;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleOAuthUser {

    private String sub;
    private String email;
    private boolean emailVerified;
    private String name;
    private String givenName;
    private String familyName;
    private String picture;
    private String locale;
}
