package mg.taxibrousse.services;

import mg.taxibrousse.dto.shop.CategoryReorderRequest;
import mg.taxibrousse.models.ProductCategory;

import java.util.List;

public interface IProductCategoryService {

    List<ProductCategory> findAll();

    ProductCategory findById(Long id);

    List<ProductCategory> findByCategoryId(Long categoryId);

    ProductCategory create(ProductCategory request);

    ProductCategory update(Long id, ProductCategory request);

    void deleteById(Long id);

    void reorder(CategoryReorderRequest request);
}
