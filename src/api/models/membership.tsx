import { PaginationFilters } from "./common";
import { Project } from "./project";
import { ProjectRole } from "./role";
import { User } from "./user";

export interface ProjectMembership {
    id: number;
    redmineId: number;
    user: User;
    project: Project;
    roles: ProjectRole[];
}

export interface CreateProjectMembershipDto {
    userId: number;
    projectId: number;
    roleIds: number[];
}

export type UpdateProjectMembershipDto = Partial<CreateProjectMembershipDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof ProjectMembership}:${AscDesc}`;

export interface ProjectMembershipFilter extends PaginationFilters {
    userId?: number;
    search?: string;
    projectId?: number;
    roleId?: number;
    order?: FilterOrder;
}
