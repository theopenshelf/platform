package dev.theopenshelf.platform.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowStats {
    private int totalBorrows;
    private int totalReservations;
    private int itemsOnLoan;
    private double avgLoanDuration;
    private ReturnTimeliness returnTimeliness;

    @Data
    @Builder
    public static class ReturnTimeliness {
        private int onTime;
        private int late;
        private int early;
    }
}