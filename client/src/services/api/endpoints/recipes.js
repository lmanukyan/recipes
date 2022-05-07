import axios, { httpBuildQuery } from "../axios";

const endpoints = {
    getAll: (data) => axios.get(`recipes/?${httpBuildQuery(data)}`),
    getById: (id) => axios.get(`recipes/${id}`),
    getBySlug: (slug) => axios.get(`recipes/u/${slug}`),
    create: (data) => axios.post(`recipes/create`, data),
    update: (id, data) => axios.put(`recipes/${id}`, data),
    delete: (id) => axios.delete(`recipes/${id}`),
};

export default endpoints;
