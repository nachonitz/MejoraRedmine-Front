import { PaginationFilters } from "./common";
import { Project } from "./project";

interface BaseRelease {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
}

export interface Release extends BaseRelease {
    id: number;
    project: Project;
    progress: number;
}

export interface CreateReleaseDto extends BaseRelease {
    projectId: number;
}
export type UpdateReleaseDto = Partial<CreateReleaseDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof Release}:${AscDesc}`;

export interface ReleaseFilter extends PaginationFilters {
    name?: string;
    projectId?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    order?: FilterOrder;
}
