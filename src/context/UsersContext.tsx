import { createContext } from "react";
import { PendingUser, User, UserFilter } from "../api/models/user";

interface UsersContextProps {
    users: User[];
    getUsers: (userFilters: UserFilter) => void;
    pendingUsers: PendingUser[];
    pendingUsersCount: number;
    getPendingUsers: () => void;
    isLoading: boolean;
}

export const UsersContext = createContext({} as UsersContextProps);
