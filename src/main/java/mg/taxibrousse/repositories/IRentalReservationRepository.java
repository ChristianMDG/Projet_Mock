package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.RentalReservationEntity;
import mg.taxibrousse.entities.enums.RentalReservationStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface IRentalReservationRepository extends JpaRepository<RentalReservationEntity, Long> {

    List<RentalReservationEntity> findByUserId(Long userId);

    boolean existsByBookingReference(String bookingReference);

    @Query("SELECT COUNT(r) > 0 FROM RentalReservationEntity r WHERE r.vehicle.id = :vehicleId " + "AND r.status IN :statuses AND r.startDate < :endDate AND r.endDate > :startDate")
    boolean existsOverlapping(@Param("vehicleId") Long vehicleId, @Param("statuses") Collection<RentalReservationStatusEnum> statuses, @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
