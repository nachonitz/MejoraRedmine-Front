import { PaginationFilters } from "./common";
import { Project } from "./project";
import { User } from "./user";

interface BaseFile {
    title: string;
    text?: string;
    tags?: string[];
}

export interface File extends BaseFile {
    id: number;
    redmineId: number;
    project: Project;
    author?: User;
    document?: Document;
    filesize?: number;
}

export interface CreateFileDto extends BaseFile {
    token?: string;
    projectId: number;
    documentId?: number;
    authorId?: number;
}

type AscDesc = "asc" | "desc";
type FilterOrder = `${string}:${AscDesc}`;

export interface FileFilter extends PaginationFilters {
    title?: string;
    projectId: number;
    documentId?: number;
    authorId?: number;
    tags?: string[];
    order?: FilterOrder;
}
