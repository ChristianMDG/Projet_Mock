package mg.taxibrousse.batch.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "BATCH_STEP_EXECUTION")
@Getter
@Setter
@NoArgsConstructor
public class BatchStepExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "batch_step_exec_seq_gen")
    @SequenceGenerator(name = "batch_step_exec_seq_gen", sequenceName = "BATCH_STEP_EXECUTION_SEQ", allocationSize = 1)
    @Column(name = "STEP_EXECUTION_ID")
    private Long stepExecutionId;

    @Column(name = "VERSION", nullable = false)
    private Long version;

    @Column(name = "STEP_NAME", length = 100, nullable = false)
    private String stepName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "JOB_EXECUTION_ID")
    private BatchJobExecution jobExecution;

    @Column(name = "CREATE_TIME", nullable = false)
    private LocalDateTime createTime;

    @Column(name = "START_TIME")
    private LocalDateTime startTime;

    @Column(name = "END_TIME")
    private LocalDateTime endTime;

    @Column(name = "STATUS", length = 10)
    private String status;

    @Column(name = "COMMIT_COUNT")
    private Long commitCount;

    @Column(name = "READ_COUNT")
    private Long readCount;

    @Column(name = "FILTER_COUNT")
    private Long filterCount;

    @Column(name = "WRITE_COUNT")
    private Long writeCount;

    @Column(name = "READ_SKIP_COUNT")
    private Long readSkipCount;

    @Column(name = "WRITE_SKIP_COUNT")
    private Long writeSkipCount;

    @Column(name = "PROCESS_SKIP_COUNT")
    private Long processSkipCount;

    @Column(name = "ROLLBACK_COUNT")
    private Long rollbackCount;

    @Column(name = "EXIT_CODE", length = 2500)
    private String exitCode;

    @Column(name = "EXIT_MESSAGE", length = 2500)
    private String exitMessage;

    @Column(name = "LAST_UPDATED")
    private LocalDateTime lastUpdated;

    @OneToOne(mappedBy = "stepExecution", cascade = CascadeType.ALL)
    private BatchStepExecutionContext context;
}
