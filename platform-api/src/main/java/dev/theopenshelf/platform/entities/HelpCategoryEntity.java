package dev.theopenshelf.platform.entities;

import java.util.List;
import java.util.UUID;

import dev.theopenshelf.platform.model.HelpCategory;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "help_categories")
public class HelpCategoryEntity {
    @Id
    private UUID id;
    private String name;
    private String icon;
    @Column(name = "display_order")
    private Integer displayOrder;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<HelpArticleEntity> articles;

    public HelpCategory.HelpCategoryBuilder toHelpCategory() {
        return HelpCategory.builder()
                .id(id)
                .name(name)
                .icon(icon)
                .order(displayOrder);
    }

    public static HelpCategoryEntity fromHelpCategory(HelpCategory category) {
        return HelpCategoryEntity.builder()
                .id(category.getId() != null ? category.getId() : UUID.randomUUID())
                .name(category.getName())
                .icon(category.getIcon())
                .displayOrder(category.getOrder())
                .build();
    }

    public void updateFromHelpCategory(HelpCategory category) {
        this.name = category.getName();
        this.icon = category.getIcon();
        this.displayOrder = category.getOrder();
    }
}