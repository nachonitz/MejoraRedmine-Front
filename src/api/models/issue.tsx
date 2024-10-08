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
    sortIndex: number;
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
    releaseId?: number | null;
    sprintId?: number | null;
    epicId?: number | null;
    statusId?: number;
    assigneeId?: number;
    endDate?: Date;
    sortIndex?: number;
}

export type UpdateIssueDto = Partial<CreateIssueDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${string}:${AscDesc}`;

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
    endDate?: Date | string;
}

export interface IssueStatus {
    id: number;
    name: string;
    is_closed: boolean;
}
