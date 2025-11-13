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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Request with token to:', config.url);
  } else {
    console.warn('⚠️ No token found for request to:', config.url);
  }
  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// ✅ Xử lý lỗi 401/403 - Token hết hạn
axiosClient.interceptors.response.use(
  (response) => {
    // Response thành công, trả về data
    console.log('✅ API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // Xử lý lỗi response
    if (error.response) {
      const { status, config } = error.response;
      console.error('❌ API Error:', config.url, 'Status:', status);
      console.error('❌ Error details:', error.response.data);
      
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
          console.warn('🔐 Token error detected. Please login again.');
          
          // Alert user to login again
          alert('⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          
          // Clear token và user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Reload page to force re-login
          window.location.href = '/';
        }
      }
    } else if (error.request) {
      console.error('❌ No response received:', error.message);
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    
    // Luôn reject error để component có thể xử lý
    return Promise.reject(error);
  }
);

export default axiosClient;
