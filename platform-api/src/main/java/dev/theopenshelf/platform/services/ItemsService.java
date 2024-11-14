package dev.theopenshelf.platform.services;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.respositories.ItemsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import dev.theopenshelf.platform.model.Item;
import reactor.core.publisher.Flux;


@Service
@RequiredArgsConstructor
@Slf4j
public class ItemsService {

    private final ItemsRepository itemsRepository;

    public Flux<Item> getAllItems() {
        return itemsRepository.findAll().map(i -> i.toItem().build());
    }
}
