package dev.theopenshelf.platform.services;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.SettingsEntity;
import dev.theopenshelf.platform.model.GetSecuritySettings200Response;
import dev.theopenshelf.platform.model.SaveSecuritySettingsRequest;
import dev.theopenshelf.platform.repositories.SettingsRepository;
import reactor.core.publisher.Mono;

@Service
public class SettingsService {
    private final SettingsRepository settingsRepository;
    private static final String REGISTRATION_ENABLED_KEY = "registration.enabled";

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public Mono<GetSecuritySettings200Response> getPublicSettings() {
        return Mono.fromCallable(() -> {
            boolean isRegistrationEnabled = settingsRepository.findById(REGISTRATION_ENABLED_KEY)
                    .map(setting -> Boolean.parseBoolean(setting.getValue()))
                    .orElse(false);

            return new GetSecuritySettings200Response()
                    .isRegistrationEnabled(isRegistrationEnabled);
        });
    }

    public Mono<Void> saveSecuritySettings(SaveSecuritySettingsRequest request) {
        return Mono.fromRunnable(() -> {
            SettingsEntity registrationSetting = SettingsEntity.builder()
                    .key(REGISTRATION_ENABLED_KEY)
                    .value(String.valueOf(request.getIsRegistrationEnabled()))
                    .isPublic(true)
                    .build();
            settingsRepository.save(registrationSetting);
        });
    }
}