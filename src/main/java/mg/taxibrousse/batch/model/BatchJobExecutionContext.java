package mg.taxibrousse.batch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BATCH_JOB_EXECUTION_CONTEXT")
@Getter
@Setter
@NoArgsConstructor
public class BatchJobExecutionContext {

    @Id
    @Column(name = "JOB_EXECUTION_ID")
    private Long jobExecutionId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "JOB_EXECUTION_ID")
    private BatchJobExecution jobExecution;

    @Column(name = "SHORT_CONTEXT", length = 2500, nullable = false)
    private String shortContext;

    @Column(name = "SERIALIZED_CONTEXT", columnDefinition = "TEXT")
    private String serializedContext;
}
