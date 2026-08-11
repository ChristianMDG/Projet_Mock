package mg.taxibrousse.batch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "BATCH_JOB_EXECUTION")
@Getter
@Setter
@NoArgsConstructor
public class BatchJobExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "batch_job_execution_seq_gen")
    @SequenceGenerator(name = "batch_job_execution_seq_gen", sequenceName = "BATCH_JOB_EXECUTION_SEQ", allocationSize = 1)
    @Column(name = "JOB_EXECUTION_ID")
    private Long jobExecutionId;

    @Column(name = "VERSION")
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOB_INSTANCE_ID")
    private BatchJobInstance jobInstance;

    @Column(name = "CREATE_TIME", nullable = false)
    private LocalDateTime createTime;

    @Column(name = "START_TIME")
    private LocalDateTime startTime;

    @Column(name = "END_TIME")
    private LocalDateTime endTime;

    @Column(name = "STATUS", length = 10)
    private String status;

    @Column(name = "EXIT_CODE", length = 2500)
    private String exitCode;

    @Column(name = "EXIT_MESSAGE", length = 2500)
    private String exitMessage;

    @Column(name = "LAST_UPDATED")
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "jobExecution", cascade = CascadeType.ALL)
    private List<BatchStepExecution> stepExecutions;

    @OneToMany(mappedBy = "jobExecution", cascade = CascadeType.ALL)
    private List<BatchJobExecutionParams> params;
}
