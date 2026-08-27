package mg.taxibrousse.services;

import mg.taxibrousse.entities.UserOperatorEntity;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.dto.OperateurSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOperatorService {

    UserOperator findById(Long id);

    List<UserOperator> findAll();

    UserOperator save(UserOperator operator);

    void deleteById(Long id);

    List<UserOperator> findByKoperativeId(Long koperativeId);

    /**
     * Assigns guichets to the operator and manages operator-guichet relationships.
     *
     * @param operator the UserOperator to process
     */
    void assignGuichets(UserOperatorEntity operator);

    /**
     * Search users by phone, email, firstName, lastName or idNumber
     */
    List<UserOperator> searchUsers(String search);

    /**
     * Search operators with multiple filter criteria
     *
     * @param search Text search in name, phone, email, etc.
     * @param koperativeId Filter by cooperative ID
     * @param isActive Filter by active status
     * @param gareId Filter by gare (station) ID through guichets
     * @return List of filtered operators
     */
    List<UserOperator> searchOperators(String search, Long koperativeId, Boolean isActive, Long gareId);

    /**
     * Search operators with pagination and filter criteria
     */
    Page<UserOperator> findAllPageable(OperateurSearchRequest request, Pageable pageable);

    /**
     * Save or update operator account with validation and authorities
     *
     * @param model UserOperator model
     * @param authorities Authority roles to assign
     * @return Success or error message key
     */
    String saveOperatorAccount(UserOperator model, AuthorityEnum... authorities);

    /**
     * Find operator by username (with guichets loaded)
     *
     * @param username Username to search
     * @return UserOperator or null if not found
     */
    UserOperator findByUsername(String username);
}
