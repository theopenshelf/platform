package dev.theopenshelf.platform.entities;

import java.util.UUID;

import dev.theopenshelf.platform.model.HelpArticle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "help_articles")
public class HelpArticleEntity {
    @Id
    private UUID id;
    private String title;
    private String content;
    @Column(name = "display_order")
    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private HelpCategoryEntity category;

    public HelpArticle.HelpArticleBuilder toHelpArticle() {
        return HelpArticle.builder()
                .id(id)
                .title(title)
                .content(content)
                .order(displayOrder)
                .category(category != null ? category.toHelpCategory().build() : null);
    }

    public static HelpArticleEntity fromHelpArticle(HelpArticle article) {
        return HelpArticleEntity.builder()
                .id(article.getId() != null ? article.getId() : UUID.randomUUID())
                .title(article.getTitle())
                .content(article.getContent())
                .displayOrder(article.getOrder())
                .build();
    }

    public void updateFromHelpArticle(HelpArticle article) {
        this.title = article.getTitle();
        this.content = article.getContent();
        this.displayOrder = article.getOrder();
    }
}