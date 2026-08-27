package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IInventoryController;
import mg.taxibrousse.dto.shop.InventoryAdjustRequest;
import mg.taxibrousse.dto.shop.InventoryDetailResponse;
import mg.taxibrousse.models.Inventory;
import mg.taxibrousse.models.InventoryLog;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IInventoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class InventoryController implements IInventoryController {

    private final IInventoryService inventoryService;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<Page<Inventory>> listInventory(Long productId, Long variantId, boolean lowStock, int threshold, Pageable pageable) {
        return ResponseEntity.ok(inventoryService.search(productId, variantId, lowStock, threshold, pageable));
    }

    @Override
    public ResponseEntity<Page<Inventory>> listLowStock(int threshold, Pageable pageable) {
        return ResponseEntity.ok(inventoryService.search(null, null, true, threshold, pageable));
    }

    @Override
    public ResponseEntity<InventoryDetailResponse> getInventoryDetail(Long id, Pageable recentLogs) {
        return ResponseEntity.ok(inventoryService.findDetail(id, recentLogs));
    }

    @Override
    public ResponseEntity<Inventory> adjustInventory(Long id, InventoryAdjustRequest request, Authentication authentication) {
        Long userId = resolveUserId(authentication);
        Inventory response = inventoryService.adjust(id, request.getQuantity(), request.getReason(), userId);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Page<InventoryLog>> listInventoryLogs(Long id, Pageable pageable) {
        return ResponseEntity.ok(inventoryService.findLogs(id, pageable));
    }

    private Long resolveUserId(Authentication authentication) {
        boolean hasAuth = authentication != null && authentication.isAuthenticated() && authentication.getName() != null;
        if (!hasAuth) {
            return null;
        }
        return userInfoRepository.findByUsername(authentication.getName()).map(u -> u.getId()).orElse(null);
    }
}
