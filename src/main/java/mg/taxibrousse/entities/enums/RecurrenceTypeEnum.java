package mg.taxibrousse.entities.enums;

public enum RecurrenceTypeEnum {
    ONE_OFF, // Single occurrence
    DAILY, // Daily at specified time
    WEEKLY, // Weekly on selected weekdays
    MONTHLY, // Monthly on specific date(s)
    CUSTOM // Custom interval (every N days)
}
