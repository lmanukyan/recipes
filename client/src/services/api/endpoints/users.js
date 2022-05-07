import axios, { httpBuildQuery } from "../axios";

const endpoints = {
    getAll: (data) => axios.get(`users/?${httpBuildQuery(data)}`),
    getById: (id) => axios.get(`users/${id}`),
    create: (data) => axios.post(`users/create`, data),
    update: (id, data) => axios.put(`users/${id}`, data),
    delete: (id) => axios.delete(`users/${id}`),
};

export default endpoints;
