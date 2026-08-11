package mg.taxibrousse.services.implementation;

import lombok.AllArgsConstructor;
import mg.taxibrousse.entities.FokotanyEntity;
import mg.taxibrousse.repositories.IFokotanyRepository;
import mg.taxibrousse.services.IFokotanyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FokotanyService implements IFokotanyService {

    private final IFokotanyRepository fokotanyRepository;

    @Override
    public void saveAll(List<FokotanyEntity> fokotanies) {
        fokotanyRepository.saveAll(fokotanies);
    }
}
