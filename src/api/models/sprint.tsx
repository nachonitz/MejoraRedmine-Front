import { PaginationFilters } from "./common";
import { Project } from "./project";
import { Release } from "./release";

interface BaseSprint {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
}

export interface Sprint extends BaseSprint {
    id: number;
    release: Release;
    project: Project;
    progress: number;
}

export interface CreateSprintDto extends BaseSprint {
    releaseId: number;
    projectId: number;
}

export type UpdateSprintDto = Partial<CreateSprintDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof Sprint}:${AscDesc}`;

export interface SprintFilter extends PaginationFilters {
    name?: string;
    projectId?: number;
    releaseId?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    order?: FilterOrder;
}
