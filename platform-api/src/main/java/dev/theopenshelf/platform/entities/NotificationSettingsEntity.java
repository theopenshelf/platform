package dev.theopenshelf.platform.entities;

import java.util.UUID;

import dev.theopenshelf.platform.model.NotificationSettings;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
@Table(name = "notification_settings")
public class NotificationSettingsEntity {
    @Id
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private boolean enableNotifications;

    public NotificationSettings toNotificationSettings() {
        return NotificationSettings.builder()
                .enableNotifications(enableNotifications)
                .build();
    }
} 