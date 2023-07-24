import { api } from "../api";
import { Issue } from "../models/issue";


export const getIssueById = async (issueId: number): Promise<Issue> => {
	const response = await api.get(`/issues/${issueId}`);
	const issue: Issue = response.data;
	return issue;
}

// export const createEpic = async (epic: any): Promise<Epic> => {
// 	const response = await api.post('/epics', 
// 		{
// 			"name": epic.name,
// 			"description": epic.description,
// 			"priority": epic.priority,
// 			"projectId": epic.projectId,
// 			"releaseId": epic.releaseId,
// 			"sprintId": epic.sprintId
// 		}
// 	);
// 	const newEpic: Epic = response.data;
// 	return newEpic;
// }
// export const editEpic = async (epic: any): Promise<Epic> => {
// 	const response = await api.patch(`/epics/${epic.id}`, { "name": epic.name, "description": epic.description, "priority": epic.priority });
// 	const editedEpic: Epic = response.data.epic;
// 	return editedEpic;
// }

export const deleteIssue = async (issueId: number): Promise<boolean> => {
	const response = await api.delete(`/issues/${issueId}`);
	return true;
}