package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.FraisTransaction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/frais-transaction")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IFraisTransactionController {

    @GetMapping("/operator")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<FraisTransaction> findByOperatorName(@RequestParam String operatorName);
}
