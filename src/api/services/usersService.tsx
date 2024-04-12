import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import {
    CreateUserDto,
    PendingUser,
    UpdateUserDto,
    User,
    UserFilter,
} from "../models/user";

export const getUsers = async (filter: UserFilter) => {
    const { data } = await api.get<ListedResponse<User>>(
        `/users?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getUserById = async (id: User["id"]): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
};

export const createUser = async (user: CreateUserDto): Promise<User> => {
    const { data } = await api.post("/users", user);
    return data;
};

export const editUser = async (
    id: User["id"],
    user: UpdateUserDto
): Promise<User> => {
    const { data } = await api.patch(`/users/${id}`, user);
    return data;
};

export const deleteUser = async (id: User["id"]): Promise<User> => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
};

export const getPendingUsers = async () => {
    const { data } = await api.get<PendingUser[]>(`/users/pending`);
    return { data };
};
