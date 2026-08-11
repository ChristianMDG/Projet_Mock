package mg.taxibrousse.models;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserToken {

    private String token;
    private UserInfo user;
}
