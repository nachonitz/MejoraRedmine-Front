import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import { Issue } from "../models/issue";
import {
    CreateProjectDto,
    Project,
    ProjectFilter,
    UpdateProjectDto,
} from "../models/project";

export const getProjects = async (filter: ProjectFilter) => {
    const { data } = await api.get<ListedResponse<Project>>(
        `/projects?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getProjectById = async (id: Project["id"]) => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
};

export const createProject = async (project: CreateProjectDto) => {
    const { data } = await api.post("/projects", project);
    return data;
};

export const editProject = async (
    id: Project["id"],
    project: UpdateProjectDto
) => {
    const { data } = await api.patch(`/projects/${id}`, project);
    return data;
};

export const deleteProject = async (id: Project["id"]) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
};

//TODO: mover los de abajo a los servicios correspondientes

export const getIssuesByEpicId = async (epicId: number): Promise<Issue[]> => {
    try {
        const response = await api.get("/issues", { params: { epicId } });
        console.log(response.data);
        const issues: Issue[] = response.data.items;
        return issues;
    } catch (error) {
        throw new Error("Error. Please try again.");
    }
};
