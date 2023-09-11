import { api } from "../api";
import { Enumeration } from "../models/enumeration";
import { Issue, IssueStatus } from "../models/issue";
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

export const getAllIssues = async (projectId: number): Promise<Issue[]> => {
	const response = await api.get("/issues" , {params: { projectId: projectId }});
	const issues: Issue[] = response.data.items;
	console.log(issues)
	return issues;
};

export const getIssuesPriorities = async (): Promise<Enumeration[]> => {
    const response = await api.get("/enumerations", {
        params: { type: "IssuePriority" },
    });
    console.log(response);
    const priorities: Enumeration[] = response.data;
    return priorities;
};

export const getIssuesStatuses = async (): Promise<IssueStatus[]> => {
    const response = await api.get("/issues/statuses");
    const statuses: IssueStatus[] = response.data;
    return statuses;
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
        statusId: issue.statusId,
        assigneeId: issue.assigneeId,
        estimation: issue.estimation,
    });
    const newIssue: Issue = response.data;
    return newIssue;
};

export const editIssue = async (issue: any): Promise<Issue> => {
    const response = await api.patch(`/issues/${issue.id}`, {
        subject: issue.subject,
        description: issue.description,
        priority: issue.priority,
        estimation: issue.estimation,
        statusId: issue.statusId,
        priorityId: issue.priorityId,
        trackerId: issue.trackerId,
    });
    const editedIssue: Issue = response.data.issue;
    return editedIssue;
};

export const deleteIssue = async (issueId: number): Promise<boolean> => {
    const response = await api.delete(`/issues/${issueId}`);
    return true;
};

export const changeIssueStatus = async (issueId: number, statusId: number): Promise<Issue> => {
    const response = await api.patch(`/issues/${issueId}`, {
        statusId: statusId,
    });
    const editedIssue: Issue = response.data.issue;
    return editedIssue;
}