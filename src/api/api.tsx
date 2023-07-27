import axios, { AxiosError } from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: serverUrl,
    timeout: 100000,
});

axiosInstance.interceptors.request.use(
    (config) => {
		const user = localStorage.getItem('user');
	
		if (user) {
			config.headers.Authorization = `Bearer ${JSON.parse(user).api_key}`;
		}
	
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: any) => {
		console.log(error)
		if (error.response) {
			var newError = { status: error.response?.data?.statusCode, messages: error.response?.data?.message }
			console.log(newError)
			throw { status: error.response?.data?.statusCode, messages: error.response?.data?.message };
		} else if (error.request) {
			// Error de solicitud (no se recibió respuesta del servidor)
			console.log(error.request);
		} else {
			// Otro tipo de error de Axios
			console.log(error.message);
		}
		return Promise.reject(error);
	}
);


export { axiosInstance as api };