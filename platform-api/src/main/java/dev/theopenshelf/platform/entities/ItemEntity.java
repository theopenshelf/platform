package dev.theopenshelf.platform.entities;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import dev.theopenshelf.platform.model.Item;
import dev.theopenshelf.platform.model.ItemStat;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "items")
public class ItemEntity {
    private static final Logger log = LoggerFactory.getLogger(ItemEntity.class);

    @Id
    private UUID id;
    private String name;
    private String description;
    private String shortDescription;
    private String imageUrl;
    private String owner;
    private Integer borrowCount = 0;
    private boolean favorite = false;
    private UUID libraryId;
    private UUID communityId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    private Instant createdAt;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BorrowRecordEntity> borrowRecords;

    public Item.ItemBuilder toItem() {
        return this.toItem(true);
    }

    public Item.ItemBuilder toItem(boolean withBorrowRecords) {
        try {
            return Item.builder()
                    .id(this.id != null ? this.id : UUID.randomUUID())
                    .name(this.name != null ? this.name : "")
                    .description(this.description != null ? this.description : "")
                    .shortDescription(this.shortDescription != null ? this.shortDescription : "")
                    .imageUrl(this.imageUrl != null ? this.imageUrl : "")
                    .libraryId(this.libraryId != null ? this.libraryId : UUID.randomUUID())
                    .category(this.category != null ? this.category.toCategory().build() : null)
                    .owner(this.owner != null ? this.owner : "")
                    .createdAt(this.createdAt != null ? OffsetDateTime.ofInstant(this.createdAt, ZoneOffset.UTC)
                            : OffsetDateTime.now())
                    .borrowCount(this.borrowCount != null ? this.borrowCount : 0)
                    .borrowRecords(withBorrowRecords && this.borrowRecords != null ? this.borrowRecords.stream()
                            .map(record -> record.toBorrowRecord().build())
                            .toList() : List.of())
                    .favorite(this.favorite);
        } catch (Exception e) {
            log.error("Error converting ItemEntity to Item", e);
            return Item.builder()
                    .id(UUID.randomUUID())
                    .name("")
                    .description("")
                    .shortDescription("")
                    .imageUrl("")
                    .libraryId(UUID.randomUUID())
                    .owner("")
                    .createdAt(OffsetDateTime.now())
                    .borrowCount(0)
                    .borrowRecords(List.of())
                    .favorite(false);
        }
    }

    public ItemStat.ItemStatBuilder toItemStat() {
        return ItemStat.builder()
                .id(id)
                .name(name)
                .owner(owner)
                .imageUrl(imageUrl)
                .description(description)
                .shortDescription(shortDescription)
                .category(category != null ? category.toCategory().build() : null)
                .favorite(favorite)
                .borrowCount(borrowCount)
                .libraryId(libraryId)
                .createdAt(createdAt != null ? OffsetDateTime.ofInstant(createdAt, ZoneOffset.UTC) : null)
                .borrowRecords(borrowRecords != null ? borrowRecords.stream()
                        .map(record -> record.toBorrowRecord().build())
                        .collect(Collectors.toList()) : Collections.emptyList())
                .lateReturnPercentage(calculateLateReturnPercentage())
                .averageDuration(calculateAverageDuration());
    }

    private BigDecimal calculateLateReturnPercentage() {
        if (borrowRecords == null || borrowRecords.isEmpty()) {
            return BigDecimal.ZERO;
        }
        long lateReturns = borrowRecords.stream()
                .filter(record -> record.getStatus().name().equals("RETURNED_LATE"))
                .count();
        return BigDecimal.valueOf((double) lateReturns / borrowRecords.size() * 100);
    }

    private BigDecimal calculateAverageDuration() {
        if (borrowRecords == null || borrowRecords.isEmpty()) {
            return BigDecimal.ZERO;
        }
        long totalDays = borrowRecords.stream()
                .filter(record -> record.getEffectiveReturnDate() != null)
                .mapToLong(record -> record.getEffectiveReturnDate().toEpochDay() - record.getStartDate().toEpochDay())
                .sum();
        return BigDecimal.valueOf((double) totalDays / borrowRecords.size());
    }
}
