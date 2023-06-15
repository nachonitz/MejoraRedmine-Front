import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: serverUrl,
    timeout: 100000,
});

export { axiosInstance as api };