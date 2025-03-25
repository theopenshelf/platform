package dev.theopenshelf.platform.entities;

import java.util.UUID;

import dev.theopenshelf.platform.model.CustomPage;
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

    private UUID communityId;
    private String content;
    private Integer displayOrder;

    @Enumerated(EnumType.STRING)
    private Position position;

    private String ref;
    private String title;

    public enum Position {
        FOOTER_LINKS,
        COPYRIGHT,
        FOOTER_HELP,
        COMMUNITY
    }

    public CustomPage toCustomPage() {
        return new CustomPage()
                .id(id)
                .ref(ref)
                .title(title)
                .content(content)
                .position(position != null ? CustomPage.PositionEnum.valueOf(position.name()) : null);
    }

    public static CustomPageEntity fromCustomPage(CustomPage customPage) {
        return CustomPageEntity.builder()
                .id(customPage.getId() != null ? customPage.getId() : UUID.randomUUID())
                .ref(customPage.getRef())
                .title(customPage.getTitle())
                .content(customPage.getContent())
                .position(customPage.getPosition() != null ? Position.valueOf(customPage.getPosition().name()) : null)
                .displayOrder(customPage.getOrder())
                .build();
    }
}