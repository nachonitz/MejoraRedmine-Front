import { api } from "../api";
import { User } from "../models/user";

export const login = async (
    username: string,
    password: string
): Promise<User> => {
    const response = await api.post("/auth/login", { username, password });
    const user: User = response.data;
    return user;
};

export const register = async (
    username: string,
    password: string,
    email: string,
    firstname: string,
    lastname: string
): Promise<User> => {
    const response = await api.post("/auth/register", {
        login: username,
        password,
        mail: email,
        firstname,
        lastname,
    });
    const newUser: User = response.data.user;
    return newUser;
};

export const logout = (navigate: (path: string) => void) => {
    localStorage.removeItem("api_key");
    navigate("/login");
};
