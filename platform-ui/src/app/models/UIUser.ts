export interface UIUser {
    id: string;
    username: string;

    firstName: string;
    lastName: string;

    email: string;
    isEmailVerified: boolean;

    avatarUrl?: string;

    disabled: boolean;
    preferredLanguage?: string;

    //address
    flatNumber?: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;

    //statistics
    borrowedItems: number;
    returnedLate: number;
    successRate: number;
}