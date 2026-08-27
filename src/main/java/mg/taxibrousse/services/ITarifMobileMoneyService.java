package mg.taxibrousse.services;

import mg.taxibrousse.models.TarifMobileMoney;
import java.math.BigDecimal;
import java.util.Optional;

public interface ITarifMobileMoneyService {

    Optional<TarifMobileMoney> findById(Long id);

    TarifMobileMoney save(TarifMobileMoney tarifMobileMoney);

    void deleteById(Long id);

    Optional<TarifMobileMoney> findTarifMobileMoney(String operatorName, BigDecimal amount);
}
