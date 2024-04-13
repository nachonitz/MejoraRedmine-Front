import { api } from "../api";
import { ExternalApplicationItem } from "../models/application";

export const getApps = async (): Promise<ExternalApplicationItem[]> => {
    const { data } = await api.get<ExternalApplicationItem[]>(
        "/application/apps"
    );
    return data;
};
