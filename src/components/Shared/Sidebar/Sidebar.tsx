import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hasAdminAccess } from "../../../lib/utils";
import Item from "./Item/Item";

interface Props {
    children: ReactNode;
}

const Sidebar = ({ children }: Props) => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const isInPage = (page: string) => {
        return window.location.pathname.includes(page);
    };

    return (
        <>
            <div className="flex h-screen fixed top-header mt-header bg-lightblue w-56 z-10">
                <div className="flex flex-col mt-5 w-full px-[2px] box-border">
                    <Item
                        selected={isInPage("overview")}
                        name="Overview"
                        icon="home-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/overview`);
                        }}
                    />
                    <Item
                        selected={isInPage("dashboard")}
                        name="Dashboard"
                        icon="dashboard-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/dashboard`);
                        }}
                    />
                    <Item
                        selected={isInPage("backlog")}
                        name="Backlog"
                        icon="backlog-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/backlog`);
                        }}
                    />
                    <Item
                        selected={isInPage("document")}
                        name="Documents"
                        icon="documents-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/documents`);
                        }}
                    />
                    <Item
                        selected={isInPage("risks")}
                        name="Risks"
                        icon="risks-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/risks`);
                        }}
                    />
                    {hasAdminAccess() && (
                        <Item
                            selected={isInPage("settings")}
                            name="Settings"
                            icon="settings-icon.png"
                            onClick={() => {
                                navigate(`/project/${projectId}/settings`);
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="ml-56 w-[calc(100%-14rem)]">{children}</div>
        </>
    );
};

export default Sidebar;
