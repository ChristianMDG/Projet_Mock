package mg.taxibrousse.batch.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Scheduler qui lance automatiquement le batch de génération de voyages tous les 7 jours
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class VoyageBatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job voyageGenerationJob;

    /**
     * Lance le batch automatiquement tous les 7 jours (chaque lundi à 21h)
     * Cron: "0 0 21 * * MON" = seconde minute heure jour mois jour-de-semaine
     * - 0 0 21 = à 21h00:00
     * - * * = tous les jours de tous les mois
     * - MON = le lundi (tous les 7 jours)
     */
    @Scheduled(cron = "0 0 21 * * MON")
    public void scheduledBatchRun() {
        runVoyageBatch();
    }

    /**
     * Méthode publique pour déclencher manuellement le batch
     * Peut être appelée depuis un contrôleur REST
     */
    public void runVoyageBatch() {
        try {
            log.info("Démarrage du batch de génération de voyages à {}", LocalDateTime.now());
            
            // Créer des paramètres uniques pour chaque exécution
            // Spring Batch n'exécutera pas deux fois le même job avec les mêmes paramètres
            JobParameters params = new JobParametersBuilder()
                    .addLocalDateTime("runTime", LocalDateTime.now())
                    .toJobParameters();
            
            jobLauncher.run(voyageGenerationJob, params);
            
            log.info("Batch de génération de voyages terminé avec succès");
        } catch (Exception e) {
            log.error("Erreur lors de l'exécution du batch de génération de voyages", e);
        }
    }
}
