import { useState, useEffect } from 'react';
import { UserContext } from "./UserContext";
import { login as loginService, register as registerService } from "../api/services/authService";
import { api } from "../api/api";
import { User } from '../api/models/user';
import { useNavigate } from 'react-router-dom';

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [apiKey, setApiKey] = useState(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {  
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
            setUser(JSON.parse(userStorage));
            setIsLoggedIn(true);
        }
    }, []);

    const login = async (username:string, password:string): Promise<boolean> => {
        const user = await loginService(username, password);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setIsLoggedIn(true);
            return true;
        } else {
            return false;
        }
    }

    const register = async (username:string, password:string, email: string, firstname: string, lastname: string): Promise<boolean> => {
        const response = await registerService(username, password, email, firstname, lastname);
        if (response) {
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {  
        localStorage.removeItem('user');
        setUser(null);
        setApiKey(null);
        setIsLoggedIn(false);
        navigate('/login');
    }

    return (
        <UserContext.Provider value={ { user, login, register, isLoggedIn, logout } }>
            {children}
        </UserContext.Provider>
    )
}