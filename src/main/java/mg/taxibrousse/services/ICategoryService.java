package mg.taxibrousse.services;

import mg.taxibrousse.models.Category;

import java.util.List;

public interface ICategoryService {

    List<Category> findAll();

    Category findById(Long id);

    List<Category> findTree();

    Category create(Category request);

    Category update(Long id, Category request);

    void deleteById(Long id);
}
