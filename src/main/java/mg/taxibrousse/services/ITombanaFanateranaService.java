package mg.taxibrousse.services;

import mg.taxibrousse.models.TombanaFanaterana;
import java.math.BigDecimal;
import java.util.Optional;

public interface ITombanaFanateranaService {
    Optional<TombanaFanaterana> findById(Long id);
    TombanaFanaterana save(TombanaFanaterana model);
    void deleteById(Long id);
    Optional<TombanaFanaterana> findTombana(Long villeId, String method, BigDecimal weight);
}
