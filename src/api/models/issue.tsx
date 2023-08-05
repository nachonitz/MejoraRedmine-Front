import { Epic } from "./epic";
import { Project } from "./project";
import { Release } from "./release";
import { Sprint } from "./sprint";

export interface Issue {
    id: number;
    subject: string;
    description: string;
    priority: string;
    epic: Epic;
    sprint: Sprint;
    release: Release;
    project: Project;
}