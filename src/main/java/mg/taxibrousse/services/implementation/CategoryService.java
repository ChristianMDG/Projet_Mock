package mg.taxibrousse.services.implementation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.CategoryEntity;
import mg.taxibrousse.exceptions.ShopException;
import mg.taxibrousse.models.Category;
import mg.taxibrousse.repositories.ICategoryRepository;
import mg.taxibrousse.services.ICategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {

    private final ICategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream().map(Category::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Category findById(Long id) {
        CategoryEntity entity = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
        return Category.fromEntityWithSubcategories(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> findTree() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream().map(Category::fromEntityWithSubcategories).toList();
    }

    @Override
    @Transactional
    public Category create(Category req) {
        if (categoryRepository.existsBySlug(req.getSlug())) {
            throw new ShopException("error_duplicate_slug", "exception_duplicate_slug");
        }
        CategoryEntity entity = new CategoryEntity();
        entity.setName(req.getName());
        entity.setDescription(req.getDescription());
        entity.setSlug(req.getSlug());
        if (req.getIsActive() != null)
            entity.setIsActive(req.getIsActive());
        if (req.getDisplayOrder() != null)
            entity.setDisplayOrder(req.getDisplayOrder());
        return Category.fromEntity(categoryRepository.save(entity));
    }

    @Override
    @Transactional
    public Category update(Long id, Category req) {
        CategoryEntity entity = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
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
        return Category.fromEntity(categoryRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
