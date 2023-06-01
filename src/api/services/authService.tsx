import { api } from "../api";

export const login = async (username:string, password:string) => {
	try {
		const response = await api.post('/auth/login', { username, password });
		return response.data;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};