package mg.taxibrousse.utils;

public final class Labels {

    private Labels() {
    }

    // Payment status messages
    public static final String PAYMENT_COMPLETED_SUCCESSFULLY = "payment_completed_successfully";
    public static final String PAYMENT_PROCESSING_FAILED = "payment_processing_failed";
    public static final String PAYMENT_OTP_EXPIRED = "payment_otp_expired";
    public static final String PAYMENT_PHONE_NOTIFICATION = "payment_phone_notification";
    public static final String STATUS_CANCELLED = "status_cancelled";
    public static final String ENUM_PAYMENT_STATUS_PENDING = "enum_payment_status_pending";
    public static final String PROCESSING = "processing";

    // Payment status notification messages (descriptive)
    public static final String PAYMENT_STATUS_MSG_PENDING = "payment_status_msg_pending";
    public static final String PAYMENT_STATUS_MSG_PROCESSING = "payment_status_msg_processing";
    public static final String PAYMENT_STATUS_MSG_COMPLETED = "payment_status_msg_completed";
    public static final String PAYMENT_STATUS_MSG_FAILED = "payment_status_msg_failed";
    public static final String PAYMENT_STATUS_MSG_CANCELLED = "payment_status_msg_cancelled";
    public static final String PAYMENT_STATUS_MSG_TIMEOUT = "payment_status_msg_timeout";
    public static final String PAYMENT_STATUS_MSG_PENDING_OTP = "payment_status_msg_pending_otp";
}
