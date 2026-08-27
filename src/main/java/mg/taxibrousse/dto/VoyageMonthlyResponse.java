package mg.taxibrousse.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record VoyageMonthlyResponse(List<DayResult> days, LocalDate monthStart, LocalDate monthEnd) {

    public record DayResult(LocalDate date, boolean hasVoyages, BigDecimal minPrice, BigDecimal maxPrice, int totalVoyages, int totalAvailableSeats) {
    }
}
