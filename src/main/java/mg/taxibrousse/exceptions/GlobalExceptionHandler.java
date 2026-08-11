package mg.taxibrousse.exceptions;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import mg.taxibrousse.dto.ErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        return buildErrorResponse("error_invalid_credentials", "Invalid phone number or password", HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex, HttpServletRequest request) {
        return buildErrorResponse("error_invalid_credentials", ex.getMessage(), HttpStatus.UNAUTHORIZED, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return buildErrorResponse("error_access_denied", "Access denied", HttpStatus.FORBIDDEN, request);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailExists(EmailAlreadyExistsException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getResourceKey(), ex.getMessage(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
        if (msg.contains("email")) {
            return buildErrorResponse("error_email_already_taken", "Email already exists", HttpStatus.CONFLICT, request);
        }
        if (msg.contains("phone") || msg.contains("username")) {
            return buildErrorResponse("error_phone_already_taken", "Phone already taken", HttpStatus.CONFLICT, request);
        }
        return buildErrorResponse("error_conflict", "Data integrity violation", HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(InvalidPaymentException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPayment(InvalidPaymentException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getResourceKey(), ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(InvalidSeatException.class)
    public ResponseEntity<ErrorResponse> handleInvalidSeat(InvalidSeatException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getResourceKey(), ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleReservationNotFound(ReservationNotFoundException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getResourceKey(), ex.getMessage(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(PhoneAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handlePhoneExists(PhoneAlreadyExistsException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getResourceKey(), ex.getMessage(), HttpStatus.CONFLICT, request);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPassword(InvalidPasswordException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getResourceKey(), ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ErrorResponse> handlePaymentException(PaymentException ex, HttpServletRequest request) {
        return buildErrorResponse(ex.getErrorCode(), ex.getMessage(), HttpStatus.UNPROCESSABLE_ENTITY, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return buildErrorResponse("error_validation_failed", message, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        return buildErrorResponse("error_bad_request", ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        return buildErrorResponse("error_not_found", ex.getMessage(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest request) {
        ex.printStackTrace(); // Log stack trace for debugging
        return buildErrorResponse("error_server_error", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(String error, String message, HttpStatus status, HttpServletRequest request) {
        ErrorResponse response = ErrorResponse.builder()
                .error(error)
                .message(message)
                .status(status.value())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(response);
    }
}
