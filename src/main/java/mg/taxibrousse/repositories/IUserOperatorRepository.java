package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.UserOperatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserOperatorRepository extends JpaRepository<UserOperatorEntity, Long> {
    void deleteUserDetailsByUsername(String username);

    boolean existsByUsername(String username);

    Optional<UserOperatorEntity> findByUsername(String username);

    @Query(
        "SELECT DISTINCT u FROM UserOperator u " +
        "LEFT JOIN FETCH u.koperative k " +
        "LEFT JOIN FETCH u.guichets g " +
        "LEFT JOIN FETCH g.gare ga " +
        "LEFT JOIN FETCH ga.ville v " +
        "WHERE u.username = :username"
    )
    Optional<UserOperatorEntity> findByUsernameWithGuichets(@Param("username") String username);

    boolean existsByUsernameAndIdNot(String username, Long id);

    Optional<UserOperatorEntity> findByPhone(@Param("phone") String phone);

    @Query("SELECT u FROM UserOperator u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<UserOperatorEntity> findByEmail(@Param("email") String email);
}
