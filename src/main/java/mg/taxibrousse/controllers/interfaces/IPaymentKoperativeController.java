package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.PaymentKoperative;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments-koperative")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
public interface IPaymentKoperativeController {

    @GetMapping("/voyage/{voyageId}")
    ResponseEntity<PaymentKoperative> getPaymentKoperativeByVoyage(@PathVariable Long voyageId);
}
