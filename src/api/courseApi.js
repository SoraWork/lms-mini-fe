import axiosClient from "./axiosClient";
import { createApi } from "./baseApi";

export const courseApi = {
  ...createApi("courses"),

  // GET /api/courses/{id}/lesson
  getCourseDetail(id) {
    return axiosClient.get(`/courses/${id}/lesson`);
  },

  // GET /api/courses/{id}/student
  getStudentsOfCourse(id, params) {
    return axiosClient.get(`/courses/${id}/student`, { params });
  },

  // PUT multipart
  updateCourse(formData) {
    const id = formData.get("courseId");
    formData.delete("courseId");
    return createApi("courses").update(id, formData, true);
  }
};
