import { useEffect, useState } from "react";
import { ExternalApplicationItem } from "../../../api/models/application";
import { getApps } from "../../../api/services/applicationService";
import { CircularProgress } from "@mui/material";
import { getToken } from "../../../api/api";

interface Props {
    isLoggedIn: boolean;
}

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
        ? text.substring(0, maxLength - 3) + "..."
        : text;
};

export const ExternalAppList = ({ isLoggedIn = false }: Props) => {
    const [applications, setApplications] = useState<ExternalApplicationItem[]>(
        []
    );

    useEffect(() => {
        const fetch = async () => {
            const apps = await getApps();
            setApplications(apps);
        };
        fetch();
    }, []);

    return (
        <div className="flex flex-col gap-1">
            {applications.length === 0 && (
                <CircularProgress
                    sx={{ color: "primary", padding: 0, marginTop: 4 }}
                    size={20}
                />
            )}
            {applications.map((app) => (
                <a
                    className="flex items-center gap-2 p-2 m-1 hover:bg-black/5 rounded-md"
                    href={
                        isLoggedIn ? `${app.url}?token=${getToken()}` : app.url
                    }
                >
                    <img src={app.icon} alt={app.name} className="w-10 h-10" />
                    <div className="flex flex-col">
                        <span className="text-sm">{app.name}</span>
                        <span className="text-xs leading-[1.125] mt-[2px] italic">
                            {truncateText(app.description, 50)}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
};
