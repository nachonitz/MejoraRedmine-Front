import { User } from "./user";

export interface Project {
    id: number;
    redmineId: number;
    identifier: string;
    name: string;
    description: string;
    isPublic: boolean;
    status: number;
    createdAt: Date;
    owner: User;
}