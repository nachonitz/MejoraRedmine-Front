import { createContext } from 'react';
import { RegisterResponse } from '../api/models/register-response';

interface UserContextProps {
    user: any;
    login: (username:string, password:string) => Promise<boolean>;
    register: (username:string, password:string, email: string, firstname: string, lastname: string) => Promise<RegisterResponse>;
    isLoggedIn: boolean;
    logout: () => void;
}

export const UserContext = createContext({} as UserContextProps);