package dev.theopenshelf.platform.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.UUID;

import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.model.SetUserPasswordRequest;
import dev.theopenshelf.platform.model.User;
import dev.theopenshelf.platform.model.UserWithStats;
import dev.theopenshelf.platform.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {
    private final UsersRepository usersRepository;

    public Mono<User> getUserById(UUID id) {
        return Mono.justOrEmpty(usersRepository.findById(id))
                .map(UserEntity::toUser)
                .map(User.UserBuilder::build);
    }

    public Flux<User> getUsers(String query, Integer limit) {
        return Flux.fromIterable(usersRepository.findAll())
                .map(UserEntity::toUser)
                .map(User.UserBuilder::build)
                .take(limit != null ? limit : 10);
    }

    public Mono<User> updateProfile(UUID userId, User user) {
        log.info("Updating profile for user: {}", userId);
        return Mono.fromCallable(() -> {
            UserEntity userEntity = usersRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            userEntity.setFirstName(user.getFirstName());
            userEntity.setLastName(user.getLastName());
            userEntity.setEmail(user.getEmail());
            userEntity.setFlatNumber(user.getFlatNumber());
            userEntity.setStreetAddress(user.getStreetAddress());
            userEntity.setCity(user.getCity());
            userEntity.setPostalCode(user.getPostalCode());
            userEntity.setCountry(user.getCountry());
            userEntity.setPreferredLanguage(user.getPreferredLanguage());
            userEntity.setAvatarUrl(user.getAvatarUrl());

            UserEntity savedEntity = usersRepository.save(userEntity);
            log.info("Profile updated successfully for user: {}", userId);
            return savedEntity.toUser().build();
        });
    }

    public Mono<UserWithStats> getUserWithStats(UUID id) {
        return Mono.justOrEmpty(usersRepository.findById(id))
                .map(entity -> UserWithStats.builder()
                        .id(entity.getId().toString())
                        .username(entity.getUsername())
                        .firstName(entity.getFirstName())
                        .lastName(entity.getLastName())
                        .email(entity.getEmail())
                        .flatNumber(entity.getFlatNumber())
                        .streetAddress(entity.getStreetAddress())
                        .city(entity.getCity())
                        .postalCode(entity.getPostalCode())
                        .country(entity.getCountry())
                        .preferredLanguage(entity.getPreferredLanguage())
                        .avatarUrl(entity.getAvatarUrl())
                        .disabled(entity.isDisabled())
                        .isEmailVerified(entity.isEmailVerified())
                        .roles(new ArrayList<>(entity.getRoles()))
                        .borrowedItems(0) // TODO: Implement from borrow records
                        .returnedLate(0) // TODO: Implement from borrow records
                        .successRate(BigDecimal.ONE) // TODO: Implement from borrow records
                        .build());
    }

    public Flux<UserWithStats> getUsersWithStats() {
        return Flux.fromIterable(usersRepository.findAll())
                .map(entity -> UserWithStats.builder()
                        .id(entity.getId().toString())
                        .username(entity.getUsername())
                        .firstName(entity.getFirstName())
                        .lastName(entity.getLastName())
                        .email(entity.getEmail())
                        .flatNumber(entity.getFlatNumber())
                        .streetAddress(entity.getStreetAddress())
                        .city(entity.getCity())
                        .postalCode(entity.getPostalCode())
                        .country(entity.getCountry())
                        .preferredLanguage(entity.getPreferredLanguage())
                        .avatarUrl(entity.getAvatarUrl())
                        .disabled(entity.isDisabled())
                        .isEmailVerified(entity.isEmailVerified())
                        .roles(new ArrayList<>(entity.getRoles()))
                        .borrowedItems(0) // TODO: Implement from borrow records
                        .returnedLate(0) // TODO: Implement from borrow records
                        .successRate(BigDecimal.ONE) // TODO: Implement from borrow records
                        .build());
    }

    public Mono<UserWithStats> saveUser(UserWithStats user) {
        return Mono.fromCallable(() -> {
            UserEntity entity = user.getId() != null ? usersRepository.findById(UUID.fromString(user.getId()))
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    : UserEntity.builder()
                            .id(UUID.randomUUID())
                            .build();

            entity.setUsername(user.getUsername());
            entity.setFirstName(user.getFirstName());
            entity.setLastName(user.getLastName());
            entity.setEmail(user.getEmail());
            entity.setFlatNumber(user.getFlatNumber());
            entity.setStreetAddress(user.getStreetAddress());
            entity.setCity(user.getCity());
            entity.setPostalCode(user.getPostalCode());
            entity.setCountry(user.getCountry());
            entity.setPreferredLanguage(user.getPreferredLanguage());
            entity.setAvatarUrl(user.getAvatarUrl());
            entity.setDisabled(user.getDisabled());
            entity.setEmailVerified(user.getIsEmailVerified());
            entity.setRoles(new HashSet<>(user.getRoles()));

            UserEntity savedEntity = usersRepository.save(entity);
            return getUserWithStats(savedEntity.getId()).block();
        });
    }

    public Mono<Void> setUserPassword(UUID userId, SetUserPasswordRequest request) {
        return Mono.fromRunnable(() -> {
            UserEntity entity = usersRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            entity.setPassword(request.getNewPassword()); // TODO: Hash password
            usersRepository.save(entity);
        });
    }
}