import { api } from "../api";
import { Epic } from "../models/epic";


export const getEpic = async (epicId: number): Promise<Epic> => {
	const response = await api.get(`/epics/${epicId}`);
	const epic: Epic = response.data;
	return epic;
}

export const createEpic = async (epic: any): Promise<Epic> => {
	const response = await api.post('/epics', 
		{
			"name": epic.name,
			"description": epic.description,
			"priority": epic.priority,
			"projectId": epic.projectId,
			"releaseId": epic.releaseId,
			"sprintId": epic.sprintId
		}
	);
	const newEpic: Epic = response.data;
	return newEpic;
}
export const editEpic = async (epic: any): Promise<Epic> => {
	const response = await api.patch(`/epics/${epic.id}`, { "name": epic.name, "description": epic.description, "startDate": epic.startDate, "endDate": epic.endDate });
	const editedEpic: Epic = response.data.epic;
	return editedEpic;
}

export const deleteEpic = async (epicId: number): Promise<boolean> => {
	const response = await api.delete(`/epics/${epicId}`);
	return true;
}