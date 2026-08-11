package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.AuthorityEntity;
import mg.taxibrousse.repositories.IAuthorityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthorityService {

    private final IAuthorityRepository IAuthorityRepository;

    public List<AuthorityEntity> findAll() {
        return IAuthorityRepository.findAll();
    }

    public Optional<AuthorityEntity> findById(Long id) {
        return IAuthorityRepository.findById(id);
    }

    public AuthorityEntity findByName(String name) {
        return IAuthorityRepository.findByName(name);
    }

    public AuthorityEntity save(AuthorityEntity authority) {
        return IAuthorityRepository.save(authority);
    }

    public void deleteById(Long id) {
        IAuthorityRepository.deleteById(id);
    }
}
