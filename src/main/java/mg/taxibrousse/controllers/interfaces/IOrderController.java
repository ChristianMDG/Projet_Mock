package mg.taxibrousse.controllers.interfaces;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import mg.taxibrousse.dto.shop.BuyNowRequest;
import mg.taxibrousse.dto.shop.ConfirmPickupRequest;
import mg.taxibrousse.dto.shop.OrderPaymentRequest;
import mg.taxibrousse.dto.shop.OrderSearchParams;
import mg.taxibrousse.dto.shop.UpdateOrderStatusRequest;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public interface IOrderController {

    @PostMapping
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> createOrder(Authentication authentication, @RequestHeader(value = "X-Sender-Id", required = false) String senderId,
            @RequestHeader(value = "X-Cart-Session", required = false) String sessionToken, @Valid @RequestBody Order request);

    @PostMapping("/buy-now")
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> buyNow(Authentication authentication, @Valid @RequestBody BuyNowRequest request) throws java.io.IOException, InterruptedException;

    @GetMapping
    @PreAuthorize("permitAll()")
    ResponseEntity<Page<Order>> listOrders(@ModelAttribute OrderSearchParams params, @PageableDefault(size = 20) Pageable pageable);

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('ADMIN')")
    void exportOrders(@RequestParam(defaultValue = "csv") String format, @RequestParam(required = false) OrderStatusEnum status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo, HttpServletResponse response);

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> getOrder(@PathVariable Long id);

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest body, Authentication authentication);

    @PostMapping("/{id}/pickup")
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> confirmPickup(@PathVariable Long id, @Valid @RequestBody ConfirmPickupRequest body);

    @PostMapping("/{id}/payment/initiate")
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> initiatePayment(@PathVariable Long id, @Valid @RequestBody OrderPaymentRequest body) throws java.io.IOException, InterruptedException;

    @PostMapping("/{id}/payment/confirm")
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> confirmOrder(@PathVariable Long id);

    @PostMapping("/{id}/payment/fail")
    @PreAuthorize("permitAll()")
    ResponseEntity<Order> failOrder(@PathVariable Long id, @RequestParam(required = false) String reason);
}
