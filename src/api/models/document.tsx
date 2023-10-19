import { Project } from "./project";
import { User } from "./user";

interface BaseDocument {
    title: string;
    description?: string;
    categoryId: number;
    tags?: string[];
}

export interface Document extends BaseDocument {
    id: number;
    redmineId: number;
    createdAt: Date;
    project: Project;
    author?: User;
    attachments?: File[];
}

export interface CreateDocumentDto extends BaseDocument {
    projectId: number;
    authorId?: number;
}
export type UpdateDocumentDto = Partial<CreateDocumentDto>;

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof Document}:${AscDesc}`;

export interface DocumentFilter {
    title?: string;
    projectId: number;
    authorId?: number;
    categoryId?: number;
    tags?: string[];
    order?: FilterOrder;
}
