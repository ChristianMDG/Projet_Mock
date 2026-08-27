package mg.taxibrousse.services.implementation;

import lombok.RequiredArgsConstructor;
import mg.taxibrousse.dto.accounting.*;
import mg.taxibrousse.entities.enums.PaymentTransactionStatusEnum;
import mg.taxibrousse.repositories.IPaymentTransactionRepository;
import mg.taxibrousse.models.PaymentTransaction;
import org.springframework.cache.annotation.Cacheable;
import mg.taxibrousse.services.IFinanceService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FinanceService implements IFinanceService {

    private final IPaymentTransactionRepository paymentTransactionRepository;

    @Cacheable(value = "finance_transactions", key = "{#request.from, #request.to, #request.koperativeId}")
    public List<PaymentTransaction> fetchTransactions(FinanceStatsRequest request) {
        LocalDateTime fromTime = request.getFrom().atStartOfDay();
        LocalDateTime toTime = request.getTo().atTime(LocalTime.MAX);

        return paymentTransactionRepository.findTransactionsForStats(fromTime, toTime, request.getKoperativeId())
                .stream().map(PaymentTransaction::fromEntity)
                .toList();
    }

    private FinanceSummaryStats computeAggregatedStats(List<PaymentTransaction> allTransactions) {
        long totalTransactions = allTransactions.size();
        long successfulTransactions = 0;

        double totalAmountCollected = 0.0;
        double totalFraisTotal = 0.0;
        double totalFraisTransaction = 0.0;
        double totalFraisRetrait = 0.0;
        double totalFraisTransfert = 0.0;
        double totalCommissionSeats = 0.0;
        double totalCommissionFee = 0.0;
        double commissionNette = 0.0;
        long totalPassagers = 0;

        for (PaymentTransaction tx : allTransactions) {
            if (tx.getStatus() == PaymentTransactionStatusEnum.COMPLETED) {
                successfulTransactions++;

                totalAmountCollected += Optional.ofNullable(tx.getAmount()).map(BigDecimal::doubleValue).orElse(0.0);
                totalFraisTotal += tx.getFraisTotal().doubleValue();
                totalFraisTransaction += tx.getFraisTransaction().doubleValue();
                totalFraisRetrait += tx.getFraisRetrait().doubleValue();
                totalFraisTransfert += tx.getFraisTransfert().doubleValue();
                totalCommissionSeats += tx.getCommissionSeats().doubleValue();
                totalCommissionFee += tx.getCommissionFee().doubleValue();
                
                var facturation = tx.getFacturation();
                if (facturation != null) {
                    commissionNette += Optional.ofNullable(facturation.getCommission()).map(BigDecimal::doubleValue).orElse(0.0);
                    if (facturation.getReservation() != null && facturation.getReservation().getSeats() != null) {
                        totalPassagers += facturation.getReservation().getSeats().size();
                    }
                }
            }
        }

        double successRate = totalTransactions > 0 
                ? (successfulTransactions * 100.0) / totalTransactions 
                : 0.0;

        double totalCosts = totalFraisTransaction + totalFraisRetrait + totalFraisTransfert;

        return FinanceSummaryStats.builder()
                .totalAmountCollected(totalAmountCollected)
                .totalFraisTotal(totalFraisTotal)
                .totalFraisTransaction(totalFraisTransaction)
                .totalFraisKoperative(totalCommissionSeats + totalCommissionFee)
                .totalFraisRetrait(totalFraisRetrait)
                .totalFraisTransfert(totalFraisTransfert)
                .totalCommissionSeats(totalCommissionSeats)
                .totalCommissionFee(totalCommissionFee)
                .totalCosts(totalCosts)
                .commissionNette(commissionNette)
                .commissionIsPositive(commissionNette >= 0)
                .totalTransactions(totalTransactions)
                .successfulTransactions(successfulTransactions)
                .successRate(Math.round(successRate * 100.0) / 100.0)
                .totalPassagers(totalPassagers)
                .build();
    }

    @Override
    public FinanceKpiStats getFinanceKpi(FinanceStatsRequest request) {
        FinanceSummaryStats stats = computeAggregatedStats(fetchTransactions(request));
        return FinanceKpiStats.builder()
                .commissionNette(stats.getCommissionNette())
                .commissionIsPositive(stats.getCommissionIsPositive())
                .totalAmountCollected(stats.getTotalAmountCollected())
                .totalTransactions(stats.getTotalTransactions())
                .successfulTransactions(stats.getSuccessfulTransactions())
                .successRate(stats.getSuccessRate())
                .totalPassagers(stats.getTotalPassagers())
                .build();
    }

    @Override
    public CommissionBreakdownStats getCommissionBreakdown(FinanceStatsRequest request) {
        FinanceSummaryStats stats = computeAggregatedStats(fetchTransactions(request));
        return CommissionBreakdownStats.builder()
                .totalFraisTotal(stats.getTotalFraisTotal())
                .commissionNette(stats.getCommissionNette())
                .commissionIsPositive(stats.getCommissionIsPositive())
                .totalFraisTransaction(stats.getTotalFraisTransaction())
                .totalFraisKoperative(stats.getTotalFraisKoperative())
                .totalFraisRetrait(stats.getTotalFraisRetrait())
                .totalFraisTransfert(stats.getTotalFraisTransfert())
                .totalCommissionSeats(stats.getTotalCommissionSeats())
                .totalCommissionFee(stats.getTotalCommissionFee())
                .totalCosts(stats.getTotalCosts())
                .build();
    }

    @Override
    public List<MonthlyFinanceTrend> getFinanceTrend(FinanceStatsRequest request) {
        List<PaymentTransaction> completedTxs = fetchTransactions(request).stream()
                .filter(tx -> tx.getStatus() == PaymentTransactionStatusEnum.COMPLETED)
                .toList();

        // Keyed by YearMonth so entries sort chronologically, not lexicographically by display label.
        Map<YearMonth, MonthlyFinanceTrend> trendMap = new TreeMap<>();
        DateTimeFormatter displayFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (PaymentTransaction tx : completedTxs) {
            LocalDateTime date = tx.getCompletedAt() != null ? tx.getCompletedAt() : tx.getInitiatedAt();
            if (date == null) {
                continue;
            }

            YearMonth yearMonth = YearMonth.from(date);

            double amountCollected = Optional.ofNullable(tx.getAmount()).map(BigDecimal::doubleValue).orElse(0.0);
            double fraisTotal = tx.getFraisTotal().doubleValue();
            double commissionSeats = Optional.ofNullable(tx.getCommissionSeats()).map(BigDecimal::doubleValue).orElse(0.0);
            double commissionFee = Optional.ofNullable(tx.getCommissionFee()).map(BigDecimal::doubleValue).orElse(0.0);
            double commissionBrute = commissionSeats + commissionFee;

            double commissionNette = Optional.ofNullable(tx.getFacturation())
                    .map(f -> Optional.ofNullable(f.getCommission()).map(BigDecimal::doubleValue).orElse(0.0))
                    .orElse(0.0);

            MonthlyFinanceTrend trend = trendMap.getOrDefault(yearMonth, MonthlyFinanceTrend.builder()
                    .period(yearMonth.format(displayFormatter))
                    .totalAmountCollected(0.0)
                    .commissionBrute(0.0)
                    .totalCosts(0.0)
                    .commissionNette(0.0)
                    .totalTransactions(0L)
                    .build());

            trend.setTotalAmountCollected(trend.getTotalAmountCollected() + amountCollected);
            trend.setCommissionBrute(trend.getCommissionBrute() + commissionBrute);
            trend.setTotalCosts(trend.getTotalCosts() + fraisTotal);
            trend.setCommissionNette(trend.getCommissionNette() + commissionNette);
            trend.setTotalTransactions(trend.getTotalTransactions() + 1);

            trendMap.put(yearMonth, trend);
        }

        return new ArrayList<>(trendMap.values());
    }

    @Override
    public FinanceChartsStats getFinanceCharts(FinanceStatsRequest request) {
        List<PaymentTransaction> allTransactions = fetchTransactions(request);
        
        Map<String, Double> operatorBreakdown = new HashMap<>();
        Map<String, Long> paymentStatusDistribution = new HashMap<>();

        for (PaymentTransaction tx : allTransactions) {
            // Status distribution
            String status = tx.getStatus().name();
            paymentStatusDistribution.put(status, paymentStatusDistribution.getOrDefault(status, 0L) + 1);

            // Operator breakdown (only for completed)
            if (tx.getStatus() == PaymentTransactionStatusEnum.COMPLETED) {
                double amount = tx.getFraisTotal().doubleValue();
                operatorBreakdown.put(tx.getOperatorName(), operatorBreakdown.getOrDefault(tx.getOperatorName(), 0.0) + amount);
            }
        }

        return FinanceChartsStats.builder()
                .operatorBreakdown(operatorBreakdown)
                .paymentStatusDistribution(paymentStatusDistribution)
                .build();
    }

    @Override
    public FinanceSummaryStats getFinanceSummary(FinanceStatsRequest request) {
        FinanceSummaryStats stats = computeAggregatedStats(fetchTransactions(request));
        stats.setMonthlyTrend(getFinanceTrend(request));
        return stats;
    }
}
