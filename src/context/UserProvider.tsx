import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../api/models/user";
import {
  login as loginService,
  register as registerService,
} from "../api/services/authService";
import { UserContext } from "./UserContext";

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      setUser(JSON.parse(userStorage));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const user = await loginService(username, password);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsLoggedIn(true);
      return true;
    } else {
      return false;
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string,
    firstname: string,
    lastname: string
  ): Promise<boolean> => {
    const response = await registerService(
      username,
      password,
      email,
      firstname,
      lastname
    );
    if (response) {
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setApiKey(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, register, isLoggedIn, logout }}>
      {children}
    </UserContext.Provider>
  );
};
