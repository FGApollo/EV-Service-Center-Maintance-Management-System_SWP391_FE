# 🚗 EV Service Center Management System - Frontend

> Hệ thống quản lý trung tâm bảo dưỡng xe điện - Frontend React Application

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.5-purple.svg)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot-green.svg)](https://spring.io/projects/spring-boot)

---

## 📋 Mục Lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Tech Stack](#tech-stack)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Tài liệu](#tài-liệu)
- [Roadmap](#roadmap)
- [Contributors](#contributors)

---

## 🎯 Giới Thiệu

Hệ thống quản lý trung tâm bảo dưỡng xe điện (EV Service Center) là một ứng dụng web toàn diện giúp:
- **Khách hàng**: Đặt lịch bảo dưỡng, quản lý xe, thanh toán online
- **Admin**: Quản lý toàn bộ hệ thống, báo cáo doanh thu, quản lý nhân viên
- **Staff**: Tiếp nhận và xử lý lịch hẹn, phân công kỹ thuật viên
- **Technician**: Nhận công việc, thực hiện bảo dưỡng, ghi nhận linh kiện

---

## ✨ Tính Năng

### 👤 Customer Features
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Quản lý thông tin cá nhân
- ✅ Quản lý xe (thêm, xóa, xem lịch sử bảo dưỡng)
- ⚠️ Đặt lịch bảo dưỡng (cần cập nhật flow)
- ⚠️ Xem lịch hẹn của tôi (cần tạo trang mới)
- ⚠️ Thanh toán online qua VNPay (cần tạo trang mới)

### 👨‍💼 Admin Features
- ⚠️ Dashboard tổng quan với báo cáo (cần tích hợp APIs)
  - Doanh thu, lợi nhuận theo tháng
  - Top dịch vụ phổ biến
  - Top linh kiện dùng nhiều nhất
- ⚠️ Quản lý khách hàng (đã có UI, cần tích hợp API)
- ⚠️ Quản lý nhân viên (cần tạo tab mới)
- ⚠️ Quản lý xe (đã có UI, cần tích hợp API)
- ⚠️ Quản lý lịch hẹn (đã có UI, cần thêm actions)
- ⚠️ Quản lý kho linh kiện (cần thêm CRUD)
- ⚠️ Xem hóa đơn & thanh toán (cần tạo trang mới)

### 👨‍💻 Staff Features
- ⚠️ Xem danh sách lịch hẹn
- ⚠️ Chấp nhận/Hủy lịch hẹn
- ⚠️ Phân công kỹ thuật viên

### 🔧 Technician Features
- ⚠️ Xem công việc được assign (cần cập nhật APIs)
- ⚠️ Bắt đầu/Hoàn thành công việc
- ⚠️ Ghi nhận sử dụng linh kiện
- ⚠️ Xem lịch sử bảo dưỡng

**Chú thích**:
- ✅ Hoàn thành
- ⚠️ Cần cập nhật/bổ sung

---

## 🛠️ Tech Stack

### Frontend
- **React 18.x** - UI Library
- **Vite 7.1.5** - Build Tool & Dev Server
- **Axios** - HTTP Client
- **React Icons** - Icon Library
- **CSS3** - Styling

### Backend
- **Spring Boot** - Java Framework
- **MySQL** - Database
- **JWT** - Authentication
- **Swagger** - API Documentation
- **VNPay** - Payment Gateway

### Deployment
- **Frontend**: Vercel / Netlify (recommended)
- **Backend**: Render (https://ev-service-center-maintance-management-um2j.onrender.com)

---

## 🚀 Cài Đặt

### Prerequisites
- Node.js >= 18.x
- npm hoặc yarn
- Backend API đang chạy (local hoặc Render)

### Installation Steps

1. **Clone repository**
```bash
git clone https://github.com/FGApollo/EV-Service-Center-Maintance-Management-System_SWP391_FE.git
cd EV-Service-Center-Maintance-Management-System_SWP391_FE
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```javascript
// File: src/api/config.js
const ENV = "render"; // Hoặc "local" nếu dùng localhost

// Nếu dùng local:
// 1. Đổi ENV = "local"
// 2. Khởi động backend trên port 8080
```

4. **Start development server**
```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:5173

---

## 📖 Sử Dụng

### 1. Đăng Nhập

**Test Accounts** (nếu backend có sẵn):
```
Admin:
- Email: admin@example.com
- Password: 123456

Staff:
- Email: staff@example.com  
- Password: 123456

Technician:
- Email: tech@example.com
- Password: 123456

Customer:
- Đăng ký tài khoản mới tại trang Login
```

### 2. Navigation

Sau khi đăng nhập, bạn sẽ được redirect đến dashboard tương ứng với role:
- **ROLE_ADMIN** → Admin Dashboard
- **ROLE_STAFF** → Staff Dashboard
- **ROLE_TECHNICIAN** → Technician Dashboard
- **ROLE_CUSTOMER** → Home Page

### 3. Test APIs

Mở Browser Console và test:
```javascript
// Import API module
import * as API from './api/index.js';

// Test login
await API.login({ email: 'admin@example.com', password: '123456' });

// Test get customers
await API.getAllCustomers();

// Test get revenue report
await API.getRevenueReport();
```

---

## 📚 Tài Liệu

### Tài liệu chính
1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Tài liệu đầy đủ 47 APIs
2. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Hướng dẫn triển khai UI
3. **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Tình trạng dự án & roadmap

### Tài liệu API
- **Local Swagger**: http://localhost:8080/swagger-ui/index.html
- **Production**: https://ev-service-center-maintance-management-um2j.onrender.com/swagger-ui/index.html

### Code Structure
```
src/
├── api/                      # API Integration
│   ├── index.js             # 47 API functions
│   ├── axiosClient.js       # Axios config với JWT interceptor
│   └── config.js            # Environment config
├── components/              # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   └── ImageSlider.jsx
├── pages/                   # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── MyCar.jsx
│   ├── BookingPage.jsx
│   ├── AdminDashboard.jsx
│   ├── StaffDashboard.jsx
│   └── TechnicianDashboard.jsx
├── App.jsx                  # Main app với routing
└── main.jsx                 # Entry point
```

---

## 🗺️ Roadmap

### Phase 1: Core Features (3-4 ngày) 🔴 HIGH PRIORITY
- [ ] Admin Dashboard - Overview & Reports với real-time APIs
- [ ] Booking Page - Hoàn thiện full flow đặt lịch
- [ ] Technician Dashboard - Cập nhật APIs mới
- [ ] Admin Dashboard - Appointments Management với actions

### Phase 2: Management Features (2-3 ngày) 🟡 MEDIUM PRIORITY
- [ ] Admin Dashboard - Parts & Inventory Management
- [ ] Admin Dashboard - Employees Management
- [ ] Staff Dashboard - Cập nhật appointment actions

### Phase 3: Payment Integration (1-2 ngày) 🟢 LOW PRIORITY
- [ ] Invoice Page - Tạo và xem hóa đơn
- [ ] Payment Page - Tích hợp VNPay

### Phase 4: Polish & Deploy (1-2 ngày)
- [ ] Testing toàn bộ flows
- [ ] Bug fixes
- [ ] UI/UX improvements
- [ ] Production deployment

**Tổng thời gian ước tính**: 7-9 ngày làm việc (full-time)

Chi tiết roadmap: Xem [PROJECT_STATUS.md](./PROJECT_STATUS.md)

---

## 🐛 Troubleshooting

### CORS Error
**Solution**: Backend cần enable CORS cho frontend domain

### 401 Unauthorized
**Solution**: 
```javascript
// Check token
const token = localStorage.getItem('token');
console.log('Token:', token);

// Re-login nếu token hết hạn
```

### API 404 Not Found
**Solution**:
- Kiểm tra endpoint trong `src/api/index.js`
- So sánh với Swagger documentation
- Đảm bảo HTTP method đúng

---

## 📦 Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Output sẽ ở folder `dist/`

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 👥 Contributors

- **Team EV Service Center** - SWP391 Project
- **FGApollo** - GitHub Repository Owner

---

## 📄 License

This project is for educational purposes (FPT University - SWP391).

---

## 🙏 Acknowledgments

- FPT University
- Spring Boot Team
- React & Vite Communities
- VNPay Payment Gateway

---

## 📞 Support

Nếu bạn gặp vấn đề:
1. Đọc tài liệu trong folder dự án
2. Check Swagger API documentation
3. Test APIs trong browser console
4. Review code templates trong `IMPLEMENTATION_GUIDE.md`

---

**Last Updated**: November 7, 2025  
**Version**: 1.0.0  
**Status**: In Development (70% Backend APIs Complete, 30% Frontend UI Complete)


1
2
3
4

5

5

6
56
5
5
4
4
4
4
4
4
44
4
4
44
4
4
4
