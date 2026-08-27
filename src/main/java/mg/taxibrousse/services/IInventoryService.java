package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.InventoryDetailResponse;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.models.Inventory;
import mg.taxibrousse.models.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IInventoryService {

    InventoryEntity getOrCreate(Long productId, Long variantId);

    int availableQuantity(Long productId, Long variantId);

    void reserve(Long productId, Long variantId, int quantity, Long userId);

    void commitReservation(Long productId, Long variantId, int quantity, Long userId, String reason);

    void releaseReservation(Long productId, Long variantId, int quantity, Long userId, String reason);

    Page<Inventory> search(Long productId, Long variantId, boolean lowStock, int threshold, Pageable pageable);

    InventoryDetailResponse findDetail(Long inventoryId, Pageable recentLogsPageable);

    Page<InventoryLog> findLogs(Long inventoryId, Pageable pageable);

    Inventory adjust(Long inventoryId, int quantity, String reason, Long userId);
}
