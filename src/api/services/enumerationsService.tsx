import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { Enumeration, EnumerationFilter } from "../models/enumeration";

export const getEnumerations = async (filter: EnumerationFilter) => {
    const { data } = await api.get<Enumeration[]>(
        `/enumerations?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getEnumerationById = async (
    id: Enumeration["id"]
): Promise<Enumeration> => {
    const { data } = await api.get<Enumeration>(`/enumerations/${id}`);
    return data;
};
