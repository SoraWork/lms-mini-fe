import axiosClient from "./axiosClient";

export const createApi = (resource) => ({
  search(params) {
    return axiosClient.get(`/${resource}/search`, { params });
  },

  get(id) {
    return axiosClient.get(`/${resource}/${id}`);
  },

  create(data, isFormData = false) {
    return axiosClient.post(`/${resource}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
  },

  update(id, data, isFormData = false) {
    return axiosClient.put(`/${resource}/${id}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
  },

  delete(id) {
    return axiosClient.delete(`/${resource}/${id}`);
  },
});
