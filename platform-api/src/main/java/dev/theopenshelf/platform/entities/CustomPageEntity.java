package dev.theopenshelf.platform.entities;

import java.util.UUID;

import dev.theopenshelf.platform.model.CustomPage;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "custom_pages")
public class CustomPageEntity {
    @Id
    private UUID id;
    private String ref;
    @Column(name = "display_order")
    private Integer displayOrder;
    private String title;
    private String content;
    private UUID communityId;

    @Enumerated(EnumType.STRING)
    private PagePosition position;

    public CustomPage.CustomPageBuilder toCustomPage() {
        return CustomPage.builder()
                .id(id.toString())
                .ref(ref)
                .order(displayOrder)
                .position(CustomPage.PositionEnum.valueOf(position.name()))
                .title(title)
                .content(content)
                .communityId(communityId);
    }
}