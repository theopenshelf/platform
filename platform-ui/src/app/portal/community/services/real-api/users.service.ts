import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ProfileCommunityApiService, User, UsersCommunityApiService } from "../../../../api-client";
import { UIUser } from "../../../../models/UIUser";
import { UsersService } from "../users.service";

@Injectable({
    providedIn: 'root',
})
export class APIUsersService implements UsersService {

    constructor(private usersApiService: UsersCommunityApiService, private profileApiService: ProfileCommunityApiService) { }

    getUsers(): Observable<UIUser[]> {
        return this.usersApiService.getCommunityUsers().pipe(
            map((users: User[]) =>
                users.map(
                    (user: User) =>
                        ({
                            id: user.id,
                            username: user.username,
                            email: user.email
                        }) as UIUser,
                ),
            ),
        );
    }

    getUser(userId: string): Observable<UIUser> {
        return this.usersApiService.getCommunityUserById(userId).pipe(
            map((user: User) => this.mapToUIUser(user)),
        );
    }

    findUser(query: string, limit?: number): Observable<UIUser[]> {
        return this.usersApiService.getCommunityUsers(query, limit).pipe(
            map((users: User[]) => users.map((user: User) => this.mapToUIUser(user))),
        );
    }

    updateUser(uiUser: UIUser): Observable<UIUser> {
        const user = this.mapToApiUser(uiUser);
        return this.profileApiService.updateProfile(user).pipe(
            map((updatedUser: User) => this.mapToUIUser(updatedUser))
        );
    }

    private mapToApiUser(uiUser: UIUser): User {
        return {
            id: uiUser.id,
            email: uiUser.email,
            flatNumber: uiUser.flatNumber,
            streetAddress: uiUser.streetAddress,
            city: uiUser.city,
            postalCode: uiUser.postalCode,
            country: uiUser.country,
            username: uiUser.username,
            firstName: uiUser.firstName,
            lastName: uiUser.lastName,
            isEmailVerified: uiUser.isEmailVerified,
            disabled: uiUser.disabled,
            avatarUrl: uiUser.avatarUrl,
            preferredLanguage: uiUser.preferredLanguage,
            roles: [],
        };
    }

    private mapToUIUser(user: User): UIUser {
        return {
            id: user.id,
            email: user.email || '',
            streetAddress: user.streetAddress || '',
            city: user.city || '',
            postalCode: user.postalCode || '',
            country: user.country || '',
            username: user.username || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            isEmailVerified: user.isEmailVerified || false,
            disabled: user.disabled || false,
            borrowedItems: 0,
            returnedLate: 0,
            successRate: 0,
            avatarUrl: user.avatarUrl || '',
            preferredLanguage: user.preferredLanguage || '',
        };
    }
}