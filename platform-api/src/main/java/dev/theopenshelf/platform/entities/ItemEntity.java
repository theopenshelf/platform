package dev.theopenshelf.platform.entities;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import dev.theopenshelf.platform.model.Item;
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

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    private Instant createdAt;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BorrowRecordEntity> borrowRecords;

    public Item.ItemBuilder toItem() {
        return Item.builder()
                .id(id)
                .name(name)
                .description(description)
                .shortDescription(shortDescription)
                .imageUrl(imageUrl)
                .owner(owner)
                .favorite(favorite)
                .borrowCount(borrowCount)
                .libraryId(libraryId)
                .category(category != null ? category.toCategory().build() : null)
                .borrowRecords(borrowRecords != null ? borrowRecords.stream()
                        .map(record -> record.toBorrowRecord().build())
                        .collect(Collectors.toList()) : Collections.emptyList())
                .createdAt(createdAt != null ? OffsetDateTime.ofInstant(createdAt, ZoneOffset.UTC) : null);
    }
}
