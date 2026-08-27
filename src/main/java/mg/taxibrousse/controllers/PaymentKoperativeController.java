package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IPaymentKoperativeController;
import mg.taxibrousse.models.PaymentKoperative;
import mg.taxibrousse.services.IPaymentKoperativeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PaymentKoperativeController implements IPaymentKoperativeController {

    private final IPaymentKoperativeService paymentKoperativeService;

    @Override
    public ResponseEntity<PaymentKoperative> getPaymentKoperativeByVoyage(@PathVariable Long voyageId) {
        return ResponseEntity.ok(paymentKoperativeService.getOrCreatePaymentKoperative(voyageId));
    }
}
