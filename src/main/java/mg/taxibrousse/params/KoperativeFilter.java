package mg.taxibrousse.params;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class KoperativeFilter {

    private String name;
    private List<Long> villeIds;
    private Integer top;
}
