// 🔧 Cấu hình API URL cho từng môi trường

// ⚠️ Sửa dòng này để chuyển môi trường nhanh:
const ENV = "local"; // "local" | "render" | "vercel"  // ← Chuyển sang "local" để dùng backend local

// 🖥️ Local backend (khi chạy Node/Express trên localhost)
// Sử dụng relative path để Vite proxy xử lý (tránh CORS)
const LOCAL_API = ""; // Empty string = relative path, Vite proxy sẽ forward đến http://localhost:8080

// ☁️ Backend Render (deploy online)
const RENDER_API = "https://ev-service-center-maintance-management-um2j.onrender.com";

// 🌐 Khi frontend deploy lên Vercel
const VERCEL_API = "https://ev-service-center-maintance-management-um2j.onrender.com"; // có thể thay link khác nếu backend khác

// 🧠 Chọn API_BASE theo ENV
let API_BASE;

switch (ENV) {
  case "local":
    API_BASE = LOCAL_API;
    break;
  case "vercel":
    API_BASE = VERCEL_API;
    break;
  default:
    API_BASE = RENDER_API;
}

export const CONFIG = {
  ENV,
  API_BASE,
};
