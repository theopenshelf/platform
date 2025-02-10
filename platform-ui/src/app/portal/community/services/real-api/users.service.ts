import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { User, UsersCommunityApiService } from "../../../../api-client";
import { UIUser } from "../../models/UIUser";
import { UsersService } from "../users.service";

@Injectable({
    providedIn: 'root',
})
export class APIUsersService implements UsersService {

    constructor(private usersApiService: UsersCommunityApiService) { }

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
            map((user: User) => user as UIUser),
        );
    }

    findUser(query: string, limit?: number): Observable<UIUser[]> {
        return this.usersApiService.getCommunityUsers(query, limit).pipe(
            map((users: User[]) => users.map((user: User) => user as UIUser)),
        );
    }
}