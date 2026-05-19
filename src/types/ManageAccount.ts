
export interface RegisterPayload {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    birthDate: string;
    phoneNumber: string;
}

export interface RegisterManyPayload extends RegisterPayload {}

export interface Account {
    accountID?: string;
    key?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string | { roleName: string };
    roleName?: string;
    status?: string;
    birthDate?: string;
    phoneNumber?: string;
}