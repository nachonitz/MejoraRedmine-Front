import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import {
    CreateSprintDto,
    Sprint,
    SprintFilter,
    UpdateSprintDto,
} from "../models/sprint";

export const getSprints = async (filter: SprintFilter) => {
    const { data } = await api.get<ListedResponse<Sprint>>(
        `/sprints?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getSprintById = async (id: Sprint["id"]): Promise<Sprint> => {
    const { data } = await api.get<Sprint>(`/sprints/${id}`);
    return data;
};

export const createSprint = async (sprint: CreateSprintDto) => {
    const { data } = await api.post("/sprints", sprint);
    return data;
};

export const editSprint = async (id: Sprint["id"], sprint: UpdateSprintDto) => {
    const { data } = await api.patch(`/sprints/${id}`, sprint);
    return data;
};

export const deleteSprint = async (id: Sprint["id"]) => {
    const { data } = await api.delete(`/sprints/${id}`);
    return data;
};
