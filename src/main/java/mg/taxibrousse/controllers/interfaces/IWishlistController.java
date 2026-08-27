package mg.taxibrousse.controllers.interfaces;

import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.AddWishlistItemRequest;
import mg.taxibrousse.models.Wishlist;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("isAuthenticated()")
public interface IWishlistController {

    @GetMapping
    ResponseEntity<Wishlist> getWishlist(Authentication authentication);

    @PostMapping("/items")
    ResponseEntity<Wishlist> addItem(Authentication authentication, @Valid @RequestBody AddWishlistItemRequest request);

    @DeleteMapping("/items/{itemId}")
    ResponseEntity<Wishlist> removeItem(Authentication authentication, @PathVariable Long itemId);
}
