package mg.taxibrousse.dto.rental;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RentalReservationCreateRequest {

    @NotNull(message = "{rental_vehicle_id_required}")
    private Long vehicleId;

    @NotNull(message = "{rental_start_date_required}")
    private LocalDate startDate;

    @NotNull(message = "{rental_end_date_required}")
    private LocalDate endDate;

    @NotBlank(message = "{rental_driver_name_required}")
    @Size(max = 150, message = "{rental_driver_name_too_long}")
    private String driverName;

    @NotBlank(message = "{rental_driver_phone_required}")
    @Pattern(regexp = "^0[3-9]\\d{8}$", message = "{rental_driver_phone_invalid_format}")
    private String driverPhone;

    @NotBlank(message = "{rental_driver_email_required}")
    @Email(message = "{rental_driver_email_invalid_format}")
    private String driverEmail;
}
