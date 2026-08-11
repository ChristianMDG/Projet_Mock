package mg.taxibrousse.exceptions;

import lombok.Getter;

@Getter
public class PhoneAlreadyExistsException extends RuntimeException {

    private final String resourceKey;

    public PhoneAlreadyExistsException() {
        super("Phone number already registered");
        this.resourceKey = "error_phone_already_taken";
    }

    public PhoneAlreadyExistsException(String resourceKey) {
        super(resourceKey);
        this.resourceKey = resourceKey;
    }

    public PhoneAlreadyExistsException(String resourceKey, String message) {
        super(message);
        this.resourceKey = resourceKey;
    }

}
