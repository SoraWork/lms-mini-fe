import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/students",
});

export const studentApi = {
  getStudents(params) {
    return api.get("/search", { params });
  },
  createStudent(data) {
    return api.post("", data);
  },
  updateStudent(id, data) {
    return api.put(`/${id}`, data);
  },
  deleteStudent(id) {
    return api.delete(`/${id}`);
  },
};
