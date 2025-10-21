import axios from "axios";
import { CONFIG } from "./config";

const axiosClient = axios.create({
  baseURL: CONFIG.API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Gắn token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
