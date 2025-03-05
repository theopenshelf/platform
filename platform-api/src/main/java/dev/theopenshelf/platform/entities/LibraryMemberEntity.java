package dev.theopenshelf.platform.entities;

import java.util.ArrayList;
import java.util.UUID;

import dev.theopenshelf.platform.model.LibraryMember;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "library_members")
public class LibraryMemberEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "library_id")
    private LibraryEntity library;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    private MemberRole role;

    public LibraryMember.LibraryMemberBuilder toLibraryMember() {
        return LibraryMember.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .flatNumber(user.getFlatNumber())
                .streetAddress(user.getStreetAddress())
                .city(user.getCity())
                .postalCode(user.getPostalCode())
                .country(user.getCountry())
                .preferredLanguage(user.getPreferredLanguage())
                .avatarUrl(user.getAvatarUrl())
                .disabled(user.isDisabled())
                .isEmailVerified(user.isEmailVerified())
                .roles(new ArrayList<>(user.getRoles()))
                .role(LibraryMember.RoleEnum.valueOf(role.name()));
    }
}