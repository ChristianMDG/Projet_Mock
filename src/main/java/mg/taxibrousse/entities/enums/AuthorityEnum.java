package mg.taxibrousse.entities.enums;

public enum AuthorityEnum {

    USER, ADMIN, GUICHET, KOPERATIVE, CHAUFFEUR;

    public String getName() {
        return name();
    }
}
