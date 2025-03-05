package dev.theopenshelf.platform.entities;

import java.util.UUID;

import dev.theopenshelf.platform.model.Category;
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
@Table(name = "categories")
public class CategoryEntity {
    @Id
    private UUID id;
    private String name;
    private String icon;
    private String color;
    private String template;

    public Category.CategoryBuilder toCategory() {
        return Category.builder()
                .id(id)
                .name(name)
                .icon(icon)
                .color(color)
                .template(template);
    }
}