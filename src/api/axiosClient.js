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

// ✅ Xử lý lỗi 401/403 - Token hết hạn
axiosClient.interceptors.response.use(
  (response) => {
    // Response thành công, trả về data
    return response;
  },
  (error) => {
    // Xử lý lỗi response
    if (error.response) {
      const { status } = error.response;
      
      // 401 Unauthorized hoặc 403 Forbidden - Token hết hạn hoặc không hợp lệ
      if (status === 401 || status === 403) {
        console.warn('🚫 Token invalid or expired. Status:', status);
        console.warn('🔄 Response data:', error.response.data);
        
        // Kiểm tra xem có phải lỗi token không (không phải lỗi permission)
        const backendMessage = error.response.data?.message || '';
        const isTokenError = 
          backendMessage.toLowerCase().includes('token') ||
          backendMessage.toLowerCase().includes('unauthorized') ||
          backendMessage.toLowerCase().includes('expired') ||
          status === 401;
        
        if (isTokenError) {
          console.warn('🔐 Clearing token and will redirect to login...');
          
          // Chỉ clear token, không redirect ở đây (để component xử lý)
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          
          // Component sẽ tự handle việc redirect
        }
      }
    }
    
    // Luôn reject error để component có thể xử lý
    return Promise.reject(error);
  }
);

export default axiosClient;
