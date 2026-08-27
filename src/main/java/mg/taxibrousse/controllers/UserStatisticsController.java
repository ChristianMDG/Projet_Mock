package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IUserStatisticsController;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.models.DailyConnectionStats;
import mg.taxibrousse.models.UserStatistics;
import mg.taxibrousse.models.Voyageur;
import mg.taxibrousse.repositories.IVoyageurRepository;
import mg.taxibrousse.services.IDailyConnectionService;
import mg.taxibrousse.services.IWebSocketSessionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserStatisticsController implements IUserStatisticsController {

    private final IVoyageurRepository voyageurRepository;
    private final IWebSocketSessionService sessionService;
    private final IDailyConnectionService dailyConnectionService;

    @Override
    public ResponseEntity<UserStatistics> getUserStatistics() {
        long totalVoyageurs = voyageurRepository.count();
        long activeVoyageurs = voyageurRepository.countByIsActive(true);
        long inactiveVoyageurs = totalVoyageurs - activeVoyageurs;

        UserStatistics stats = UserStatistics.builder()
                .totalVoyageurs(totalVoyageurs)
                .activeVoyageurs(activeVoyageurs)
                .inactiveVoyageurs(inactiveVoyageurs)
                .connectedWebSocketUsers(sessionService.getActiveUserCount())
                .connectedUsernames(sessionService.getActiveUsernames())
                .connectedGuichetUsers(sessionService.getActiveGuichetUserCount())
                .connectedGuichetUsernames(sessionService.getActiveGuichetUsernames())
                .totalSessions(sessionService.getActiveSessions().size())
                .build();

        return ResponseEntity.ok(stats);
    }

    @Override
    public ResponseEntity<Page<Voyageur>> getAllVoyageurs(String search, Boolean isActive, Pageable pageable) {
        Page<VoyageurEntity> entities;

        if (StringUtils.hasText(search)) {
            if (isActive != null) {
                entities = voyageurRepository.searchByKeywordAndStatus(search, isActive, pageable);
            } else {
                entities = voyageurRepository.searchByKeyword(search, pageable);
            }
        } else if (isActive != null) {
            entities = voyageurRepository.findByIsActive(isActive, pageable);
        } else {
            entities = voyageurRepository.findAll(pageable);
        }

        Page<Voyageur> result = entities.map(entity -> Voyageur.fromEntity(entity, false));
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Voyageur> toggleVoyageurStatus(Long id) {
        return voyageurRepository.findById(id).map(entity -> {
            entity.setIsActive(!entity.getIsActive());
            VoyageurEntity saved = voyageurRepository.save(entity);
            return ResponseEntity.ok(Voyageur.fromEntity(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<DailyConnectionStats>> getDailyConnections(int days) {
        int clampedDays = Math.min(Math.max(days, 1), 90);
        return ResponseEntity.ok(dailyConnectionService.getConnectionTrend(clampedDays));
    }
}
