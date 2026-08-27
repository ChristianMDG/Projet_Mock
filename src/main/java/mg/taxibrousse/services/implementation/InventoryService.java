package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.dto.shop.InventoryDetailResponse;
import mg.taxibrousse.entities.InventoryEntity;
import mg.taxibrousse.entities.InventoryLogEntity;
import mg.taxibrousse.entities.ProductEntity;
import mg.taxibrousse.entities.ProductVariantEntity;
import mg.taxibrousse.exceptions.InsufficientStockException;
import mg.taxibrousse.models.Inventory;
import mg.taxibrousse.models.InventoryLog;
import mg.taxibrousse.repositories.IInventoryLogRepository;
import mg.taxibrousse.repositories.IInventoryRepository;
import mg.taxibrousse.repositories.IProductRepository;
import mg.taxibrousse.repositories.IProductVariantRepository;
import mg.taxibrousse.services.IInventoryService;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryService implements IInventoryService {

    private static final int ADJUST_MAX_RETRIES = 3;

    private final IInventoryRepository inventoryRepository;
    private final IInventoryLogRepository inventoryLogRepository;
    private final IProductRepository productRepository;
    private final IProductVariantRepository variantRepository;

    @Override
    @Transactional
    public InventoryEntity getOrCreate(Long productId, Long variantId) {
        return findInventory(productId, variantId).orElseGet(() -> createInventory(productId, variantId));
    }

    @Override
    @Transactional(readOnly = true)
    public int availableQuantity(Long productId, Long variantId) {
        return findInventory(productId, variantId).map(inv -> Math.max(0, inv.getQuantity() - inv.getReserved())).orElseGet(() -> fallbackStock(productId, variantId));
    }

    @Override
    @Transactional
    public void reserve(Long productId, Long variantId, int quantity, Long userId) {
        if (quantity <= 0) {
            return;
        }
        InventoryEntity inv = getOrCreate(productId, variantId);
        int available = inv.getQuantity() - inv.getReserved();
        if (available < quantity) {
            inv.setQuantity(inv.getReserved() + quantity);
        }
        inv.setReserved(inv.getReserved() + quantity);
        inventoryRepository.save(inv);
    }

    @Override
    @Transactional
    public void commitReservation(Long productId, Long variantId, int quantity, Long userId, String reason) {
        if (quantity <= 0) {
            return;
        }
        InventoryEntity inv = getOrCreate(productId, variantId);
        int reserved = Math.min(quantity, inv.getReserved());
        inv.setReserved(inv.getReserved() - reserved);
        inv.setQuantity(Math.max(0, inv.getQuantity() - quantity));
        inventoryRepository.save(inv);
        syncProductStock(inv);
        logChange(inv, -quantity, userId, reason);
    }

    @Override
    @Transactional
    public void releaseReservation(Long productId, Long variantId, int quantity, Long userId, String reason) {
        if (quantity <= 0) {
            return;
        }
        InventoryEntity inv = getOrCreate(productId, variantId);
        inv.setReserved(Math.max(0, inv.getReserved() - quantity));
        inventoryRepository.save(inv);
        logChange(inv, 0, userId, reason);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Inventory> search(Long productId, Long variantId, boolean lowStock, int threshold, Pageable pageable) {
        int effectiveThreshold = threshold > 0 ? threshold : 10;
        return inventoryRepository.searchInventory(productId, variantId, lowStock, effectiveThreshold, pageable).map(Inventory::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryDetailResponse findDetail(Long inventoryId, Pageable recentLogsPageable) {
        InventoryEntity inv = inventoryRepository.findById(inventoryId).orElseThrow(() -> new EntityNotFoundException("Inventory not found: " + inventoryId));
        Pageable pageable = recentLogsPageable != null ? recentLogsPageable : PageRequest.of(0, 20);
        Page<InventoryLog> logs = inventoryLogRepository.findByInventoryIdOrderByCreatedAtDesc(inventoryId, pageable).map(InventoryLog::fromEntity);
        return InventoryDetailResponse.of(Inventory.fromEntity(inv), logs);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InventoryLog> findLogs(Long inventoryId, Pageable pageable) {
        if (!inventoryRepository.existsById(inventoryId)) {
            throw new EntityNotFoundException("Inventory not found: " + inventoryId);
        }
        return inventoryLogRepository.findByInventoryIdOrderByCreatedAtDesc(inventoryId, pageable).map(InventoryLog::fromEntity);
    }

    @Override
    public Inventory adjust(Long inventoryId, int quantity, String reason, Long userId) {
        int attempt = 0;
        while (true) {
            try {
                return doAdjust(inventoryId, quantity, reason, userId);
            } catch (OptimisticLockingFailureException ex) {
                attempt++;
                if (attempt >= ADJUST_MAX_RETRIES) {
                    log.warn("Inventory adjust failed after {} retries for id={}", attempt, inventoryId);
                    throw ex;
                }
                log.info("Inventory adjust optimistic-lock retry {} for id={}", attempt, inventoryId);
            }
        }
    }

    @Transactional
    protected Inventory doAdjust(Long inventoryId, int quantity, String reason, Long userId) {
        InventoryEntity inv = inventoryRepository.findById(inventoryId).orElseThrow(() -> new EntityNotFoundException("Inventory not found: " + inventoryId));
        int previous = inv.getQuantity() != null ? inv.getQuantity() : 0;
        int delta = quantity - previous;
        inv.setQuantity(Math.max(0, quantity));
        InventoryEntity saved = inventoryRepository.save(inv);
        syncProductStock(saved);
        logChange(saved, delta, userId, reason);
        return Inventory.fromEntity(saved);
    }

    private java.util.Optional<InventoryEntity> findInventory(Long productId, Long variantId) {
        if (variantId == null) {
            return inventoryRepository.findFirstByProductIdAndVariantIsNull(productId);
        }
        return inventoryRepository.findFirstByProductIdAndVariantId(productId, variantId);
    }

    private InventoryEntity createInventory(Long productId, Long variantId) {
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found: " + productId));
        ProductVariantEntity variant = null;
        if (variantId != null) {
            variant = variantRepository.findById(variantId).orElseThrow(() -> new EntityNotFoundException("Variant not found: " + variantId));
        }
        InventoryEntity inv = new InventoryEntity();
        inv.setProduct(product);
        inv.setVariant(variant);
        inv.setQuantity(variant != null ? variant.getStock() : product.getStock());
        inv.setReserved(0);
        return inventoryRepository.save(inv);
    }

    private int fallbackStock(Long productId, Long variantId) {
        if (variantId != null) {
            return variantRepository.findById(variantId).map(ProductVariantEntity::getStock).orElse(0);
        }
        return productRepository.findById(productId).map(ProductEntity::getStock).orElse(0);
    }

    private void syncProductStock(InventoryEntity inv) {
        if (inv.getVariant() != null) {
            ProductVariantEntity variant = inv.getVariant();
            variant.setStock(inv.getQuantity());
            variantRepository.save(variant);
            return;
        }
        ProductEntity product = inv.getProduct();
        product.setStock(inv.getQuantity());
        productRepository.save(product);
    }

    private void logChange(InventoryEntity inv, int delta, Long userId, String reason) {
        InventoryLogEntity log = new InventoryLogEntity();
        log.setInventory(inv);
        log.setDelta(delta);
        log.setReason(reason);
        log.setUserId(userId);
        inventoryLogRepository.save(log);
    }
}
