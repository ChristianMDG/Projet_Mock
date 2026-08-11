package mg.taxibrousse.batch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BATCH_JOB_INSTANCE")
@Getter
@Setter
@NoArgsConstructor
public class BatchJobInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "batch_job_seq_gen")
    @SequenceGenerator(name = "batch_job_seq_gen", sequenceName = "BATCH_JOB_SEQ", allocationSize = 1)
    @Column(name = "JOB_INSTANCE_ID")
    private Long jobInstanceId;

    @Column(name = "VERSION")
    private Long version;

    @Column(name = "JOB_NAME", length = 100, nullable = false)
    private String jobName;

    @Column(name = "JOB_KEY", length = 32, nullable = false)
    private String jobKey;
}
