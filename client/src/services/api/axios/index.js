import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL
});

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');
		if(accessToken){
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		config.headers['Content-Type'] = 'application/json';
		return config;
	},
	(error) => Promise.reject(error)
);

export const httpBuildQuery = (data) => {
	return qs.stringify(data);
}

export const uploadConfig = {
	headers: { 'Content-Type': 'multipart/form-data' }
}

export default axiosInstance;
