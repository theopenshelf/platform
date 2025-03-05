package dev.theopenshelf.platform.entities;

import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;

import dev.theopenshelf.platform.model.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
    private String flatNumber;
    private String streetAddress;
    private String city;
    private String postalCode;
    private String country;
    private String preferredLanguage;
    private String avatarUrl;
    private boolean disabled = false;
    private boolean isEmailVerified = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles;

    public User.UserBuilder toUser() {
        return User.builder()
                .id(id)
                .username(username)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .flatNumber(flatNumber)
                .streetAddress(streetAddress)
                .city(city)
                .postalCode(postalCode)
                .country(country)
                .preferredLanguage(preferredLanguage)
                .avatarUrl(avatarUrl)
                .disabled(disabled)
                .isEmailVerified(isEmailVerified)
                .roles(new ArrayList<>(roles));
    }
}
