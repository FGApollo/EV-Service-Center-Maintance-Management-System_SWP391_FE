// 🔧 Cấu hình API URL cho từng môi trường

// ⚠️ Sửa dòng này để chuyển môi trường nhanh:
const ENV = "render"; // "local" | "render" | "vercel"

// 🖥️ Local backend (khi chạy Node/Express trên localhost)
const LOCAL_API = "http://localhost:10000";

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
