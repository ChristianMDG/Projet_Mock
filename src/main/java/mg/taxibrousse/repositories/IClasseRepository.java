package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.ClasseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IClasseRepository extends JpaRepository<ClasseEntity, Long> {

    List<ClasseEntity> findByKoperativeId(Long koperativeId);
}
