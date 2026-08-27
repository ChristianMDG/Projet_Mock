package mg.taxibrousse.entities.enums;

public enum MobileMoneyEnum {

    MVOLA, ORANGE, AIRTEL;

    public static MobileMoneyEnum fromName(String name) {
        if (name == null) {
            throw new IllegalArgumentException("Operator name cannot be null");
        }
        String trimmed = name.trim();
        for (MobileMoneyEnum operator : values()) {
            if (operator.name().equalsIgnoreCase(trimmed)) {
                return operator;
            }
        }
        throw new IllegalArgumentException("Unknown operator: " + name);
    }
}
