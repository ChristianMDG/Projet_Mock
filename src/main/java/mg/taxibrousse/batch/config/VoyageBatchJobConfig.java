package mg.taxibrousse.batch.config;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.batch.processor.VoyageItemProcessor;
import mg.taxibrousse.batch.reader.KoperativeItemReader;
import mg.taxibrousse.batch.writer.VoyageItemWriter;
import mg.taxibrousse.entities.KoperativeEntity;
import mg.taxibrousse.entities.VoyageEntity;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;

/**
 * Configuration du Job Spring Batch pour la génération de voyages
 */
@Configuration
@RequiredArgsConstructor
public class VoyageBatchJobConfig {

    private final KoperativeItemReader koperativeItemReader;
    private final VoyageItemProcessor voyageItemProcessor;
    private final VoyageItemWriter voyageItemWriter;

    /**
     * Job principal de génération de voyages
     */
    @Bean
    public Job voyageGenerationJob(JobRepository jobRepository, Step generateVoyagesStep) {
        return new JobBuilder("voyageGenerationJob", jobRepository)
                .start(generateVoyagesStep)
                .build();
    }

    /**
     * Step de génération de voyages
     * Chunk size = 5 : traite 5 coopératives à la fois
     */
    @Bean
    public Step generateVoyagesStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager) {
        return new StepBuilder("generateVoyagesStep", jobRepository)
                .<KoperativeEntity, List<VoyageEntity>>chunk(5, transactionManager)
                .reader(koperativeItemReader)
                .processor(voyageItemProcessor)
                .writer(voyageItemWriter)
                .build();
    }
}
