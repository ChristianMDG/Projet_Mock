package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.AuthorityEnum;
import mg.taxibrousse.exceptions.EmailAlreadyExistsException;
import mg.taxibrousse.exceptions.PhoneAlreadyExistsException;
import mg.taxibrousse.models.Voyageur;
import mg.taxibrousse.repositories.IAuthorityRepository;
import mg.taxibrousse.repositories.IVoyageurRepository;
import mg.taxibrousse.services.IVoyageurService;
import mg.taxibrousse.utils.PhoneUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoyageurService implements IVoyageurService {

    private final IVoyageurRepository voyageurRepository;
    private final IAuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    // Constants for error messages
    private static final String ERROR_INVALID_PHONE = "error_invalid_madagascar_phone";
    private static final String ERROR_PHONE_TAKEN = "error_phone_already_taken";
    private static final String SUCCESS_USER_CREATED = "success_user_created";
    private static final String ERROR_CREATING_USER = "error_creating_user";

    @Override
    @Transactional
    public Voyageur save(Voyageur voyageur) {
        if (voyageur.getEmail() != null && !voyageur.getEmail().isBlank()) {
            boolean emailTaken = voyageur.getId() == 0
                ? voyageurRepository.existsByEmail(voyageur.getEmail())
                : voyageurRepository.existsByEmailAndIdNot(voyageur.getEmail(), voyageur.getId());
            if (emailTaken)
                throw new EmailAlreadyExistsException("error_email_already_taken");
        }
        VoyageurEntity entity = voyageur.toEntity();
        VoyageurEntity saved = voyageurRepository.save(entity);
        return Voyageur.fromEntity(saved);
    }

    @Override
    public Voyageur findById(Long id) {
        return findById(id, voyageurRepository, Voyageur::fromEntity);
    }

    @Override
    @Transactional
    public Voyageur findByPhoneOrIdNumber(String phone, String idNumber) {
        return voyageurRepository.findByPhoneOrIdNumber(phone, idNumber).map(Voyageur::fromEntity).orElse(null);
    }

    @Override
    @Transactional
    public Voyageur saveVoyageurAccount(Voyageur model) {
        validateVoyageurPhone(model);

        VoyageurEntity existingEntity = model.getId() > 0
            ? voyageurRepository.findById(model.getId()).orElse(null)
            : null;

        VoyageurEntity voyageur = model.toEntity(existingEntity);
        if (model.getId() == 0)
            setupVoyageurAccount(voyageur, model);
        if (model.hasPassword())
            voyageur.setPassword(passwordEncoder.encode(model.getPassword()));

        VoyageurEntity saved = voyageurRepository.save(voyageur);
        return Voyageur.fromEntity(saved);
    }

    private void validateVoyageurPhone(Voyageur model) {
        String normalizedPhone = PhoneUtils.normalizePhone(model.getPhone());
        if (!PhoneUtils.isValidMadagascarPhone(normalizedPhone)) 
            throw new IllegalArgumentException(ERROR_INVALID_PHONE);
        
        boolean phoneExists = model.getId() == 0 
            ? voyageurRepository.existsByUsername(normalizedPhone)
            : voyageurRepository.existsByUsernameAndIdNot(normalizedPhone, model.getId());
        
        if (phoneExists) {
            throw new PhoneAlreadyExistsException(ERROR_PHONE_TAKEN, "Phone number already registered");
        }
    }

    @Transactional
    protected void setupVoyageurAccount(VoyageurEntity voyageur, Voyageur model) {
        voyageur.setUsername(PhoneUtils.normalizePhone(model.getPhone()));
        voyageur.setAuthorities(new HashSet<>(authorityRepository.findByNameIn(List.of(AuthorityEnum.USER.getName()))));
        voyageur.setAdmin(false);
        if (model.hasPassword()) 
            voyageur.setPassword(passwordEncoder.encode(model.getPassword()));
    }
}
