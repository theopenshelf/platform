package dev.theopenshelf.platform.entities;

import java.util.Arrays;
import java.util.Set;
import java.util.UUID;

import dev.theopenshelf.platform.model.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "flat_number")
    private String flatNumber;
    @Column(name = "street_address")
    private String streetAddress;
    private String city;
    @Column(name = "postal_code")
    private String postalCode;
    private String country;
    @Column(name = "preferred_language")
    private String preferredLanguage;
    @Column(name = "avatar_url")
    private String avatarUrl;
    private boolean disabled = false;
    @Column(name = "is_email_verified")
    private boolean isEmailVerified = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.WAITING_FOR_EMAIL;

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
                .roles(Arrays.asList("hub")); // TODO
    }
}
