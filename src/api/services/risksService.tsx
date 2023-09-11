import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import { CreateRiskDto, Risk, RiskFilter, UpdateRiskDto } from "../models/risk";

export const getRisks = async (filter: RiskFilter) => {
    const { data } = await api.get<ListedResponse<Risk>>(
        `/risks?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getRiskById = async (id: number): Promise<Risk> => {
    const { data } = await api.get<Risk>(`/risks/${id}`);
    return data;
};

export const createRisk = async (risk: CreateRiskDto) => {
    const { data } = await api.post("/risks", risk);
    return data;
};

export const editRisk = async (
    id: Risk["id"],
    risk: UpdateRiskDto
): Promise<Risk> => {
    const { data } = await api.patch(`/risks/${id}`, risk);
    return data;
};

export const deleteRisk = async (id: number) => {
    const { data } = await api.delete(`/risks/${id}`);
    return data;
};
