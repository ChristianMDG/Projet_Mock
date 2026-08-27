package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.models.Cart;
import mg.taxibrousse.models.CartItem;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Cart endpoints.
 *
 * <p>
 * Headers:
 * <ul>
 * <li>{@code X-Sender-Id} (preferred): stable per-browser id used as the guest cart key in Redis</li>
 * <li>{@code X-Cart-Session} (legacy): fallback session token; only used if {@code X-Sender-Id} is absent</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public interface ICartController {

    @GetMapping
    ResponseEntity<Cart> getCart(Authentication authentication, @RequestHeader(value = "X-Sender-Id", required = false) String senderId,
            @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken);

    @PostMapping("/items")
    ResponseEntity<Cart> addItem(Authentication authentication, @RequestHeader(value = "X-Sender-Id", required = false) String senderId,
            @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken, @Valid @RequestBody CartItem request);

    @PutMapping("/items/{id}")
    ResponseEntity<Cart> updateItem(Authentication authentication, @RequestHeader(value = "X-Sender-Id", required = false) String senderId,
            @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken, @PathVariable Long id, @Valid @RequestBody CartItem request);

    @DeleteMapping("/items/{id}")
    ResponseEntity<Cart> removeItem(Authentication authentication, @RequestHeader(value = "X-Sender-Id", required = false) String senderId,
            @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken, @PathVariable Long id);

    @PostMapping("/merge")
    ResponseEntity<Cart> mergeCart(Authentication authentication, @RequestHeader(value = "X-Sender-Id", required = false) String senderId,
            @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken);
}
