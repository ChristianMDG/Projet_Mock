package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.VoyageurEntity;
import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;
import mg.taxibrousse.services.IReservationSmsService;
import mg.taxibrousse.services.ISmsService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservationSmsService implements IReservationSmsService {

    private final ISmsService smsService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private record MessageData(String bookingRef, String departure, String arrival, String date, String time, String seats){}

    @Override
    @Async
    public void sendConfirmationSms(ReservationEntity reservation) {
        try {
            VoyageurEntity voyageur = reservation.getVoyageur();
            if (voyageur == null || voyageur.getPhone() == null) {
                log.warn("Cannot send SMS: voyageur or phone is null for reservation {}", reservation.getId());
                return;
            }

            LanguagePreferenceEnum language = voyageur.getLanguagePreference();
            String message = buildConfirmationMessage(reservation, language);
            
            smsService.sendSms(voyageur.getPhone(), message);
            log.info("Confirmation SMS sent for reservation {} in language {}", reservation.getBookingReference(), language);
                    
        } catch (Exception e) {
            log.error("Failed to send confirmation SMS for reservation {}: {}", reservation.getId(), e.getMessage());
        }
    }

    private String buildConfirmationMessage(ReservationEntity reservation, LanguagePreferenceEnum language) {
        VoyageEntity voyage = reservation.getVoyage();
        
        var data = new MessageData(
            reservation.getBookingReference(),
            voyage.getDepartureGare().getName(),
            voyage.getArrivalGare().getName(),
            voyage.getDepartureTime().format(DATE_FORMATTER),
            voyage.getDepartureTime().format(TIME_FORMATTER),
            reservation.getSeats().stream()
                    .map(SeatEntity::getPosition)
                    .collect(Collectors.joining(", "))
        );

        // Default to Malagasy if no preference set
        if (language == null) {
            language = LanguagePreferenceEnum.MG;
        }

        return switch (language) {
            case FR -> buildFrenchMessage(data);
            case EN -> buildEnglishMessage(data);
            case MG -> buildMalagasyMessage(data);
        };
    }

    private String buildMalagasyMessage(MessageData data) {
        return String.format(
            "TAXIBROUSSE: Voamarina ny famandrihana %s. " +
            "Lalana: %s -> %s. " +
            "Daty: %s %s. " +
            "Toerana: %s. " +
            "Misaotra anao!",
            data.bookingRef(), data.departure(), data.arrival(), data.date(), data.time(), data.seats()
        );
    }

    private String buildFrenchMessage(MessageData data) {
        return String.format(
            "TAXIBROUSSE: Reservation %s confirmee. " +
            "Trajet: %s -> %s. " +
            "Date: %s a %s. " +
            "Places: %s. " +
            "Merci!",
            data.bookingRef(), data.departure(), data.arrival(), data.date(), data.time(), data.seats()
        );
    }

    private String buildEnglishMessage(MessageData data) {
        return String.format(
            "TAXIBROUSSE: Booking %s confirmed. " +
            "Route: %s -> %s. " +
            "Date: %s at %s. " +
            "Seats: %s. " +
            "Thank you!",
            data.bookingRef(), data.departure(), data.arrival(), data.date(), data.time(), data.seats()
        );
    }
}
