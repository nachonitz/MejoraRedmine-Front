import { LinearProgress } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";

import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { Searchbar } from "../../../Shared/Searchbar/Searchbar";
import { User, UserFilter } from "../../../../api/models/user";
import { UsersList } from "./UsersList";
import { CreateUserDialog } from "./CreateUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { UsersContext } from "../../../../context/UsersContext";

const defaultFilters: UserFilter = {
    page: 1,
    limit: 10,
};

export const RedmineUsers = () => {
    const { users, getUsers, isLoading } = useContext(UsersContext);
    const [searchText, setSearchText] = useState<string>("");
    const [openCreateUser, setOpenCreateUser] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [filters, setFilters] = useState<UserFilter>(defaultFilters);

    const handleCloseDialog = (refresh?: boolean) => {
        setOpenCreateUser(false);
        setOpenEditUser(false);
        if (refresh) {
            const filter = { ...filters, login: searchText };
            getUsers(filter);
        }
        setSelectedUser(undefined);
        setSelectedUser(undefined);
    };

    const componentWillUnmount = useRef(false);

    useEffect(() => {
        componentWillUnmount.current = false;
        return () => {
            componentWillUnmount.current = true;
        };
    }, []);

    useEffect(() => {
        return () => {
            if (componentWillUnmount.current) {
                if (searchText) {
                    getUsers(defaultFilters);
                }
            }
        };
    }, [searchText, getUsers]);

    const handleSearch = () => {
        const filter = { ...filters, login: searchText };
        getUsers(filter);
    };

    return (
        <>
            <div className="w-full mt-4">
                <div className="flex gap-x-6">
                    <Searchbar
                        onChange={setSearchText}
                        onSearch={handleSearch}
                    />
                    <PrimaryButton onClick={() => setOpenCreateUser(true)}>
                        New User
                    </PrimaryButton>
                </div>
                <div className="flex flex-col mt-4 gap-4">
                    <h6>Users: {users.length}</h6>
                    {isLoading ? (
                        <LinearProgress />
                    ) : (
                        <UsersList
                            items={users}
                            onSelected={(user) => setSelectedUser(user)}
                            onEdit={() => setOpenEditUser(true)}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                </div>
            </div>
            {openCreateUser && (
                <CreateUserDialog
                    open={openCreateUser}
                    onClose={handleCloseDialog}
                />
            )}

            {selectedUser && (
                <EditUserDialog
                    user={selectedUser}
                    open={openEditUser}
                    onClose={handleCloseDialog}
                />
            )}
        </>
    );
};
