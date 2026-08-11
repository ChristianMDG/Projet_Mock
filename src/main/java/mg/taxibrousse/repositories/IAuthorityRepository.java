package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.AuthorityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface IAuthorityRepository extends JpaRepository<AuthorityEntity, Long> {
    AuthorityEntity findByName(String name);

    boolean existsByName(String name);

    Set<AuthorityEntity> findByNameIn(List<String> names);
}
