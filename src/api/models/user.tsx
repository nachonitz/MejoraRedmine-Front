import { PaginationFilters } from "./common";

interface BaseUser {
    firstname: string;
    lastname: string;
    login: string;
    mail: string;
}

export interface User extends BaseUser {
    id: number;
    redmineId: number;
    createdAt: Date;
    admin: boolean;
}

export interface PendingUser extends BaseUser {
    id: number;
    created_on: Date;
}

export interface AuthUser extends BaseUser {
    id: number;
    redmineId: number;
    api_key: string;
    created_on: Date;
}

export interface CreateUserDto extends BaseUser {
    password: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof User}:${AscDesc}`;

export interface UserFilter extends PaginationFilters {
    firstname?: string;
    lastname?: string;
    login?: string;
    mail?: string;
    order?: FilterOrder;
}
