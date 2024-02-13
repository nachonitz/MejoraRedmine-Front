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

    return (
        <>
            <div className="flex h-screen fixed top-header mt-header bg-lightblue w-56">
                <div className="flex flex-col mt-5 w-full px-[2px] box-border">
                    <Item
                        name="Home"
                        icon="home-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}`);
                        }}
                    />
                    <Item
                        name="Dashboard"
                        icon="dashboard-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/dashboard`);
                        }}
                    />
                    <Item
                        name="Backlog"
                        icon="backlog-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/backlog`);
                        }}
                    />
                    <Item
                        name="Documents"
                        icon="documents-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/documents`);
                        }}
                    />
                    <Item
                        name="Risks"
                        icon="risks-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/risks`);
                        }}
                    />
                    {hasAdminAccess() && (
                        <Item
                            name="Settings"
                            icon="settings-icon.png"
                            onClick={() => {
                                navigate(`/project/${projectId}/settings`);
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="ml-56 w-full">{children}</div>
        </>
    );
};

export default Sidebar;
