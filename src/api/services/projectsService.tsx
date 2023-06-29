import { api } from "../api";
import { Epic } from "../models/epic";
import { Issue } from "../models/issue";
import { Project } from "../models/project";
import { Release } from "../models/release";
import { Sprint } from "../models/sprint";

export const getProjects = async (): Promise<Project[]> => {
	try {
		const response = await api.get('/projects', {});
		const projects: Project[] = response.data.projects;
		return projects;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const getReleasesByProjectId = async (projectId: number): Promise<Release[]> => {
	try {
		const response = await api.get('/releases', { params: { projectId } });
		const releases: Release[] = response.data.items;
		return releases;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const getSprintsByReleaseId = async (releaseId: number): Promise<Sprint[]> => {
	try {
		const response = await api.get('/sprints', { params: { releaseId } });
		const sprints: Sprint[] = response.data.items;
		return sprints;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
}

export const getEpicsBySprintId = async (sprintId: number): Promise<Epic[]> => {
	try {
		const response = await api.get('/epics', { params: { sprintId } });
		const epics: Epic[] = response.data.items;
		return epics;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
}

export const getIssuesByEpicId = async (epicId: number): Promise<Issue[]> => {
	try {
		const response = await api.get('/issues', { params: { epicId } });
		const issues: Issue[] = response.data.items;
		return issues;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
}

export const createProject = async (project: any): Promise<Project> => {
	const response = await api.post('/projects', { "name": project.name, "description": project.description, "identifier": project.identifier, "is_public": project.is_public });
	const newProject: Project = response.data.project;
	return newProject;
	
}