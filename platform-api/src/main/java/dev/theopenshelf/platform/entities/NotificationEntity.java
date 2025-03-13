package dev.theopenshelf.platform.entities;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Column(nullable = false)
    private UUID userId;

    private String author;
    private Instant date;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean alreadyRead;

    @Column(columnDefinition = "jsonb")
    private String payload;

    public Notification.NotificationBuilder toNotification() {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> payloadMap = null;
        try {
            payloadMap = payload != null ? mapper.readValue(payload, new TypeReference<Map<String, Object>>() {
            }) : null;
        } catch (Exception e) {
            // Handle or log the error
        }

        return Notification.builder()
                .id(id.intValue())
                .author(author)
                .date(date != null ? OffsetDateTime.ofInstant(date, ZoneOffset.UTC) : null)
                .type(Notification.TypeEnum.valueOf(type.name()))
                .alreadyRead(alreadyRead)
                .payload(payloadMap);
    }
}