package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.models.FraisTransaction;
import mg.taxibrousse.repositories.IFraisTransactionRepository;
import mg.taxibrousse.services.IFraisTransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FraisTransactionService implements IFraisTransactionService {

    private final IFraisTransactionRepository repository;

    @Override
    @Transactional(readOnly = true)
    public Optional<FraisTransaction> findByOperatorName(String operatorName) {
        if (StringUtils.hasText(operatorName)) {
            return repository.findByOperatorName(operatorName).map(FraisTransaction::fromEntity);
        }
        return Optional.empty();
    }
}
