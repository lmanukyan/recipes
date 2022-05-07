import axios, { httpBuildQuery, uploadConfig } from "../axios";

const endpoints = {
    getAll: (data) => axios.get(`media/?${httpBuildQuery(data)}`),
    getById: (id) => axios.get(`media/${id}`),
    upload: (data) => axios.post(`media/upload`, data, uploadConfig),
    delete: (id) => axios.delete(`media/${id}`),
};

export default endpoints;
