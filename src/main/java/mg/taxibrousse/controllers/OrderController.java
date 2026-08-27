package mg.taxibrousse.controllers;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.controllers.interfaces.IOrderController;
import mg.taxibrousse.dto.shop.BuyNowRequest;
import mg.taxibrousse.dto.shop.OrderPaymentRequest;
import mg.taxibrousse.dto.shop.OrderSearchParams;
import mg.taxibrousse.dto.shop.UpdateOrderStatusRequest;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import mg.taxibrousse.models.Order;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@Slf4j
@RequiredArgsConstructor
public class OrderController implements IOrderController {

    private static final DateTimeFormatter FILENAME_TIMESTAMP = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private final IOrderService orderService;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<Order> createOrder(Authentication authentication, String senderId, String sessionToken, Order request) {
        Long userId = resolveUserId(authentication);
        String guestKey = StringUtils.hasText(senderId) ? senderId : sessionToken;
        return ResponseEntity.ok(orderService.createFromCart(userId, guestKey, request, request.getPromotionCode()));
    }

    @Override
    public ResponseEntity<Order> buyNow(Authentication authentication, @Valid @RequestBody BuyNowRequest request) throws IOException, InterruptedException {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(orderService.buyNow(userId, request));
    }

    @Override
    public ResponseEntity<Page<Order>> listOrders(OrderSearchParams params, Pageable pageable) {
        return ResponseEntity.ok(orderService.search(params, pageable));
    }

    @Override
    public void exportOrders(String format, OrderStatusEnum status, LocalDateTime dateFrom, LocalDateTime dateTo, HttpServletResponse response) {
        String fmt = format != null ? format.toLowerCase() : "csv";
        boolean isCsv = "csv".equals(fmt);
        if (isCsv) {
            writeCsvOrders(status, dateFrom, dateTo, response);
            return;
        }
        writeUnsupportedFormatResponse(response);
    }

    private void writeUnsupportedFormatResponse(HttpServletResponse response) {
        response.setStatus(HttpStatus.NOT_IMPLEMENTED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        try {
            response.getWriter().write("{\"error\":\"error_export_format_unsupported\"," + "\"message\":\"Only CSV export is currently supported.\"}");
        } catch (IOException e) {
            log.error("Failed to write unsupported-format response", e);
        }
    }

    private void writeCsvOrders(OrderStatusEnum status, LocalDateTime dateFrom, LocalDateTime dateTo, HttpServletResponse response) {
        OrderSearchParams params = new OrderSearchParams();
        params.setStatus(status);
        params.setDateFrom(dateFrom);
        params.setDateTo(dateTo);

        String filename = "orders-" + LocalDateTime.now().format(FILENAME_TIMESTAMP) + ".csv";
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("text/csv; charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");
        try (PrintWriter writer = response.getWriter()) {
            orderService.exportCsv(params, writer);
        } catch (IOException e) {
            log.error("Failed to stream CSV export", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<Order> getOrder(Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @Override
    public ResponseEntity<Order> updateOrderStatus(Long id, UpdateOrderStatusRequest body, Authentication authentication) {
        Long adminUserId = resolveUserId(authentication);
        return ResponseEntity.ok(orderService.updateStatus(id, body.status(), body.reason(), adminUserId));
    }

    @Override
    public ResponseEntity<Order> initiatePayment(Long id, OrderPaymentRequest body) throws IOException, InterruptedException {
        return ResponseEntity.ok(orderService.initiatePayment(id, body));
    }

    @Override
    public ResponseEntity<Order> confirmOrder(Long id) {
        return ResponseEntity.ok(orderService.confirm(id));
    }

    @Override
    public ResponseEntity<Order> failOrder(Long id, String reason) {
        return ResponseEntity.ok(orderService.failPayment(id, reason));
    }

    private Long resolveUserId(Authentication authentication) {
        boolean hasAuth = authentication != null && authentication.isAuthenticated() && authentication.getName() != null;
        if (hasAuth) {
            return userInfoRepository.findByUsername(authentication.getName()).map(u -> u.getId()).orElse(null);
        }
        return null;
    }
}
