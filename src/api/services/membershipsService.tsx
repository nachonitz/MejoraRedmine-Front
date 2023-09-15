import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import {
    CreateProjectMembershipDto,
    ProjectMembership,
    ProjectMembershipFilter,
    UpdateProjectMembershipDto,
} from "../models/membership";

export const getMemberships = async (filters: ProjectMembershipFilter) => {
    const { data } = await api.get<ListedResponse<ProjectMembership>>(
        `/memberships?${filterToQueryParams(filters)}`
    );
    return { data };
};

export const getMembershipById = async (id: ProjectMembership["id"]) => {
    const { data } = await api.get<ProjectMembership>(`/memberships/${id}`);
    return data;
};

export const createMembership = async (
    membership: CreateProjectMembershipDto
) => {
    const { data } = await api.post("/memberships", membership);
    return data;
};

export const editMembership = async (
    id: ProjectMembership["id"],
    membership: UpdateProjectMembershipDto
) => {
    const { data } = await api.patch(`/memberships/${id}`, membership);
    return data;
};

export const deleteMembership = async (id: ProjectMembership["id"]) => {
    const { data } = await api.delete(`/memberships/${id}`);
    return data;
};
