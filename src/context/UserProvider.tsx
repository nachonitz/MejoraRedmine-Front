import { useState, useEffect } from 'react';
import { UserContext } from "./UserContext";
import { login as loginService, register as registerService } from "../api/services/authService";
import { api } from "../api/api";

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [apiKey, setApiKey] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {  
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
            setUser(JSON.parse(userStorage));
            setIsLoggedIn(true);
        }
    }, []);

    const login = async (username:string, password:string): Promise<boolean> => {
        try {
            const response = await loginService(username, password);
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                setIsLoggedIn(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw new Error('Error. Please try again.');
        }
    }

    const register = async (username:string, password:string, email: string, firstname: string, lastname: string): Promise<any> => {
        try {
            const response = await registerService(username, password, email, firstname, lastname);
            return {
                "status": response.status,
                "errors": response.data.errors
            }
        } catch (error) {
            throw new Error('Error. Please try again.');
        }
    };

    const logout = () => {  
        localStorage.removeItem('user');
        setUser(null);
        setApiKey(null);
        setIsLoggedIn(false);
    }

    return (
        <UserContext.Provider value={ { user, login, register, isLoggedIn, logout } }>
            {children}
        </UserContext.Provider>
    )
}