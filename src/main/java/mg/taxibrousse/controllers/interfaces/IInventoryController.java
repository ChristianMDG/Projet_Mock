package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.InventoryAdjustRequest;
import mg.taxibrousse.dto.shop.InventoryDetailResponse;
import mg.taxibrousse.models.Inventory;
import mg.taxibrousse.models.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IInventoryController {

    @GetMapping
    ResponseEntity<Page<Inventory>> listInventory(@RequestParam(required = false) Long productId, @RequestParam(required = false) Long variantId,
            @RequestParam(defaultValue = "false") boolean lowStock, @RequestParam(defaultValue = "10") int threshold, @PageableDefault(size = 20) Pageable pageable);

    @GetMapping("/low-stock")
    ResponseEntity<Page<Inventory>> listLowStock(@RequestParam(defaultValue = "10") int threshold, @PageableDefault(size = 20) Pageable pageable);

    @GetMapping("/{id}")
    ResponseEntity<InventoryDetailResponse> getInventoryDetail(@PathVariable Long id, @PageableDefault(size = 20) Pageable recentLogs);

    @PutMapping("/{id}")
    ResponseEntity<Inventory> adjustInventory(@PathVariable Long id, @Valid @RequestBody InventoryAdjustRequest request, Authentication authentication);

    @GetMapping("/{id}/logs")
    ResponseEntity<Page<InventoryLog>> listInventoryLogs(@PathVariable Long id, @PageableDefault(size = 20) Pageable pageable);
}
