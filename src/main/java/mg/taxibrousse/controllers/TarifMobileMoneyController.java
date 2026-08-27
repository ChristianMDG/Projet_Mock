package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.ITarifMobileMoneyController;
import mg.taxibrousse.models.TarifMobileMoney;
import mg.taxibrousse.services.ITarifMobileMoneyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class TarifMobileMoneyController implements ITarifMobileMoneyController {

    private final ITarifMobileMoneyService service;

    @Override
    public ResponseEntity<TarifMobileMoney> getTarifMobileMoneyById(Long id) {
        Optional<TarifMobileMoney> tariff = service.findById(id);
        if (tariff.isPresent()) {
            return ResponseEntity.ok(tariff.get());
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<TarifMobileMoney> createTarifMobileMoney(TarifMobileMoney tarifMobileMoney) {
        return ResponseEntity.ok(service.save(tarifMobileMoney));
    }

    @Override
    public ResponseEntity<TarifMobileMoney> updateTarifMobileMoney(Long id, TarifMobileMoney tarifMobileMoney) {
        if (tarifMobileMoney == null) {
            return ResponseEntity.badRequest().build();
        }
        tarifMobileMoney.setId(id);
        return ResponseEntity.ok(service.save(tarifMobileMoney));
    }

    @Override
    public ResponseEntity<Void> deleteTarifMobileMoney(Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<TarifMobileMoney> calculateFee(String operatorName, BigDecimal amount) {
        Optional<TarifMobileMoney> tariff = service.findTarifMobileMoney(operatorName, amount);
        if (tariff.isPresent()) {
            return ResponseEntity.ok(tariff.get());
        }
        TarifMobileMoney empty = new TarifMobileMoney();
        empty.setFraisRetrait(BigDecimal.ZERO);
        empty.setFraisTransfert(BigDecimal.ZERO);
        return ResponseEntity.ok(empty);
    }
}
