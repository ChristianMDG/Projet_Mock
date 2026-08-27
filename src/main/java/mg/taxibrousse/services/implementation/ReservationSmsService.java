package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.taxibrousse.entities.ReservationEntity;
import mg.taxibrousse.entities.SeatEntity;
import mg.taxibrousse.entities.VoyageEntity;
import mg.taxibrousse.entities.PaymentTransactionEntity;
import mg.taxibrousse.entities.enums.LanguagePreferenceEnum;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.services.IReservationSmsService;
import mg.taxibrousse.services.ISmsService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReservationSmsService implements IReservationSmsService {

    private final ISmsService smsService;
    private final IPaymentTransactionRepository paymentTransactionRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private record MessageData(String bookingRef, String departure, String arrival, String date, String time, String seats) {
    }

    @Override
    @Async
    public void sendConfirmationSms(ReservationEntity reservation) {
        try {
            String targetPhone = getTargetPhone(reservation);
            if (StringUtils.hasText(targetPhone)) {
                LanguagePreferenceEnum language = reservation.getVoyageur() != null && reservation.getVoyageur().getLanguagePreference() != null
                        ? reservation.getVoyageur().getLanguagePreference()
                        : LanguagePreferenceEnum.MG;

                String message = buildConfirmationMessage(reservation, language);
                smsService.sendSms(targetPhone, message);
                log.info("Confirmation SMS sent to {} for reservation {} in language {}", targetPhone, reservation.getBookingReference(), language);
            } else {
                log.warn("Cannot send SMS: no phone number found for reservation {}", reservation.getId());
            }
        } catch (Exception e) {
            log.error("Failed to send confirmation SMS for reservation {}: {}", reservation.getId(), e.getMessage());
        }
    }

    private String getTargetPhone(ReservationEntity reservation) {
        String transactionPhone = paymentTransactionRepository.findByReservationIdOrderByInitiatedAtDesc(reservation.getId())
                .stream()
                .map(PaymentTransactionEntity::getPhoneNumber)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);

        if (StringUtils.hasText(transactionPhone)) {
            return transactionPhone;
        }

        if (reservation.getVoyageur() != null && StringUtils.hasText(reservation.getVoyageur().getPhone())) {
            return reservation.getVoyageur().getPhone();
        }

        return null;
    }

    private String buildConfirmationMessage(ReservationEntity reservation, LanguagePreferenceEnum language) {
        VoyageEntity voyage = reservation.getVoyage();

        var data = new MessageData(reservation.getBookingReference(), voyage.getDepartureGare().getName(), voyage.getArrivalGare().getVille().getName(), voyage.getDepartureTime()
                .format(DATE_FORMATTER), voyage.getDepartureTime().format(TIME_FORMATTER), reservation.getSeats().stream().map(SeatEntity::getPosition).collect(Collectors.joining(", ")));

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

    private static final int SMS_MAX_LENGTH = 160;

    private String buildMalagasyMessage(MessageData data) {
        // Template fixed chars: "Voamarina %s. %s => %s. %s %s. Toerana %s. Misaotra!" = ~56 fixed
        String msg = String.format("Resa %s OK.\n%s => %s.\n%s %s.\nToerana : %s.\nMisaotra!", data.bookingRef(), data.departure(), data.arrival(), data.date(), data.time(), data.seats());
        return truncate(msg);
    }

    private String buildFrenchMessage(MessageData data) {
        // Template fixed chars: "Resa %s ok. %s->%s. %s %s. Pl: %s. Merci!" = ~46 fixed
        String msg = String.format("Resa %s ok.\n%s => %s.\n%s %s.\nPl: %s.\nMerci!", data.bookingRef(), data.departure(), data.arrival(), data.date(), data.time(), data.seats());
        return truncate(msg);
    }

    private String buildEnglishMessage(MessageData data) {
        // Template fixed chars: "Booking %s ok. %s => %s. %s %s. Seats: %s. Thanks!" = ~52 fixed
        String msg = String.format("Booking %s ok.\n%s => %s.\n%s %s.\nSeats: %s.\nThanks!", data.bookingRef(), data.departure(), data.arrival(), data.date(), data.time(), data.seats());
        return truncate(msg);
    }

    private String truncate(String msg) {
        if (msg.length() <= SMS_MAX_LENGTH) {
            return msg;
        }
        log.warn("SMS message truncated from {} to {} chars", msg.length(), SMS_MAX_LENGTH);
        return msg.substring(0, SMS_MAX_LENGTH - 3) + "...";
    }
}
