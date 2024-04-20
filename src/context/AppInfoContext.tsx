import { createContext } from "react";

interface AppInfoProps {
    title: string;
    welcomeText: string;
    getAppInfo: () => void;
}

export const AppInfoContext = createContext({} as AppInfoProps);
