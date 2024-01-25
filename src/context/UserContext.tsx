import { createContext } from "react";
import { UpdateUserDto, User } from "../api/models/user";

interface UserContextProps {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (
        username: string,
        password: string,
        email: string,
        firstname: string,
        lastname: string
    ) => Promise<boolean>;
    isLoggedIn: boolean;
    logout: () => void;
    updateUser: (id: number, user: UpdateUserDto) => void;
}

export const UserContext = createContext({} as UserContextProps);
