package dev.theopenshelf.platform.entities;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import dev.theopenshelf.platform.model.Community;
import dev.theopenshelf.platform.model.CommunityWithMembership;
import dev.theopenshelf.platform.model.CommunityWithMembershipMembership;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Table(name = "communities")
public class CommunityEntity {
    @Id
    private UUID id;
    private String name;
    private String picture;
    private String description;
    @Column(name = "requires_approval")
    private boolean requiresApproval;

    @Embedded
    private LocationEntity location;

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL)
    private List<CommunityMemberEntity> members;

    public Community.CommunityBuilder toCommunity() {
        return Community.builder()
                .id(id)
                .name(name)
                .picture(picture)
                .description(description)
                .requiresApproval(requiresApproval)
                .location(location.toLocation().build());
    }


    public CommunityWithMembership toCommunityWithMembership(UUID userId) {

        return CommunityWithMembership.builder()
                .community(toCommunity().build())
                .membership( this.getMembers().stream().filter(m -> m.getUser().getId().equals(userId)).findAny()
                        .map(m -> m.getRole())
                        .map(r -> CommunityWithMembershipMembership.builder()
                                .isMember(true)
                                .role(r.toMemberRole())
                                .build())
                        .orElse(CommunityWithMembershipMembership.builder()
                                .isMember(false)
                                .build())
                ).build();
    }

    public CommunityEntity(Community c) {
        this.id = c.getId();
        this.name = c.getName();
        this.picture = c.getPicture();
        this.description = c.getDescription();
        this.requiresApproval = c.getRequiresApproval();
        this.location = new LocationEntity(c.getLocation());
    }
}