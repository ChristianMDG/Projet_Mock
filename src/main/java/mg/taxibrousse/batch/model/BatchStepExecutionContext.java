package mg.taxibrousse.batch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BATCH_STEP_EXECUTION_CONTEXT")
@Getter
@Setter
@NoArgsConstructor
public class BatchStepExecutionContext {

    @Id
    @Column(name = "STEP_EXECUTION_ID")
    private Long stepExecutionId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "STEP_EXECUTION_ID")
    private BatchStepExecution stepExecution;

    @Column(name = "SHORT_CONTEXT", length = 2500, nullable = false)
    private String shortContext;

    @Column(name = "SERIALIZED_CONTEXT", columnDefinition = "TEXT")
    private String serializedContext;
}
