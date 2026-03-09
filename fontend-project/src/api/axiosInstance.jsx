import axios from "axios";

let showLoader;
let hideLoader;

export const setPageLoader = (show, hide) => {
  showLoader = show;
  hideLoader = hide;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {

    showLoader && showLoader();

    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => {
    hideLoader && hideLoader();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(

  (response) => {
    hideLoader && hideLoader();
    return response;
  },

  (error) => {

    hideLoader && hideLoader();

    if (error.response?.status === 401) {

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;