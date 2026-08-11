package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.UserInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface IUserInfoRepository extends JpaRepository<UserInfoEntity, Long> {

    @Transactional(readOnly = true)
    Optional<UserInfoEntity> findByUsername(@Param("username") String username);
}
