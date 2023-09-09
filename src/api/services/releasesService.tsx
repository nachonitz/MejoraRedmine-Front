import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import {
    CreateReleaseDto,
    Release,
    ReleaseFilter,
    UpdateReleaseDto,
} from "../models/release";

export const getReleases = async (filter: ReleaseFilter) => {
    const { data } = await api.get<ListedResponse<Release>>(
        `/releases?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getReleaseById = async (id: Release["id"]): Promise<Release> => {
    const { data } = await api.get<Release>(`/releases/${id}`);
    return data;
};

export const createRelease = async (
    release: CreateReleaseDto
): Promise<Release> => {
    const { data } = await api.post("/releases", release);
    return data;
};

export const editRelease = async (
    id: Release["id"],
    release: UpdateReleaseDto
): Promise<Release> => {
    const { data } = await api.patch(`/releases/${id}`, release);
    return data;
};

export const deleteRelease = async (id: number): Promise<Release> => {
    const { data } = await api.delete(`/releases/${id}`);
    return data;
};
