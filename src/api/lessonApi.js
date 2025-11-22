import axiosClient from "./axiosClient";
import { createApi } from "./baseApi";

export const lessonApi = {
  ...createApi("lessons"),

  createLesson(data) {
    return axiosClient.post("/lessons", data);
  },

  updateLesson(id, formData) {
    return axiosClient.put(`/lessons/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
