import { LinearProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Searchbar } from "../../../Shared/Searchbar/Searchbar";
import { PendingUser } from "../../../../api/models/user";
import {
    getPendingUsers,
    getUsers,
} from "../../../../api/services/usersService";
import { UsersList } from "./UsersList";
import { UsersContext } from "../../../../context/UsersContext";

export const Pending = () => {
    const { pendingUsers, pendingUsersCount, isLoading } =
        useContext(UsersContext);

    return (
        <>
            <div className="w-full mt-4">
                {/* <div className="flex gap-x-6">
                    <Searchbar onChange={setSearchText} onSearch={search} />
                </div> */}
                <div className="flex flex-col mt-4 gap-4">
                    <h6>Pending Users: {pendingUsersCount}</h6>
                    {isLoading ? (
                        <LinearProgress />
                    ) : (
                        <UsersList items={pendingUsers} />
                    )}
                </div>
            </div>
        </>
    );
};
