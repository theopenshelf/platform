package dev.theopenshelf.platform.entities;

import java.time.Instant;
import java.util.UUID;

import dev.theopenshelf.platform.model.Item;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    private String located;

    private Instant createdAt;

    public Item.ItemBuilder toItem() {
        return Item.builder()
                .id(id)
                .name(name)
                .description(description);
    }
}
