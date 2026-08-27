package mg.taxibrousse.controllers.interfaces;

import mg.taxibrousse.dto.shop.analytics.CustomerPatterns;
import mg.taxibrousse.dto.shop.analytics.RevenuePoint;
import mg.taxibrousse.dto.shop.analytics.TopProduct;
import mg.taxibrousse.entities.enums.OrderStatusEnum;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@PreAuthorize("hasAuthority('ADMIN')")
public interface IAnalyticsController {

    @GetMapping("/revenue")
    ResponseEntity<List<RevenuePoint>> getRevenue(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to, @RequestParam(defaultValue = "day") String granularity);

    @GetMapping("/top-products")
    ResponseEntity<List<TopProduct>> getTopProducts(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to, @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "quantity") String by);

    @GetMapping("/order-status-distribution")
    ResponseEntity<Map<OrderStatusEnum, Long>> getOrderStatusDistribution(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to);

    @GetMapping("/customer-patterns")
    ResponseEntity<CustomerPatterns> getCustomerPatterns(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to);
}
