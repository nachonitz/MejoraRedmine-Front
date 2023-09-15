import { PaginationFilters } from "./common";
import { Enumeration } from "./enumeration";
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
}

export interface CreateEpicDto extends BaseEpic {
    priorityId: number;
    sprintId?: number;
    releaseId?: number;
    projectId?: number;
}
export type UpdateEpicDto = Partial<CreateEpicDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof Epic}:${AscDesc}`;

export interface EpicFilter extends PaginationFilters {
    name?: string;
    priorityId?: number;
    projectId?: number;
    sprintId?: number;
    releaseId?: number;
    order?: FilterOrder;
}
