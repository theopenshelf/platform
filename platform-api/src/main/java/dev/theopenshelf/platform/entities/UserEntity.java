package dev.theopenshelf.platform.entities;

import java.util.UUID;


import dev.theopenshelf.platform.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
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
