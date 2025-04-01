package dev.theopenshelf.platform.entities;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    private String author;
    private Instant date;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean alreadyRead;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> payload;

    public Notification.NotificationBuilder toNotification() {
        return Notification.builder()
                .id(id)
                .author(author)
                .date(date != null ? OffsetDateTime.ofInstant(date, ZoneOffset.UTC) : null)
                .type(Notification.TypeEnum.valueOf(type.name()))
                .alreadyRead(alreadyRead)
                .payload(payload);
    }
}