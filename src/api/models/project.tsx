import { PaginationFilters } from "./common";
import { Sprint } from "./sprint";
import { User } from "./user";

interface BaseProject {
    identifier: string;
    name: string;
    description?: string;
    isPublic: boolean;
}

export interface Project extends BaseProject {
    id: number;
    redmineId: number;
    createdAt: Date;
    owner: User;
    currentSprint: Sprint | null;
}

export type CreateProjectDto = BaseProject;
export type UpdateProjectDto = BaseProject;

type AscDesc = "asc" | "desc";
type FilterOrder = `${string}:${AscDesc}`;

export interface ProjectFilter extends PaginationFilters {
    name?: string;
    identifier?: string;
    owner?: number;
    order?: FilterOrder;
}
