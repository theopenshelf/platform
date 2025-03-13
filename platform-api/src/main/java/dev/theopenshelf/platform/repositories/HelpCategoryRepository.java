package dev.theopenshelf.platform.repositories;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.HelpCategoryEntity;

@Repository
public interface HelpCategoryRepository extends CrudRepository<HelpCategoryEntity, UUID> {
    // Additional query methods can be defined here if needed
}