package dev.theopenshelf.platform.entities;

import dev.theopenshelf.platform.model.MemberRole;

public enum MemberRoleEntity {
    ADMIN,
    MEMBER,
    REQUESTING_JOIN;

    public MemberRole toMemberRole() {
        switch (this) {
            case ADMIN:
                return MemberRole.ADMIN;
            case MEMBER:
                return MemberRole.MEMBER;
            case REQUESTING_JOIN:
            default:
                return MemberRole.REQUESTING_JOIN;
        }
    }
}