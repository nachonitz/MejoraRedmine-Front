import { api } from "../api";
import { Project } from "../models/project";
import { Release } from "../models/release";

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