package dev.theopenshelf.platform.entities;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import dev.theopenshelf.platform.model.Item;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Table("items")
public class ItemEntity {
    @Id
    private UUID id;
    private String name;
    private String description;
    private String location;

    private Instant createdAt;

    public Item.ItemBuilder toItem() {
        return Item.builder()
                .id(id)
                .name(name)
                .description(description)
                .location(location)
                ;
    }
}
