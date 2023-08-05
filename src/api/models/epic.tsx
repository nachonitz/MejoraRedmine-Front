import { Project } from "./project";
import { Release } from "./release";
import { Sprint } from "./sprint";

export interface Epic {
    id: number;
    name: string;
    description: string;
    priority: string;
    sprint: Sprint;
    release: Release;
    project: Project;
}