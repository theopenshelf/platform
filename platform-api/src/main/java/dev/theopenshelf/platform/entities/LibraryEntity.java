package dev.theopenshelf.platform.entities;

import java.util.List;
import java.util.UUID;

import dev.theopenshelf.platform.model.Library;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "libraries")
public class LibraryEntity {
    @Id
    private UUID id;
    private String name;
    private boolean requiresApproval;
    private boolean freeAccess;
    private String instructions;
    private boolean isAdmin;
    private UUID communityId;

    @Embedded
    private LocationEntity location;

    @OneToMany(mappedBy = "library", cascade = CascadeType.ALL)
    private List<LibraryMemberEntity> members;

    public Library.LibraryBuilder toLibrary() {
        return Library.builder()
                .id(id)
                .name(name)
                .requiresApproval(requiresApproval)
                .freeAccess(freeAccess)
                .location(location.toLocation().build())
                .instructions(instructions)
                .isAdmin(isAdmin)
                .communityId(communityId);
    }
}