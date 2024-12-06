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

export interface UsersService {
    getUsers(): User[];
    getUser(id: string): User;
    saveUser(user: User): void;
    setUserPassword(userId: string | undefined, newPassword: string | undefined): void;
}