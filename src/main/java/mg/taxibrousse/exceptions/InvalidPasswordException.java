package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class InvalidPasswordException extends RuntimeException {

    private final String resourceKey;

    public InvalidPasswordException() {
        super("Current password is incorrect");
        this.resourceKey = "error_invalid_current_password";
    }

    public InvalidPasswordException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public InvalidPasswordException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }
}
