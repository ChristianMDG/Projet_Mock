package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.shop.CategoryReorderRequest;
import mg.taxibrousse.entities.CategoryEntity;
import mg.taxibrousse.entities.ProductCategoryEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.ProductCategory;
import mg.taxibrousse.repositories.ICategoryRepository;
import mg.taxibrousse.repositories.IProductCategoryRepository;
import mg.taxibrousse.services.IProductCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryService implements IProductCategoryService {

    private final IProductCategoryRepository categoryRepository;
    private final ICategoryRepository parentCategoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductCategory> findAll() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream().map(ProductCategory::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductCategory findById(Long id) {
        ProductCategoryEntity entity = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Subcategory not found: " + id));
        return ProductCategory.fromEntity(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCategory> findByCategoryId(Long categoryId) {
        return categoryRepository.findByCategoryIdOrderByDisplayOrderAsc(categoryId).stream().map(ProductCategory::fromEntity).toList();
    }

    @Override
    @Transactional
    public ProductCategory create(ProductCategory req) {
        if (categoryRepository.existsBySlug(req.getSlug())) {
            throw new ShopException("error_duplicate_slug", "exception_duplicate_slug");
        }
        ProductCategoryEntity entity = new ProductCategoryEntity();
        entity.setName(req.getName());
        entity.setDescription(req.getDescription());
        entity.setSlug(req.getSlug());
        if (req.getIsActive() != null)
            entity.setIsActive(req.getIsActive());
        if (req.getDisplayOrder() != null)
            entity.setDisplayOrder(req.getDisplayOrder());
        entity.setCategory(resolveParent(req.getParentId()));
        return ProductCategory.fromEntity(categoryRepository.save(entity));
    }

    @Override
    @Transactional
    public ProductCategory update(Long id, ProductCategory req) {
        ProductCategoryEntity entity = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Subcategory not found: " + id));
        if (req.getSlug() != null && !req.getSlug().equals(entity.getSlug())) {
            if (categoryRepository.existsBySlug(req.getSlug())) {
                throw new ShopException("error_duplicate_slug", "exception_duplicate_slug");
            }
            entity.setSlug(req.getSlug());
        }
        if (req.getName() != null)
            entity.setName(req.getName());
        if (req.getDescription() != null)
            entity.setDescription(req.getDescription());
        if (req.getIsActive() != null)
            entity.setIsActive(req.getIsActive());
        if (req.getDisplayOrder() != null)
            entity.setDisplayOrder(req.getDisplayOrder());
        if (req.getParentId() != null) {
            entity.setCategory(resolveParent(req.getParentId()));
        }
        return ProductCategory.fromEntity(categoryRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Subcategory not found: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void reorder(CategoryReorderRequest request) {
        if (request == null || request.getItems() == null) {
            return;
        }
        for (CategoryReorderRequest.CategoryOrderItem item : request.getItems()) {
            ProductCategoryEntity entity = categoryRepository.findById(item.getId()).orElseThrow(() -> new EntityNotFoundException("Subcategory not found: " + item.getId()));
            if (item.getDisplayOrder() != null) {
                entity.setDisplayOrder(item.getDisplayOrder());
            }
            if (item.getParentId() != null) {
                entity.setCategory(resolveParent(item.getParentId()));
            }
            categoryRepository.save(entity);
        }
    }

    private CategoryEntity resolveParent(Long parentId) {
        if (parentId == null) {
            throw new ShopException("error_parent_required", "exception_subcategory_parent_required");
        }
        return parentCategoryRepository.findById(parentId).orElseThrow(() -> new EntityNotFoundException("Parent category not found: " + parentId));
    }
}
