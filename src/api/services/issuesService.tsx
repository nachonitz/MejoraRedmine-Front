import { api } from "../api";
import { Enumeration } from "../models/enumeration";
import { Issue } from "../models/issue";
import { Tracker } from "../models/tracker";

export const getIssueById = async (issueId: number): Promise<Issue> => {
    const response = await api.get(`/issues/${issueId}`);
    const issue: Issue = response.data;
    return issue;
};

export const getTrackers = async (): Promise<Tracker[]> => {
    const response = await api.get("/trackers");
    const trackers: Tracker[] = response.data;
    return trackers;
};

export const getIssuesPriorities = async (): Promise<Enumeration[]> => {
    const response = await api.get("/enumerations", {
        params: { type: "IssuePriority" },
    });
    console.log(response);
    const priorities: Enumeration[] = response.data;
    return priorities;
};

export const createIssue = async (issue: any): Promise<Issue> => {
    const response = await api.post("/issues", {
        subject: issue.subject,
        description: issue.description,
        priorityId: issue.priorityId,
        trackerId: issue.trackerId,
        projectId: issue.projectId,
        releaseId: issue.releaseId,
        sprintId: issue.sprintId,
        epicId: issue.epicId,
        statusId: 1,
        assigneeId: issue.assigneeId,
        estimation: issue.estimation,
    });
    const newIssue: Issue = response.data;
    return newIssue;
};
// export const editEpic = async (epic: any): Promise<Epic> => {
// 	const response = await api.patch(`/epics/${epic.id}`, { "name": epic.name, "description": epic.description, "priority": epic.priority });
// 	const editedEpic: Epic = response.data.epic;
// 	return editedEpic;
// }

export const deleteIssue = async (issueId: number): Promise<boolean> => {
    const response = await api.delete(`/issues/${issueId}`);
    return true;
};
