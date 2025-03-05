package dev.theopenshelf.platform.respositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import dev.theopenshelf.platform.entities.ItemEntity;

public interface ItemsRepository extends CrudRepository<ItemEntity, UUID> {
}