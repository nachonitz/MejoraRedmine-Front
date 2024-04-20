import { ReactNode, useEffect, useState } from "react";
import { getAppInfo } from "../api/services/applicationService";
import { AppInfoContext } from "./AppInfoContext";

interface Props {
    children: ReactNode;
}

export const AppInfoProvider = ({ children }: Props) => {
    const [title, setTitle] = useState<string>("");
    const [welcomeText, setWelcomeText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getApplicationInfo = async () => {
        const info = await getAppInfo();
        setTitle(info.app_title);
        setWelcomeText(info.welcome_text);
    };

    useEffect(() => {
        getApplicationInfo();
    }, []);

    return (
        <AppInfoContext.Provider
            value={{ title, welcomeText, getAppInfo: getApplicationInfo }}
        >
            {children}
        </AppInfoContext.Provider>
    );
};
