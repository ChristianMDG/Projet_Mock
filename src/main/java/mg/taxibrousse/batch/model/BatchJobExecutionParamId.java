package mg.taxibrousse.batch.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class BatchJobExecutionParamId implements Serializable {

    @Column(name = "JOB_EXECUTION_ID")
    private Long jobExecutionId;

    @Column(name = "PARAMETER_NAME", length = 100)
    private String parameterName;
}
