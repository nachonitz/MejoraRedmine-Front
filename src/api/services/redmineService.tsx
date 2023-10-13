import { api } from "../api";

export const syncWithRedmine = async () => {
    const { data } = await api.get("/loader/sync");
    return data;
};
