import axios from "axios";
import { toast } from "vue3-toastify";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Có lỗi xảy ra. Vui lòng thử lại!";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // server có trả message thì ưu tiên dùng
      if (data?.message) message = data.message;

      switch (status) {
        case 400: message = message || "Dữ liệu không hợp lệ"; break;
        case 401: message = "Bạn chưa đăng nhập"; break;
        case 403: message = "Bạn không có quyền"; break;
        case 404: message = "Không tìm thấy tài nguyên"; break;
        case 500: message = "Lỗi server"; break;
      }
    } else {
      message = "Không thể kết nối tới server!";
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosClient;
