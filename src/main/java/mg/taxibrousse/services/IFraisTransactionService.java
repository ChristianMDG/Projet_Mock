package mg.taxibrousse.services;

import mg.taxibrousse.models.FraisTransaction;

import java.util.Optional;

public interface IFraisTransactionService {

    Optional<FraisTransaction> findByOperatorName(String operatorName);
}
