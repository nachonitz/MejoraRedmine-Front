import { api } from "../api";
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