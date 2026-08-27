package mg.taxibrousse.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OperateurSearchRequest {

    private String search;
    private Long koperativeId;
    private Boolean isActive;
    private Long gareId;
    private int page = 0;
    private int size = 15;
}
