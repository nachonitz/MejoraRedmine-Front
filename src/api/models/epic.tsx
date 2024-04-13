import { PaginationFilters } from "./common";
import { Enumeration } from "./enumeration";
import { Issue } from "./issue";
import { Project } from "./project";
import { Release } from "./release";
import { Sprint } from "./sprint";

interface BaseEpic {
    name: string;
    description?: string;
}

export interface Epic extends BaseEpic {
    id: number;
    sprint?: Sprint;
    release?: Release;
    project: Project;
    priority: Enumeration;
    progress: number;
    issues?: Issue[];
}

export interface CreateEpicDto extends BaseEpic {
    priorityId: number;
    sprintId?: number;
    releaseId?: number;
    projectId?: number;
}
export type UpdateEpicDto = Partial<CreateEpicDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${string}:${AscDesc}`;

export interface EpicFilter extends PaginationFilters {
    name?: string;
    priorityId?: number;
    projectId?: number;
    sprintId?: number;
    releaseId?: number;
    order?: FilterOrder;
}
