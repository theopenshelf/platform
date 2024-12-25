package dev.theopenshelf.platform.security;

import java.util.Collections;

import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import dev.theopenshelf.platform.respositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements ReactiveUserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return Mono.just(usersRepository.findByUsername(username))
                .map(user -> new User(user.getUsername(), user.getPassword(), Collections.emptyList()));
    }
}
