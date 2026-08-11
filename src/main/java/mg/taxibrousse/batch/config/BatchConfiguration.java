package mg.taxibrousse.batch.config;

import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration globale pour Spring Batch et Scheduling
 * Spring Batch utilisera automatiquement le DataSource PostgreSQL existant
 * pour stocker les métadonnées batch (tables BATCH_*)
 */
@Configuration
@EnableBatchProcessing
@EnableScheduling
public class BatchConfiguration {
    // Spring Batch auto-configuration créera automatiquement:
    // - JobRepository
    // - JobLauncher
    // - PlatformTransactionManager
    // - Tables de métadonnées (BATCH_JOB_INSTANCE, BATCH_JOB_EXECUTION, etc.)
}
