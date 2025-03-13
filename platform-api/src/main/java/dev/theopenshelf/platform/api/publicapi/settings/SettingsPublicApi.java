package dev.theopenshelf.platform.api.publicapi.settings;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.SettingsPublicApiApiDelegate;
import dev.theopenshelf.platform.model.GetSecuritySettings200Response;
import dev.theopenshelf.platform.services.SettingsService;
import reactor.core.publisher.Mono;

@Service
public class SettingsPublicApi implements SettingsPublicApiApiDelegate {

    private final SettingsService settingsService;

    public SettingsPublicApi(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @Override
    public Mono<ResponseEntity<GetSecuritySettings200Response>> getPublicSettings(ServerWebExchange exchange) {
        return settingsService.getPublicSettings()
                .map(ResponseEntity::ok);
    }
}