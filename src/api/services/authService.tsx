import { api } from "../api";
import { RegisterResponse } from "../models/register-response";
import { User } from "../models/user";

export const login = async (username:string, password:string): Promise<User> => {
	try {
		const response = await api.post('/auth/login', { username, password });
		const user: User = response.data.data.user;
		return user;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const register = async (username:string, password:string, email: string, firstname: string, lastname: string): Promise<RegisterResponse> => {
	try {
		const response = await api.post('/auth/register', { "login": username, password, "mail": email, firstname, lastname });
		const registerResponse: RegisterResponse = {
			status: response.data.status,
			errors: response.data.data.errors
		}
		return registerResponse;
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const logout = (navigate: (path: string) => void) => {
	localStorage.removeItem('api_key');
	navigate('/login');
}