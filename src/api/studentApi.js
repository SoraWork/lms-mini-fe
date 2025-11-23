import { createApi } from "./baseApi";
import axiosClient from '@/api/axiosClient.js'

export const studentApi = {
  ...createApi("students"),

  updateStudent(formData) {
    const id = formData.get("studentId");
    formData.delete("studentId");
    return createApi("students").update(id, formData, true);
  },
  exportExcel() {
    return axiosClient.get("/students/export", {
      responseType: "arraybuffer" // quan trọng
    });
  }
};
