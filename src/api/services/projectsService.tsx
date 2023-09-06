import { api } from "../api";
import { Epic } from "../models/epic";
import { Issue } from "../models/issue";
import { Project } from "../models/project";
import { Release } from "../models/release";
import { Sprint } from "../models/sprint";

export const getProjects = async (): Promise<Project[]> => {
    try {
        const response = await api.get("/projects", {});
        const projects: Project[] = response.data.items;
        return projects;
    } catch (error) {
        throw new Error("Error. Please try again.");
    }
};

export const getReleasesByProjectId = async (
    projectId: number
): Promise<Release[]> => {
    try {
        const response = await api.get("/releases", { params: { projectId } });
        const releases: Release[] = response.data.items;
        return releases;
    } catch (error) {
        throw new Error("Error. Please try again.");
    }
};

export const getSprintsByReleaseId = async (
    releaseId: number
): Promise<Sprint[]> => {
    try {
        const response = await api.get("/sprints", { params: { releaseId } });
        const sprints: Sprint[] = response.data.items;
        return sprints;
    } catch (error) {
        throw new Error("Error. Please try again.");
    }
};

export const getEpicsBySprintId = async (sprintId: number): Promise<Epic[]> => {
    try {
        const response = await api.get("/epics", { params: { sprintId } });
        const epics: Epic[] = response.data.items;
        return epics;
    } catch (error) {
        throw new Error("Error. Please try again.");
    }
};

export const getIssuesByEpicId = async (epicId: number): Promise<Issue[]> => {
    try {
        const response = await api.get("/issues", { params: { epicId } });
        console.log(response.data);
        const issues: Issue[] = response.data.items;
        return issues;
    } catch (error) {
        throw new Error("Error. Please try again.");
    }
};

export const getProjectById = async (projectId: number): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}`);
    const project: Project = response.data;
    return project;
};

export const createProject = async (project: any): Promise<Project> => {
    const response = await api.post("/projects", {
        name: project.name,
        description: project.description,
        identifier: project.identifier,
        isPublic: project.is_public,
    });
    console.log(response);
    const newProject: Project = response.data.project;
    return newProject;
};

export const editProject = async (project: any): Promise<Project> => {
    const response = await api.patch(`/projects/${project.id}`, {
        name: project.name,
        description: project.description,
        identifier: project.identifier,
        isPublic: project.is_public,
    });
    const editedProject: Project = response.data.project;
    return editedProject;
};

export const deleteProject = async (projectId: number): Promise<boolean> => {
    const response = await api.delete(`/projects/${projectId}`);
    console.log(response);
    return true;
};
