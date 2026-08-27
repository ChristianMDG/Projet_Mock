package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.models.TarifMobileMoney;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/tarif-mobile-money")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface ITarifMobileMoneyController {

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<TarifMobileMoney> getTarifMobileMoneyById(@PathVariable Long id);

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<TarifMobileMoney> createTarifMobileMoney(@RequestBody TarifMobileMoney tarifMobileMoney);

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<TarifMobileMoney> updateTarifMobileMoney(@PathVariable Long id, @RequestBody TarifMobileMoney tarifMobileMoney);

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Void> deleteTarifMobileMoney(@PathVariable Long id);

    @GetMapping("/calculate")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATOR')")
    ResponseEntity<TarifMobileMoney> calculateFee(@RequestParam String operatorName, @RequestParam BigDecimal amount);
}
