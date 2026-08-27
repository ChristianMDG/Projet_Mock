package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.controllers.interfaces.IRentalReservationController;
import mg.taxibrousse.dto.rental.RentalPaymentInitiateRequest;
import mg.taxibrousse.dto.rental.RentalReservationCreateRequest;
import mg.taxibrousse.dto.shop.PaymentInitiationResponse;
import mg.taxibrousse.entities.RentalReservationEntity;
import mg.taxibrousse.repositories.IUserInfoRepository;
import mg.taxibrousse.services.IRentalReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RentalReservationController implements IRentalReservationController {

    private final IRentalReservationService reservationService;
    private final IUserInfoRepository userInfoRepository;

    @Override
    public ResponseEntity<RentalReservationEntity> createReservation(Authentication authentication, RentalReservationCreateRequest request) {
        Long callerId = resolveUserId(authentication);
        return ResponseEntity.ok(reservationService.createReservation(request, callerId));
    }

    @Override
    public ResponseEntity<RentalReservationEntity> getById(Long id) {
        return ResponseEntity.ok(reservationService.findByIdOrThrow(id));
    }

    @Override
    public ResponseEntity<List<RentalReservationEntity>> getByUser(Long userId, Authentication authentication) {
        Long callerId = resolveUserId(authentication);
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream().anyMatch(a -> "ADMIN".equals(a.getAuthority()));
        boolean isOwner = callerId != null && callerId.equals(userId);
        if (isOwner || isAdmin) {
            return ResponseEntity.ok(reservationService.findByUserId(userId));
        }
        throw new AccessDeniedException("error_access_denied");
    }

    @Override
    public ResponseEntity<PaymentInitiationResponse> initiatePayment(Long id, RentalPaymentInitiateRequest request) throws IOException, InterruptedException {
        return ResponseEntity.ok(reservationService.initiatePayment(id, request));
    }

    @Override
    public ResponseEntity<RentalReservationEntity> confirmPayment(Long id) {
        return ResponseEntity.ok(reservationService.confirm(id));
    }

    @Override
    public ResponseEntity<RentalReservationEntity> failPayment(Long id, String reason) {
        return ResponseEntity.ok(reservationService.failPayment(id, reason));
    }

    private Long resolveUserId(Authentication authentication) {
        boolean hasAuth = authentication != null && authentication.isAuthenticated() && authentication.getName() != null;
        if (hasAuth) {
            return userInfoRepository.findByUsername(authentication.getName()).map(u -> u.getId()).orElse(null);
        }
        return null;
    }
}
