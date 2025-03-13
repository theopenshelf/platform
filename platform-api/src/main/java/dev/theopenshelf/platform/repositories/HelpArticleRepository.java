package dev.theopenshelf.platform.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.HelpArticleEntity;

@Repository
public interface HelpArticleRepository extends CrudRepository<HelpArticleEntity, UUID> {
    List<HelpArticleEntity> findAllByCategoryId(UUID categoryId);
}