import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import { CreateEpicDto, Epic, EpicFilter, UpdateEpicDto } from "../models/epic";

export const getEpics = async (filter: EpicFilter) => {
    const { data } = await api.get<ListedResponse<Epic>>(
        `/epics?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getEpicById = async (id: Epic["id"]): Promise<Epic> => {
    const { data } = await api.get<Epic>(`/epics/${id}`);
    return data;
};

export const createEpic = async (epic: CreateEpicDto) => {
    const { data } = await api.post("/epics", epic);
    return data;
};

export const editEpic = async (id: Epic["id"], epic: UpdateEpicDto) => {
    const { data } = await api.patch(`/epics/${id}`, epic);
    return data;
};

export const deleteEpic = async (id: Epic["id"]): Promise<boolean> => {
    const { data } = await api.delete(`/epics/${id}`);
    return data;
};
