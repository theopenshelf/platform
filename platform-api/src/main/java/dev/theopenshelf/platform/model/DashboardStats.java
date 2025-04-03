package dev.theopenshelf.platform.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStats {
    private int totalBorrows;
    private int totalReservations;
    private int itemsOnLoan;
    private int totalItems;
    private int totalLibraries;
    private int totalUsers;
}