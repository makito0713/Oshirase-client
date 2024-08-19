import axiosClient from "./axiosClient";

const keywordApi = {
  create: (params) => axiosClient.post("keywords", params),
  getAll: () => axiosClient.get("keywords"),
  getOne: (id) => axiosClient.get(`keywords/${id}`),
  update: (id, params) => axiosClient.put(`keywords/${id}`, params),
  delete: (id) => axiosClient.delete(`keywords/${id}`),
};

export default keywordApi;
