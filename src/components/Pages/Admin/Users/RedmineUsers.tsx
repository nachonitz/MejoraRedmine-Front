import {
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
} from "@mui/material";
import { useEffect, useState } from "react";

import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import DeleteDialog from "../../../Shared/DeleteDialog/DeleteDialog";
import { Searchbar } from "../../../Shared/Searchbar/Searchbar";
import { User } from "../../../../api/models/user";
import { getUsers } from "../../../../api/services/usersService";
import { UsersList } from "./UsersList";

export const RedmineUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [openCreateUser, setOpenCreateUser] = useState(false);
    const [openEditUser, setOpenEditUser] = useState(false);
    const [openDeleteUser, setOpenDeleteUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(false);

    const search = async () => {
        setIsLoading(true);
        const { data } = await getUsers({
            login: searchText,
        });
        setIsLoading(false);
        setUsers(data.items);
    };

    const getAllUsers = async () => {
        setIsLoading(true);
        const { data } = await getUsers({});
        setIsLoading(false);
        setUsers(data.items);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <>
            <div className="w-full mt-4">
                <div className="flex gap-x-6">
                    <Searchbar onChange={setSearchText} onSearch={search} />
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
                            onDelete={() => setOpenDeleteUser(true)}
                        />
                    )}
                </div>
            </div>
            {/* {openCreateUser && (
                <CreateMemberDialog
                    projectId={projectId}
                    open={openCreateMember}
                    onClose={async () => {
                        setOpenCreateMember(false);
                        await getAllUsers();
                    }}
                />
            )}
            {selectedUser && (
                <>
                    <EditMemberDialog
                        membership={selectedMember}
                        open={openEditMember}
                        onClose={async () => {
                            setOpenEditMember(false);
                            setSelectedMember(undefined);
                            await getAllUsers();
                        }}
                    />
                    <DeleteDialog
                        open={openDeleteMember}
                        id={selectedMember.id}
                        handleClose={async () => {
                            setOpenDeleteMember(false);
                            setSelectedMember(undefined);
                            await getAllUsers();
                        }}
                        deleteFunction={deleteMembership}
                        name={`${selectedMember.user.login}'s membership to ${selectedMember.project.name}`}
                    />
                </>
            )} */}
        </>
    );
};
