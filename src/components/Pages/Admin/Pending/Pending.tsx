import { LinearProgress } from "@mui/material";
import { useContext } from "react";
import { UsersContext } from "../../../../context/UsersContext";
import { UsersList } from "./UsersList";

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
