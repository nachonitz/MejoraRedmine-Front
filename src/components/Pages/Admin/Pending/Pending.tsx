import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Searchbar } from "../../../Shared/Searchbar/Searchbar";
import { User } from "../../../../api/models/user";
import { getUsers } from "../../../../api/services/usersService";
import { UsersList } from "./UsersList";

export const Pending = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchText, setSearchText] = useState<string>("");
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
                </div>
                <div className="flex flex-col mt-4 gap-4">
                    <h6>Pending Users: {users.length}</h6>
                    {isLoading ? (
                        <LinearProgress />
                    ) : (
                        <UsersList items={users} />
                    )}
                </div>
            </div>
        </>
    );
};
