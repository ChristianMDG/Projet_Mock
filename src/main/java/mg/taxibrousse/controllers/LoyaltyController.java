package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.ILoyaltyController;
import mg.taxibrousse.models.LoyaltyConfig;
import mg.taxibrousse.models.LoyaltyView;
import mg.taxibrousse.services.ILoyaltyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LoyaltyController implements ILoyaltyController {

    private final ILoyaltyService loyaltyService;

    @Override
    public ResponseEntity<LoyaltyView> getLoyaltyView(Long voyageurId) {
        return ResponseEntity.ok(loyaltyService.getView(voyageurId));
    }

    @Override
    public ResponseEntity<LoyaltyConfig> getConfig() {
        return ResponseEntity.ok(loyaltyService.getConfig());
    }

    @Override
    public ResponseEntity<LoyaltyConfig> updateConfig(LoyaltyConfig config) {
        return ResponseEntity.ok(loyaltyService.updateConfig(config));
    }
}
