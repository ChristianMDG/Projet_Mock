package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.PaymentRequest;
import mg.taxibrousse.dto.airtel.AirtelCallbackRequest;
import mg.taxibrousse.dto.mvola.MVolaCallbackRequest;
import mg.taxibrousse.dto.orangemoney.OrangeMoneyCallbackRequest;
import mg.taxibrousse.models.PaymentTransaction;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface IPaymentController {

    // MVola endpoints
    @PostMapping("/mvola/initiate")
    ResponseEntity<PaymentTransaction> initiateMVolaPayment(@Valid @RequestBody PaymentRequest paymentRequest) throws IOException, InterruptedException;

    @PutMapping("/mvola/callback")
    ResponseEntity<Void> handleMVolaCallback(@Valid @RequestBody MVolaCallbackRequest callbackRequest);

    @GetMapping("/mvola/status/{transactionReference}")
    ResponseEntity<PaymentTransaction> getMVolaPaymentStatus(@PathVariable String transactionReference);

    @PostMapping("/mvola/check/{transactionReference}")
    ResponseEntity<PaymentTransaction> checkAndUpdateMVolaPaymentStatus(@PathVariable String transactionReference);

    // Orange Money endpoints
    @PostMapping("/orangemoney/initiate")
    ResponseEntity<PaymentTransaction> initiateOrangeMoneyPayment(@Valid @RequestBody PaymentRequest paymentRequest) throws IOException, InterruptedException;

    @PostMapping("/orangemoney/callback")
    ResponseEntity<Void> handleOrangeMoneyCallback(
            @Valid @RequestBody OrangeMoneyCallbackRequest callbackRequest,
            @RequestParam(value = "order_id", required = false) String orderIdParam
    );

    @GetMapping("/orangemoney/status/{transactionReference}")
    ResponseEntity<PaymentTransaction> getOrangeMoneyPaymentStatus(@PathVariable String transactionReference);

    @PostMapping("/orangemoney/check/{transactionReference}")
    ResponseEntity<PaymentTransaction> checkAndUpdateOrangeMoneyPaymentStatus(@PathVariable String transactionReference);

    // Airtel Money endpoints
    @PostMapping("/airtelmoney/initiate")
    ResponseEntity<PaymentTransaction> initiateAirtelMoneyPayment(@Valid @RequestBody PaymentRequest paymentRequest) throws IOException, InterruptedException;

    @PostMapping("/airtelmoney/callback")
    ResponseEntity<Void> handleAirtelMoneyCallback(@Valid @RequestBody AirtelCallbackRequest callbackRequest);

    @GetMapping("/airtelmoney/status/{transactionReference}")
    ResponseEntity<PaymentTransaction> getAirtelMoneyPaymentStatus(@PathVariable String transactionReference);

    @PostMapping("/airtelmoney/check/{transactionReference}")
    ResponseEntity<PaymentTransaction> checkAndUpdateAirtelMoneyPaymentStatus(@PathVariable String transactionReference);
}
