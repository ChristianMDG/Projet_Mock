package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ProductRouteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductRouteRepository extends JpaRepository<ProductRouteEntity, Long> {

    /**
     * Finds active product links for a voyage route identified by its name.
     *
     * <p>
     * {@code RouteEntity} does not currently expose a dedicated {@code slug} column;
     * the frontend consumes the route {@code name} as the public slug, so this query
     * resolves on {@code route.name}. If a real slug column is introduced later, update
     * this method name accordingly.
     * </p>
     */
    List<ProductRouteEntity> findByRoute_NameAndIsActiveTrueOrderByDisplayOrderAsc(String routeName);

    List<ProductRouteEntity> findByProduct_IdOrderByDisplayOrderAsc(Long productId);

    boolean existsByProduct_IdAndRoute_Id(Long productId, Long routeId);

    void deleteByProduct_IdAndRoute_Id(Long productId, Long routeId);
}
