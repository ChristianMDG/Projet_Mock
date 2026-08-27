package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.AuthorityEntity;
import mg.taxibrousse.repositories.IAuthorityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final IAuthorityRepository authorityRepository;

    @Transactional(readOnly = true)
    public List<AuthorityEntity> findAll() {
        return authorityRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<AuthorityEntity> findById(Long id) {
        return authorityRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public AuthorityEntity findByName(String name) {
        return authorityRepository.findByName(name);
    }

    @Transactional
    public AuthorityEntity save(AuthorityEntity authority) {
        return authorityRepository.save(authority);
    }

    @Transactional
    public void deleteById(Long id) {
        authorityRepository.deleteById(id);
    }
}
