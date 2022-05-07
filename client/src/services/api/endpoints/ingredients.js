import axios, { httpBuildQuery } from "../axios";

const endpoints = {
    getAll: (data) => axios.get(`ingredients/?${httpBuildQuery(data)}`),
    getById: (id) => axios.get(`ingredients/${id}`),
    getLabels: (ids) => axios.post(`ingredients/labels`, ids),
    create: (data) => axios.post(`ingredients/create`, data),
    update: (id, data) => axios.put(`ingredients/${id}`, data),
    delete: (id) => axios.delete(`ingredients/${id}`),
};

export default endpoints;
