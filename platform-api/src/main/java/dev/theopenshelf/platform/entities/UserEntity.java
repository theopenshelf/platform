package dev.theopenshelf.platform.entities;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import dev.theopenshelf.platform.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Table("users")
public class UserEntity {
    @Id
    private UUID id;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;

    public User.UserBuilder toUser() {
        return User.builder()
                .id(id)
                .username(username)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                ;
    }
}
