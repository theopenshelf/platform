package dev.theopenshelf.platform.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.CommunityEntity;

@Repository
public interface CommunityRepository
        extends CrudRepository<CommunityEntity, UUID>, JpaSpecificationExecutor<CommunityEntity> {
    Page<CommunityEntity> findAll(Specification<CommunityEntity> spec, Pageable pageable);
}