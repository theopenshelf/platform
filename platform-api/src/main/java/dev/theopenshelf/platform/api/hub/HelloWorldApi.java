package dev.theopenshelf.platform.api.hub;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.HelloWorldApiApiDelegate;
import dev.theopenshelf.platform.model.ResponseHelloWorld;
import dev.theopenshelf.platform.services.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class HelloWorldApi implements HelloWorldApiApiDelegate {

    @Autowired
    private ItemService itemsService;

    @Override
    public Mono<ResponseEntity<ResponseHelloWorld>> getHelloWorld(ServerWebExchange exchange) {
        return Mono.just(ResponseEntity.ok(ResponseHelloWorld.builder()
                .message("hello test!")
                .build()));
    }
}
