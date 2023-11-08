import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hasAdminAccess } from "../../../lib/utils";
import Item from "./Item/Item";

interface Props {
    children: ReactNode;
}

const AdminSidebar = ({ children }: Props) => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    return (
        <>
            <div className="flex h-screen fixed top-header mt-header bg-lightblue w-56">
                <div className="flex flex-col mt-5 w-full px-[2px] box-border">
                    <Item
                        name="Information"
                        icon="information.png"
                        onClick={() => {
                            navigate(`/admin/information`);
                        }}
                    />
                    <Item
                        name="Users"
                        icon="users.png"
                        onClick={() => {
                            navigate(`/admin/users`);
                        }}
                    />
                    <Item
                        name="Settings"
                        icon="settings-icon.png"
                        onClick={() => {
                            navigate(`/project/${projectId}/backlog`);
                        }}
                    />
                </div>
            </div>
            <div className="ml-56 w-full">{children}</div>
        </>
    );
};

export default AdminSidebar;
