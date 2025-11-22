import axiosClient from "./axiosClient";
import { createApi } from "./baseApi";

export const lessonApi = {
  ...createApi("lessons"),

  updateLesson(id, formData) {
    return axiosClient.put(`/lessons/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
