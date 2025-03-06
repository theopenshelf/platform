package dev.theopenshelf.platform.entities;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import dev.theopenshelf.platform.model.Notification;
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
@Table(name = "notifications")
public class NotificationEntity {
    @Id
    private Long id;
    private String author;
    private Instant date;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean alreadyRead;

    @Column(columnDefinition = "jsonb")
    private String payload;

    public Notification.NotificationBuilder toNotification() {
        return Notification.builder()
                .id(id.intValue())
                .author(author)
                .date(date != null ? OffsetDateTime.ofInstant(date, ZoneOffset.UTC) : null)
                .type(Notification.TypeEnum.valueOf(type.name()))
                .alreadyRead(alreadyRead);
        // TODO payload
    }
}