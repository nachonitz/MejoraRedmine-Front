import { createContext } from 'react';

interface UserContextProps {
    user: any;
    login: (username:string, password:string) => Promise<boolean>;
    register: (username:string, password:string, email: string, firstname: string, lastname: string) => Promise<any>;
    isLoggedIn: boolean;
    logout: () => void;
}

export const UserContext = createContext({} as UserContextProps);