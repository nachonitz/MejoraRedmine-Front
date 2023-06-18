import axios from 'axios';
import { User } from './models/user';

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

export { axiosInstance as api };