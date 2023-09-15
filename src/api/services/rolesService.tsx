import { api } from "../api";
import { ProjectRole } from "../models/role";

export const getRoles = async () => {
    const { data } = await api.get<ProjectRole[]>("/project-roles");
    return data;
};

export const getRoleById = async (id: ProjectRole["id"]) => {
    const { data } = await api.get<ProjectRole>(`/project-roles/${id}`);
    return data;
};
