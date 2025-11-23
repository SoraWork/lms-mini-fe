import axios from "axios";
import { toast } from "vue3-toastify";
import { t } from "@/utils/i18nHelper";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = t("error.unknown");

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data?.message) message = data.message;

      switch (status) {
        case 400: message = message || t("error.invalidData"); break;
        case 401: message = t("error.unauthorized"); break;
        case 403: message = t("error.forbidden"); break;
        case 404: message = t("error.notFound"); break;
        case 500: message = t("error.server"); break;
      }
    } else {
      message = t("error.noConnection");
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosClient;
