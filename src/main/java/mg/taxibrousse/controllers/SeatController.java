package mg.taxibrousse.controllers;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.entities.enums.SeatStatusEnum;
import mg.taxibrousse.models.Seat;
import mg.taxibrousse.services.ISeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final ISeatService seatService;

    @GetMapping("/voyage/{voyageId}")
    public List<Seat> getSeatsByVoyage(@PathVariable Long voyageId) {
        return seatService.findByVoyageId(voyageId);
    }

    @GetMapping("/crafter/{crafterId}")
    public List<Seat> getSeatsByCrafter(@PathVariable Long crafterId) {
        return seatService.findByCrafterId(crafterId);
    }

    @GetMapping("/voyage/{voyageId}/seat/{seatNumber}")
    public ResponseEntity<Seat> getSeat(@PathVariable Long voyageId, @PathVariable Integer seatNumber) {
        Seat seat = seatService.findByVoyageIdAndSeatNumber(voyageId, seatNumber);
        if (seat != null) {
            return ResponseEntity.ok(seat);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/voyage/{voyageId}/available")
    public List<Seat> getAvailableSeats(@PathVariable Long voyageId) {
        return seatService.findByVoyageIdAndStatus(voyageId, SeatStatusEnum.AVAILABLE);
    }

    @GetMapping("/voyage/{voyageId}/reserved")
    public List<Seat> getReservedSeats(@PathVariable Long voyageId) {
        return seatService.findByVoyageIdAndStatus(voyageId, SeatStatusEnum.RESERVED);
    }

    @GetMapping("/voyage/{voyageId}/reservation/{reservationId}")
    public List<Seat> getSeatsByVoyageAndReservation(
        @PathVariable Long voyageId,
        @PathVariable Long reservationId
    ) {
        return seatService.findByVoyageIdAndReservationId(voyageId, reservationId);
    }

    @GetMapping("/reservation/{reservationId}")
    public List<Seat> getSeatsByReservation(@PathVariable Long reservationId) {
        return seatService.findByReservationId(reservationId);
    }

    @GetMapping("/voyage/{voyageId}/count-available")
    public ResponseEntity<Long> getAvailableSeatsCount(@PathVariable Long voyageId) {
        Long count = seatService.getAvailableSeatsCount(voyageId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/voyage/{voyageId}/initialize")
    public ResponseEntity<List<Seat>> initializeSeats(@PathVariable Long voyageId, @RequestParam Long crafterId) {
        List<Seat> seats = seatService.initializeSeatsForVoyage(voyageId, crafterId);
        return ResponseEntity.ok(seats);
    }

    @PostMapping
    public ResponseEntity<Seat> createSeat(@RequestBody Seat seat) {
        Seat saved = seatService.save(seat);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Seat> updateSeatStatus(@PathVariable Long id, @RequestParam SeatStatusEnum status) {
        Seat updated = seatService.updateSeatStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/voyage/{voyageId}/seat/{seatNumber}/reserve")
    public ResponseEntity<Seat> reserveSeat(@PathVariable Long voyageId, @PathVariable Integer seatNumber) {
        Seat reserved = seatService.reserveSeat(voyageId, seatNumber);
        if (reserved != null) {
            return ResponseEntity.ok(reserved);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/voyage/{voyageId}/seat/{seatNumber}/release")
    public ResponseEntity<Seat> releaseSeat(@PathVariable Long voyageId, @PathVariable Integer seatNumber) {
        Seat released = seatService.releaseSeat(voyageId, seatNumber);
        if (released != null) {
            return ResponseEntity.ok(released);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/voyage/{voyageId}/seat/{seatNumber}/available")
    public ResponseEntity<Boolean> isSeatAvailable(@PathVariable Long voyageId, @PathVariable Integer seatNumber) {
        boolean available = seatService.isSeatAvailable(voyageId, seatNumber);
        return ResponseEntity.ok(available);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeat(@PathVariable Long id) {
        Seat seat = seatService.findById(id);
        if (seat != null) {
            return ResponseEntity.ok(seat);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/voyage/{voyageId}/bulk-status")
    public ResponseEntity<List<Seat>> updateMultipleSeatsStatus(
        @PathVariable Long voyageId,
        @RequestParam List<Integer> seatNumbers,
        @RequestParam SeatStatusEnum status
    ) {
        List<Seat> updatedSeats = seatService.updateMultipleSeatsStatus(voyageId, seatNumbers, status);
        return ResponseEntity.ok(updatedSeats);
    }

    @PostMapping("/voyage/{voyageId}/reset")
    public ResponseEntity<List<Seat>> resetVoyageSeats(@PathVariable Long voyageId) {
        List<Seat> resetSeats = seatService.resetVoyageSeats(voyageId);
        return ResponseEntity.ok(resetSeats);
    }

    @PutMapping("/voyage/{voyageId}/reservation/{reservationId}/release")
    public ResponseEntity<List<Seat>> releaseSeatsByReservation(
        @PathVariable Long voyageId, 
        @PathVariable Long reservationId
    ) {
        List<Seat> releasedSeats = seatService.releaseSeatsByReservation(voyageId, reservationId);
        return ResponseEntity.ok(releasedSeats);
    }
}
