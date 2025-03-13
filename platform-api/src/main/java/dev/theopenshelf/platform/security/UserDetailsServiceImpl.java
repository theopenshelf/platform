package dev.theopenshelf.platform.security;

import java.util.Collections;

import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.entities.UserEntity;
import dev.theopenshelf.platform.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements ReactiveUserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        UserEntity user = usersRepository.findByUsername(username);
        return user == null ? Mono.empty() : Mono.just(new User(user.getId().toString(), user.getPassword(), Collections.emptyList()));
    }
}
