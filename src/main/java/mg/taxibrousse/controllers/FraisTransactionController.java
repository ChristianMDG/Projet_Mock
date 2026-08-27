package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IFraisTransactionController;
import mg.taxibrousse.models.FraisTransaction;
import mg.taxibrousse.services.IFraisTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class FraisTransactionController implements IFraisTransactionController {

    private final IFraisTransactionService service;

    @Override
    public ResponseEntity<FraisTransaction> findByOperatorName(String operatorName) {
        Optional<FraisTransaction> model = service.findByOperatorName(operatorName);
        if (model.isPresent()) {
            return ResponseEntity.ok(model.get());
        }
        return ResponseEntity.notFound().build();
    }
}
