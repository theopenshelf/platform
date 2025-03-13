package dev.theopenshelf.platform.api.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.SettingsAdminApiApiDelegate;
import dev.theopenshelf.platform.model.GetSecuritySettings200Response;
import dev.theopenshelf.platform.model.SaveSecuritySettingsRequest;
import dev.theopenshelf.platform.services.SettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettingsAdminApi implements SettingsAdminApiApiDelegate {

    private final SettingsService settingsService;

    @Override
    public Mono<ResponseEntity<GetSecuritySettings200Response>> getSecuritySettings(ServerWebExchange exchange) {
        return settingsService.getPublicSettings()
                .map(ResponseEntity::ok);
    }

    @Override
    public Mono<ResponseEntity<SaveSecuritySettingsRequest>> saveSecuritySettings(
            Mono<SaveSecuritySettingsRequest> request,
            ServerWebExchange exchange) {
        return request
                .flatMap(settingsService::saveSecuritySettings)
                .then(request)
                .map(ResponseEntity::ok);
    }
}