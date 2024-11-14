package dev.theopenshelf.platform.respositories;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import dev.theopenshelf.platform.entities.ItemEntity;
import reactor.core.publisher.Flux;

public interface ItemsRepository extends ReactiveCrudRepository<ItemEntity, UUID> {
    Flux<ItemEntity> findByLocation(String location);
}