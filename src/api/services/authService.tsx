import { useNavigate } from "react-router-dom";
import { api } from "../api";

export const login = async (username:string, password:string): Promise<boolean> => {
	try {
		const response = await api.post('/auth/login', { username, password });
		console.log(response.data.status)
		if (response.data.status === 200) {
			localStorage.setItem('api_key', response.data.data.user.api_key);
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const register = async (username:string, password:string, email: string, firstname: string, lastname: string): Promise<boolean> => {
	try {
		const response = await api.post('/auth/register', { "login": username, password, "mail": email, firstname, lastname });
		console.log(response)
		if (response.data.status === 200) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw new Error('Error. Please try again.');
	}
};

export const logout = (navigate: (path: string) => void) => {
	localStorage.removeItem('api_key');
	navigate('/login');
}