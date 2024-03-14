import { PaginationFilters } from "./common";
import { Enumeration } from "./enumeration";
import { Epic } from "./epic";
import { Project } from "./project";
import { Release } from "./release";
import { Sprint } from "./sprint";
import { Tracker } from "./tracker";
import { User } from "./user";

interface BaseIssue {
    subject: string;
    description?: string;
    estimation?: string;
}

export interface Issue extends BaseIssue {
    id: number;
    redmineId: number;
    priority: Enumeration;
    epic?: Epic;
    sprint?: Sprint;
    release?: Release;
    project: Project;
    status: IssueStatus;
    tracker: Tracker;
    createdAt: Date;
    assignee?: User;
    endDate?: Date;
}

export interface CreateIssueDto extends BaseIssue {
    priorityId: number;
    trackerId: number;
    projectId: number;
    releaseId?: number;
    sprintId?: number;
    epicId?: number;
    statusId?: number;
    assigneeId?: number;
    endDate?: Date;
}

export type UpdateIssueDto = Partial<CreateIssueDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof Issue}:${AscDesc}`;

export interface IssueFilter extends PaginationFilters {
    subject?: string;
    projectId?: number;
    trackerId?: number;
    priorityId?: number;
    statusId?: number;
    releaseId?: number;
    sprintId?: number;
    epicId?: number;
    assigneeId?: number;
    estimation?: string;
    isEstimated?: boolean;
    order?: FilterOrder;
    endDate?: string | string;
}

export interface IssueStatus {
    id: number;
    name: string;
    is_closed: boolean;
}
