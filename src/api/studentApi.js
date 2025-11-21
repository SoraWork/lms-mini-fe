import { createApi } from "./baseApi";

export const studentApi = {
  ...createApi("students"),

  updateStudent(formData) {
    const id = formData.get("studentId");
    formData.delete("studentId");
    return createApi("students").update(id, formData, true);
  }
};
