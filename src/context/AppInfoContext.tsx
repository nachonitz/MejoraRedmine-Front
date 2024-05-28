import { createContext } from "react";
import { ExternalApplicationItem } from "../api/models/application";

interface AppInfoProps {
    title: string;
    welcomeText: string;
    getAppInfo: () => void;
    applications: ExternalApplicationItem[];
}

export const AppInfoContext = createContext({} as AppInfoProps);
