import { api } from "../api";
import {
    ApplicationInfo,
    ExternalApplicationItem,
} from "../models/application";

export const getApps = async (): Promise<ExternalApplicationItem[]> => {
    const { data } = await api.get<ExternalApplicationItem[]>(
        "/application/apps"
    );
    return data;
};

export const getAppInfo = async (): Promise<ApplicationInfo> => {
    const { data } = await api.get<ApplicationInfo>("/application/info");
    return data;
};

export const updateAppInfo = async (
    info: ApplicationInfo
): Promise<ApplicationInfo> => {
    const { data } = await api.patch<ApplicationInfo>("/application/info", {
        settings: [
            {
                name: "app_title",
                value: info.app_title,
            },
            {
                name: "welcome_text",
                value: info.welcome_text,
            },
        ],
    });
    return data;
};
