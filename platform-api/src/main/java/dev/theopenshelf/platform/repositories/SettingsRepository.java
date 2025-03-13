package dev.theopenshelf.platform.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.theopenshelf.platform.entities.SettingsEntity;

@Repository
public interface SettingsRepository extends CrudRepository<SettingsEntity, String> {
    List<SettingsEntity> findByIsPublicTrue();
}