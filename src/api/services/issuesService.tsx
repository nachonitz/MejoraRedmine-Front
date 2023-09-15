import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import {
    CreateIssueDto,
    Issue,
    IssueFilter,
    IssueStatus,
    UpdateIssueDto,
} from "../models/issue";
import { Tracker } from "../models/tracker";

export const getIssues = async (filter: IssueFilter) => {
    const { data } = await api.get<ListedResponse<Issue>>(
        `/issues?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getIssueById = async (id: Issue["id"]): Promise<Issue> => {
    const { data } = await api.get<Issue>(`/issues/${id}`);
    return data;
};

export const createIssue = async (issue: CreateIssueDto) => {
    const { data } = await api.post("/issues", issue);
    return data;
};

export const editIssue = async (id: Issue["id"], issue: UpdateIssueDto) => {
    const { data } = await api.patch(`/issues/${id}`, issue);
    return data;
};

export const deleteIssue = async (id: Issue["id"]) => {
    const { data } = await api.delete(`/issues/${id}`);
    return data;
};

export const getTrackers = async (): Promise<Tracker[]> => {
    const { data } = await api.get<Tracker[]>("/trackers");
    return data;
};

export const getIssuesStatuses = async (): Promise<IssueStatus[]> => {
    const { data } = await api.get<IssueStatus[]>("/issues/statuses");
    return data;
};
