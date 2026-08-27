package mg.taxibrousse.repositories;

import mg.taxibrousse.entities.FacturationEntity;
import mg.taxibrousse.entities.VoyageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IFacturationRepository extends JpaRepository<FacturationEntity, Long> {

    Optional<FacturationEntity> findByReservationId(Long reservationId);

    Optional<FacturationEntity> findByInvoiceNumber(String invoiceNumber);

    @Query("""
                SELECT DISTINCT v FROM Voyage v
                LEFT JOIN FETCH v.koperative k
                LEFT JOIN FETCH v.departureGare dg
                LEFT JOIN FETCH v.arrivalGare ag
                LEFT JOIN FETCH v.classe c
                LEFT JOIN FETCH v.crafter cr
                LEFT JOIN FETCH v.chauffeur ch
                WHERE (CAST(:departureDate AS date) IS NULL OR CAST(v.departureTime AS date) = CAST(:departureDate AS date))
                AND (:koperativeId IS NULL OR k.id = :koperativeId)
                ORDER BY v.departureTime
            """)
    List<VoyageEntity> findVoyagesWithFacturationStatus(@Param("departureDate") LocalDate departureDate, @Param("koperativeId") Long koperativeId);
}
