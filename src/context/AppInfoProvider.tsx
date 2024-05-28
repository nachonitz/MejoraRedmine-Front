import { ReactNode, useEffect, useState } from "react";
import { getAppInfo, getApps } from "../api/services/applicationService";
import { AppInfoContext } from "./AppInfoContext";
import { ExternalApplicationItem } from "../api/models/application";

interface Props {
    children: ReactNode;
}

export const AppInfoProvider = ({ children }: Props) => {
    const [title, setTitle] = useState<string>("");
    const [welcomeText, setWelcomeText] = useState<string>("");
    const [applications, setApplications] = useState<ExternalApplicationItem[]>(
        []
    );

    const getApplications = async () => {
        const apps = await getApps();
        setApplications(apps);
    };

    const getApplicationInfo = async () => {
        const info = await getAppInfo();
        setTitle(info.app_title);
        setWelcomeText(info.welcome_text);
    };

    useEffect(() => {
        getApplicationInfo();
        getApplications();
    }, []);

    return (
        <AppInfoContext.Provider
            value={{
                title,
                welcomeText,
                getAppInfo: getApplicationInfo,
                applications,
            }}
        >
            {children}
        </AppInfoContext.Provider>
    );
};
