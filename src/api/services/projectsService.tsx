import { api } from "../api";
import { Project } from "../models/project";

export const getProjects = async (): Promise<Project[]> => {
	try {
		const response = await api.get('/projects', {});
		const projects: Project[] = response.data.projects;
		return projects;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};