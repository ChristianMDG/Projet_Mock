package mg.taxibrousse.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacebookOAuthUser {

    private String id;
    private String email;
    private String name;
    private String firstName;
    private String lastName;
    private String picture;
    private String phone;
}
