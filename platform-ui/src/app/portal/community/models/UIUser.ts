
export interface UIUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    disabled: boolean;
    borrowedItems: number;
    returnedLate: number;
    successRate: number;
    isEmailVerified: boolean;

}