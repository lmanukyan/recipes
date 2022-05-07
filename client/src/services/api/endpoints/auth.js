import axios from "../axios";

const endpoints = {
    getProfile: () => axios.get('auth/profile'),
    register: (data) => axios.post('auth/register', data),
    login: (data) => axios.post('auth/login', data),
    reset: (data) => axios.post('auth/reset', data),
    change: (data) => axios.post('auth/change', data),
};

export default endpoints;
