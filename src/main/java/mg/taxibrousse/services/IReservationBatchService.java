package mg.taxibrousse.services;

public interface IReservationBatchService {

    void pauseBatch();

    void playBatch();

    boolean isBatchEnabled();

    void runDailyBatch();

    void executeBatch();
}
