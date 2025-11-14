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
          try {
            // Avoid removing token immediately to prevent race conditions where
            // multiple concurrent requests cause one to clear credentials and
            // others to fail without a token. Instead, dispatch a single
            // 'app:logout' event and let application-level logic handle clearing
            // storage and redirecting the user in a controlled manner.
            console.warn('🔐 Token looks invalid/expired — dispatching logout event for app to handle.');

            try {
              // Use a sessionStorage flag to avoid dispatching the event repeatedly
              if (!sessionStorage.getItem('app_logout_dispatched')) {
                sessionStorage.setItem('app_logout_dispatched', '1');
                window.dispatchEvent(new CustomEvent('app:logout', { detail: { reason: backendMessage, status } }));
              }
            } catch (e) {
              console.warn('Unable to dispatch app:logout event:', e);
            }

            // Do NOT clear localStorage or redirect here to avoid mid-flight races.
            // Application root should clear tokens and redirect when it receives
            // the 'app:logout' event.
          } catch (e) {
            console.error('Error handling token-expiry notification:', e);
          }
        }
      }
    }
    
    // Luôn reject error để component có thể xử lý
    return Promise.reject(error);
  }
);

export default axiosClient;
