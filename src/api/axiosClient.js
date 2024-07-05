import axios from "axios";

const BASE_URL = "https://protean-unity-423404-t2.an.r.appspot.com/api/v1";
const getToken = () => localStorage.getItem("token");

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    if (!error.response) {
      alert('Network error');
    } else if (error.response.status === 401) {
      alert('Unauthorized access - please log in again');
      // 必要に応じてリダイレクトなどを行う
    }
    return Promise.reject(error.response);
  }
);

export default axiosClient;