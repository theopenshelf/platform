package dev.theopenshelf.platform;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@Slf4j
@SpringBootApplication
@EnableR2dbcRepositories
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
