package dev.theopenshelf.platform.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopCategory {
    private String name;
    private int totalBorrows;
    private int totalItems;
}