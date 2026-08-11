package mg.taxibrousse.params;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class GareFilter {

    private String name;
    private List<Long> villeIds;
    private Boolean isClosed;
    private String koperativeName;
}
