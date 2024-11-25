package dev.theopenshelf.platform.api.community;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;

import dev.theopenshelf.platform.api.HelloWorldApiDelegate;
import dev.theopenshelf.platform.model.ResponseHelloWorld;
import dev.theopenshelf.platform.services.ItemsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class HelloWorldApi implements HelloWorldApiDelegate {

    @Autowired
    private ItemsService itemsService;

    @Override
    public Mono<ResponseEntity<ResponseHelloWorld>> getHelloWorld(ServerWebExchange exchange) {
        return itemsService.getAllItems().collectList()
                .map(items ->
                        ResponseEntity.ok(
                                ResponseHelloWorld.builder()
                                        .message("hello test!")
                                        .items(items)
                                        .build()
                )
        );
    }
}
