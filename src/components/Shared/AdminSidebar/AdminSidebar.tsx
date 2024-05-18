import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Item from "./Item/Item";

interface Props {
    children: ReactNode;
}

const AdminSidebar = ({ children }: Props) => {
    const navigate = useNavigate();

    const isInPage = (page: string) => {
        return window.location.pathname.includes(page);
    };

    return (
        <>
            <div className="flex h-screen fixed top-header mt-header bg-lightblue w-56 z-10">
                <div className="flex flex-col mt-5 w-full px-[2px] box-border">
                    <Item
                        selected={isInPage("/admin/settings")}
                        name="Settings"
                        icon="settings-icon.png"
                        onClick={() => {
                            navigate(`/admin/settings`);
                        }}
                    />
                    <Item
                        selected={isInPage("/admin/users")}
                        name="Users"
                        icon="users.png"
                        onClick={() => {
                            navigate(`/admin/users`);
                        }}
                    />
                </div>
            </div>
            <div className="ml-56 flex flex-1">{children}</div>
        </>
    );
};

export default AdminSidebar;
