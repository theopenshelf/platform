package dev.theopenshelf.platform.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopItem {
    private String title;
    private String author;
    private int totalBorrows;
    private int totalReservations;
    private double avgRating;
}