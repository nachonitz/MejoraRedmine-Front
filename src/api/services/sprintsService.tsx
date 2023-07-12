import { api } from "../api";
import { Sprint } from "../models/sprint";


export const getSprint = async (sprintId: number): Promise<Sprint> => {
	const response = await api.get(`/sprints/${sprintId}`);
	const sprint: Sprint = response.data;
	return sprint;
}

export const createSprint = async (sprint: any): Promise<Sprint> => {
	const response = await api.post('/sprints', 
		{
			"name": sprint.name,
			"description": sprint.description,
			"startDate": sprint.startDate,
			"endDate": sprint.endDate,
			"projectId": sprint.projectId,
			"releaseId": sprint.releaseId 
		}
	);
	const newSprint: Sprint = response.data.sprint;
	return newSprint;
}

export const editSprint = async (sprint: any): Promise<Sprint> => {
	const response = await api.patch(`/sprints/${sprint.id}`, { "name": sprint.name, "description": sprint.description, "startDate": sprint.startDate, "endDate": sprint.endDate });
	const editedSprint: Sprint = response.data.sprint;
	return editedSprint;
}

export const deleteSprint = async (sprintId: number): Promise<boolean> => {
	const response = await api.delete(`/sprints/${sprintId}`);
	console.log(response);
	return true;
}