package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.BaseEntity;
import mg.taxibrousse.entities.CloudinaryEntity;
import mg.taxibrousse.entities.GuichetEntity;
import mg.taxibrousse.entities.UserOperatorEntity;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.models.Cloudinary;
import mg.taxibrousse.models.UserOperator;
import mg.taxibrousse.repositories.*;
import mg.taxibrousse.services.IOperatorService;
import mg.taxibrousse.utils.PhoneUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OperatorService implements IOperatorService {

    private final IOperatorRepository operatorRepository;
    private final IUserOperatorRepository userOperatorRepository;
    private final IGuichetRepository guichetRepository;
    private final IAuthorityRepository authorityRepository;
    private final ICloudinaryRepository cloudinaryRepository;
    private final PasswordEncoder passwordEncoder;

    // Constants for error messages
    private static final String ERROR_INVALID_PHONE = "error_invalid_madagascar_phone";
    private static final String ERROR_PHONE_TAKEN = "error_phone_already_taken";
    private static final String SUCCESS_USER_CREATED = "success_user_created";
    private static final String ERROR_CREATING_USER = "error_creating_user";

    /**
     * Assigns guichets to the operator and manages operator-guichet relationships.
     */
    @Override
    @Transactional
    public void assignGuichets(UserOperatorEntity operatorEntity) {
        List<GuichetEntity> previouslyAssignedGuichets = operatorEntity.getId() != null && operatorEntity.getId() > 0
            ? operatorRepository.findGuichetsByUserOperatorId(operatorEntity.getId())
            : List.of();
        var requestedGuichets = guichetRepository.findAllById(
            operatorEntity.getGuichets().stream().map(BaseEntity::getId).toList()
        );

        operatorEntity.setGuichets(new HashSet<>());
        for (GuichetEntity guichet : requestedGuichets) {
            operatorEntity.getGuichets().add(guichet);
            if (
                guichet
                    .getOperateurs()
                    .stream()
                    .noneMatch(op -> op.getId().equals(operatorEntity.getId()))
            ) {
                guichet.getOperateurs().add(operatorEntity);
            }
        }

        for (GuichetEntity oldGuichet : previouslyAssignedGuichets) {
            if (requestedGuichets.stream().noneMatch(g -> g.getId().equals(oldGuichet.getId()))) {
                oldGuichet.getOperateurs().removeIf(op -> op.getId().equals(operatorEntity.getId()));
            }
        }

        guichetRepository.saveAll(previouslyAssignedGuichets);
        guichetRepository.saveAll(requestedGuichets);
    }

    @Override
    @Transactional(readOnly = true)
    public UserOperator findById(Long id) {
        return operatorRepository.findById(id).map(UserOperator::fromEntity).orElse(null);
    }

    @Override
    public List<UserOperator> findAll() {
        return operatorRepository.findAllOperators().stream().map(UserOperator::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserOperator> findByKoperativeId(Long koperativeId) {
        return operatorRepository.findByKoperativeId(koperativeId).stream().map(UserOperator::fromEntity).toList();
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        operatorRepository.deleteById(id);
    }

    @Override
    public UserOperator save(UserOperator operator) {
        return UserOperator.fromEntity(operatorRepository.save(operator.toEntity()));
    }

    @Override
    public List<UserOperator> searchUsers(String search) {
        if (search == null || search.trim().isEmpty()) {
            return findAll();
        }
        return operatorRepository.findBySearchCriteria(search).stream().map(UserOperator::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserOperator> searchOperators(String search, Long koperativeId, Boolean isActive, Long gareId) {
        return operatorRepository.findByFilterCriteria(search, koperativeId, isActive, gareId)
                .stream()
                .map(entity -> UserOperator.fromEntity(entity, true))
                .toList();
    }

    @Override
    @Transactional
    public String saveOperatorAccount(UserOperator model, AuthorityEnum... authorities) {
        String normalizedPhone = PhoneUtils.normalizePhone(model.getPhone());
        if (!PhoneUtils.isValidMadagascarPhone(normalizedPhone)) 
            return ERROR_INVALID_PHONE;
        if (userOperatorRepository.existsByUsernameAndIdNot(model.getUsername(), model.getId())) 
            return ERROR_PHONE_TAKEN;

        try {
            var account = model.toEntity(userOperatorRepository.findById(model.getId()).orElse(new UserOperatorEntity()));
            
            if (model.getPhoto() != null) 
                account.setPhoto(saveCloudinaryEntity(model.getPhoto()));
            if (model.getId() == 0) 
                setupNewAccount(account, model, prepareAuthorities(authorities));

            if (model.hasPassword()) 
                account.setPassword(passwordEncoder.encode(model.getPassword()));
            if (model.getId() > 0 && !model.isWithKoperative() && !model.hasKoperative()) 
                account.setKoperative(null);

            var userInfo = userOperatorRepository.save(account);
            if (model.isWithKoperative() && model.hasKoperative()) 
                assignGuichets(userInfo);

            return SUCCESS_USER_CREATED;
        } catch (Exception e) {
            return ERROR_CREATING_USER;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserOperator findByUsername(String username) {
        return userOperatorRepository.findByUsernameWithGuichets(username)
            .map(entity -> UserOperator.fromEntity(entity, true))
            .orElse(null);
    }

    private CloudinaryEntity saveCloudinaryEntity(Cloudinary cloudinary) {
        CloudinaryEntity entity = cloudinary.toEntity();
        return cloudinaryRepository.existsByPublicId(entity.getPublicId())
            ? cloudinaryRepository.findByPublicId(entity.getPublicId()).orElse(null)
            : cloudinaryRepository.save(entity);
    }

    private AuthorityEnum[] prepareAuthorities(AuthorityEnum... authorities) {
        return (authorities == null || authorities.length == 0) 
            ? new AuthorityEnum[]{AuthorityEnum.USER} 
            : authorities;
    }

    private void setupNewAccount(UserOperatorEntity account, UserOperator model, AuthorityEnum[] authorities) {
        account.setAdmin(Arrays.stream(authorities).anyMatch(auth -> auth == AuthorityEnum.ADMIN));
        account.setAuthorities(authorityRepository.findByNameIn(
            Arrays.stream(authorities).map(AuthorityEnum::getName).toList()
        ));

        if (model.isCreation() || model.hasPassword()) {
            account.setPassword(passwordEncoder.encode(model.getPassword()));
        }

        if (Arrays.stream(authorities).anyMatch(auth -> auth == AuthorityEnum.USER)) {
            account.setKoperative(null);
            account.setGuichets(null);
        }
    }
}
