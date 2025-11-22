import axiosClient from "./axiosClient";

export const enrollmentApi = {
  enroll(data) {
    return axiosClient.post("/enrollments", data);
  },

  updateEnrollment(data) {
    return axiosClient.put("/enrollments", data);
  },

  deleteEnrollment(data) {
    return axiosClient.delete("/enrollments", { data });
  }
};
