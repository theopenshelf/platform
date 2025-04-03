package dev.theopenshelf.platform.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopBorrower {
    private String username;
    private String fullName;
    private int totalBorrows;
    private double successRate;
}