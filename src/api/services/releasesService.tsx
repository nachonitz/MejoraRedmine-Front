import { api } from "../api";
import { Release } from "../models/release";


export const getReleasae = async (releaseId: number): Promise<Release> => {
	const response = await api.get(`/releases/${releaseId}`);
	const release: Release = response.data;
	return release;
}

export const createRelease = async (release: any): Promise<Release> => {
	const response = await api.post('/releases', { "name": release.name, "description": release.description, "startDate": release.startDate, "endDate": release.endDate, "projectId": release.projectId });
	const newRelease: Release = response.data.release;
	return newRelease;
}

// export const editProject = async (project: any): Promise<Project> => {
// 	const response = await api.patch(`/projects/${project.id}`, { "name": project.name, "description": project.description, "identifier": project.identifier, "is_public": project.is_public });
// 	const editedProject: Project = response.data.project;
// 	return editedProject;
// }

export const editRelease = async (release: any): Promise<Release> => {
	const response = await api.patch(`/releases/${release.id}`, { "name": release.name, "description": release.description, "startDate": release.startDate, "endDate": release.endDate });
	const editedRelease: Release = response.data.release;
	return editedRelease;
}

export const deleteRelease = async (releaseId: number): Promise<boolean> => {
	const response = await api.delete(`/releases/${releaseId}`);
	console.log(response);
	return true;
}