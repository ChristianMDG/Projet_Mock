package mg.taxibrousse.batch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BATCH_JOB_EXECUTION_PARAMS")
@Getter
@Setter
@NoArgsConstructor
public class BatchJobExecutionParams {

    @EmbeddedId
    private BatchJobExecutionParamId id;

    @Column(name = "PARAMETER_TYPE", length = 100, nullable = false)
    private String parameterType;

    @Column(name = "PARAMETER_VALUE", length = 2500)
    private String parameterValue;

    @Column(name = "IDENTIFYING", length = 1, nullable = false)
    private String identifying;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("jobExecutionId")
    @JoinColumn(name = "JOB_EXECUTION_ID")
    private BatchJobExecution jobExecution;
}
