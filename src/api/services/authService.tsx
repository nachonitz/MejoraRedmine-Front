import { api } from "../api";

export const login = async (username:string, password:string): Promise<any> => {
	try {
		const response = await api.post('/auth/login', { username, password });
		return response.data;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const register = async (username:string, password:string, email: string, firstname: string, lastname: string): Promise<any> => {
	try {
		const response = await api.post('/auth/register', { "login": username, password, "mail": email, firstname, lastname });
		return response.data;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const logout = (navigate: (path: string) => void) => {
	localStorage.removeItem('api_key');
	navigate('/login');
}