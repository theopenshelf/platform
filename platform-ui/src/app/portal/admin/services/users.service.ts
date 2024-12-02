import { Injectable } from '@angular/core';

export interface User {
    id: string;
    username: string;
    email: string;
    flatNumber: string;
    address: string;
    borrowedItems: number;
    returnedLate: number;
    successRate: number;
    disabled: boolean;
} ;

@Injectable({
    providedIn: 'root',
})
export class UsersService {

    private index = 1;

    protected readonly users: User[] = [
        {
            id: this.index++ + "",
            username: 'johndoe',
            email: 'johndoe@example.com',
            flatNumber: '12A',
            address: '123 Main St, Cityville',
            borrowedItems: 5,
            returnedLate: 1,
            successRate: 80,
            disabled: false,
        },
        {
            id: this.index++ + "",
            username: 'janedoe',
            email: 'janedoe@example.com',
            flatNumber: '3B',
            address: '456 Elm St, Townsville',
            borrowedItems: 10,
            returnedLate: 0,
            successRate: 100,
            disabled: false,
        },
    ];

    getUsers(): User[] {
        return this.users;
    }

    getUser(id: string): User {
        return this.users.find(user => user.id === id) || {} as User;
    }
    
    saveUser(user: User): void {
        const existingUserIndex = this.users.findIndex(u => u.id === user.id);
        if (existingUserIndex >= 0) {
            // Update existing user
            this.users[existingUserIndex] = user;
        } else {
            // Add new user with incremented ID
            user.id = this.index++ + "";
            this.users.push(user);
        }
    }

    setUserPassword(userId: string | undefined, newPassword: string | undefined): void {
        if (userId && newPassword) {
            console.log(`Password updated for user ${userId}`);
        } else {
            console.error('Invalid user ID or password');
        }
    }

}