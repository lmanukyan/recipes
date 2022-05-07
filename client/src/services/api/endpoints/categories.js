import axios, { httpBuildQuery } from "../axios";

const endpoints = {
    getAll: (data) => axios.get(`categories/?${httpBuildQuery(data)}`),
    getById: (id) => axios.get(`categories/${id}`),
    create: (data) => axios.post(`categories/create`, data),
    update: (id, data) => axios.put(`categories/${id}`, data),
    delete: (id) => axios.delete(`categories/${id}`),
};

export default endpoints;
