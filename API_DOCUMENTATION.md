# 📋 EV Service Center - API Documentation

**File**: `src/api/index.js`  
**Tổng số APIs**: 47 functions  
**Backend URL**: Render (online) - https://ev-service-center-maintance-management-um2j.onrender.com  
**Cấu hình**: Xem file `src/api/config.js` (ENV = "render")

---

## 🔐 AUTHENTICATION APIs (2)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `register(data)` | POST | `/api/auth/register` | Đăng ký tài khoản mới |
| `login(data)` | POST | `/api/auth/login` | Đăng nhập - Lưu token, role, fullName, userId, centerId |

---

## 👤 USER & PROFILE APIs (7)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getProfile()` | GET | `/api/profile` | Lấy thông tin profile người dùng hiện tại |
| `updateUser(id, data)` | PUT | `/api/update/{id}` | Cập nhật thông tin user |
| `getUsersByRole(role)` | GET | `/api/users?role={role}` | Lấy danh sách users theo role |
| `getAllCustomers()` | GET | `/api/users/all_customer` | Lấy tất cả customers |
| `getAllTechnicians()` | GET | `/api/users/allTechnicians` | Lấy danh sách technicians |
| `createEmployee(role, data)` | POST | `/api/users/employees?role={role}` | Tạo employee mới (Admin/Staff) |
| `deleteEmployee(id)` | DELETE | `/api/users/{id}` | Xóa employee |

---

## 🚗 VEHICLE APIs (5)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getVehicles()` | GET | `/api/vehicles` | Lấy xe của user hiện tại |
| `addVehicle(data)` | POST | `/api/vehicles` | Thêm xe mới |
| `deleteVehicle(id)` | DELETE | `/api/vehicles/{id}` | Xóa xe |
| `getVehiclesMaintained()` | GET | `/api/vehicles/maintained` | Lấy danh sách xe đã bảo dưỡng (với owner info) |
| `getLatestAppointmentTime(vehicleId)` | GET | `/api/vehicles/{vehicleId}/appointments/latest_time` | Lấy thời gian lịch hẹn gần nhất |

---

## 📅 APPOINTMENT APIs (11)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getAppointments()` | GET | `/api/appointments` | Lấy lịch hẹn của user hiện tại |
| `createAppointment(data)` | POST | `/api/appointments` | Tạo lịch hẹn mới |
| `getAllAppointments()` | GET | `/api/appointments/all` | Lấy tất cả appointments (Admin) |
| `getAppointmentsByStatus(status)` | GET | `/api/appointments/appointments/status/{status}` | Lấy appointments theo status |
| `getAppointmentsByStaff(staffId)` | GET | `/api/appointments/staff?id={staffId}` | Lấy appointments của staff |
| `getAppointmentDone(id)` | GET | `/api/appointments/status/done/{id}` | Lấy appointment đã hoàn thành theo ID |
| `acceptAppointment(id)` | PUT | `/api/appointments/{id}/accept` | Chấp nhận lịch hẹn |
| `cancelAppointment(id)` | PUT | `/api/appointments/{id}/cancel` | Hủy lịch hẹn |
| `inProgressAppointment(id, technicianIds)` | PUT | `/api/appointments/{id}/inProgress` | Chuyển trạng thái sang In Progress |
| `doneAppointment(id, maintainanceData)` | PUT | `/api/appointments/{id}/done` | Hoàn thành lịch hẹn |
| `assignTechnicians(appointmentId, technicianIds)` | PUT | `/assignments/{appointmentId}/staff` | Assign technicians cho appointment |

---

## 👷 STAFF ASSIGNMENT APIs (1)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getFreeStaff()` | GET | `/assignments/free` | Lấy danh sách staff đang rảnh |

---

## 🔧 PARTS APIs (6)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getAllParts()` | GET | `/api/auth/parts` | Lấy tất cả parts |
| `getPartById(id)` | GET | `/api/auth/parts/{id}` | Lấy part theo ID |
| `createPart(data)` | POST | `/api/auth/parts/create` | Tạo part mới |
| `updatePart(id, data)` | PUT | `/api/auth/parts/update/{id}` | Cập nhật part |
| `deletePart(id)` | DELETE | `/api/auth/parts/delete/{id}` | Xóa part |
| `usePart(data)` | POST | `/api/technician/part_usage` | Sử dụng part (ghi nhận sử dụng linh kiện) |

---

## 📋 MAINTENANCE RECORD APIs (2)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `createMaintenanceRecord(appointmentId, data)` | POST | `/MaintainanceRecord/{appointmentId}` | Tạo maintenance record |
| `getMaintenanceRecordsByStaff(staffId)` | GET | `/MaintainanceRecord/staff/{staffId}` | Lấy maintenance records theo staff |

---

## 📝 WORKLOG APIs (2)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `createWorkLog(data)` | POST | `/worklogs` | Tạo worklog thủ công |
| `createAutoWorkLog(appointmentId)` | POST | `/worklogs/{appointmentId}` | Tạo worklog tự động cho appointment |

---

## 🧾 INVOICE APIs (2)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `createInvoice(appointmentId)` | POST | `/api/auth/invoices/create/{appointmentId}` | Tạo invoice cho appointment |
| `getRevenue(startDate, endDate)` | GET | `/api/auth/invoices/revenue?startDate&endDate` | Lấy doanh thu theo khoảng thời gian |

---

## 💳 PAYMENT APIs (VNPay) (2)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `createPayment(paymentDto)` | GET | `/api/customer/payments/create` | Tạo payment link (VNPay) |
| `paymentReturn(allParams)` | GET | `/api/customer/payments/return` | Xử lý callback từ VNPay |

**PaymentDto structure:**
```javascript
{
  invoiceId: 123,
  method: "VNPAY",
  clientIp: "192.168.1.1"
}
```

---

## 📊 REPORT APIs (Admin Only) (5)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `getRevenueReport()` | GET | `/api/admin/reports/revenue` | Báo cáo doanh thu |
| `getProfitReport()` | GET | `/api/admin/reports/profit` | Báo cáo lợi nhuận |
| `getTrendingServices()` | GET | `/api/admin/reports/trending-services/alltime` | Top dịch vụ phổ biến (all time) |
| `getTrendingServicesLastMonth()` | GET | `/api/admin/reports/trending-services/last-month` | Top dịch vụ phổ biến tháng trước |
| `getTop5PartsUsed()` | GET | `/api/admin/reports/trending-parts` | Top 5 parts được dùng nhiều nhất tháng trước |

---

## 🔔 REMINDER APIs (Test) (1)

| Function | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| `runReminderScheduler()` | GET | `/api/auth/reminder/run` | Chạy reminder scheduler thủ công (test) |

---

## 🚪 UTILITY (1)

| Function | Type | Mô tả |
|----------|------|-------|
| `logout()` | Local | Xóa token, role, fullName, userId, centerId khỏi localStorage |

---

## 📝 CÁC SCHEMA QUAN TRỌNG

### RegisterUserDto
```javascript
{
  fullName: "Nguyễn Văn A",
  email: "user@example.com",
  phone: "0901234567",
  password: "123456"
}
```

### LoginRequest
```javascript
{
  email: "admin@example.com",
  password: "123456"
}
```

### LoginResponse
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  role: "ROLE_ADMIN",
  fullName: "Admin User",
  id: 1,
  centerId: 1
}
```

### VehicleDto
```javascript
{
  id: 123,
  vin: "1HGBH41JXMN109186",
  model: "Tesla Model 3",
  year: 2023,
  color: "White",
  licensePlate: "30A-12345"
}
```

### AppointmentRequest
```javascript
{
  vehicleId: 123,
  serviceCenterId: 1,
  appointmentDate: "2025-11-15T09:00:00",
  serviceTypeIds: [1, 2, 3]
}
```

### MaintainanceRecordDto
```javascript
{
  vehicleCondition: "Good condition",
  checklist: "Battery check, Brake inspection",
  remarks: "All systems normal",
  partsUsed: [
    {
      partId: 5,
      quantityUsed: 2,
      unitCost: 50000
    }
  ],
  staffIds: [10, 15]
}
```

---

## 🔧 CÁCH SỬ DỤNG

### Import APIs
```javascript
import { login, register, getProfile } from '../api/index.js';
```

### Ví dụ Login
```javascript
try {
  const response = await login({
    email: "admin@example.com",
    password: "123456"
  });
  console.log("Đăng nhập thành công:", response);
  // Token, role, userId, centerId đã được tự động lưu vào localStorage
} catch (error) {
  console.error("Lỗi đăng nhập:", error.response?.data || error.message);
}
```

### Ví dụ Create Appointment
```javascript
try {
  const appointmentData = {
    vehicleId: 123,
    serviceCenterId: 1,
    appointmentDate: "2025-11-20T14:00:00",
    serviceTypeIds: [1, 3]
  };
  const result = await createAppointment(appointmentData);
  console.log("Tạo lịch hẹn thành công:", result);
} catch (error) {
  console.error("Lỗi:", error.response?.data);
}
```

### Ví dụ Get Profile
```javascript
try {
  const profile = await getProfile();
  console.log("Profile:", profile);
} catch (error) {
  if (error.response?.status === 401) {
    // Token hết hạn, redirect to login
    logout();
    window.location.href = "/login";
  }
}
```

---

## 🔑 AUTHENTICATION

Token JWT được tự động gửi kèm mọi request qua axios interceptor trong `axiosClient.js`:

```javascript
Authorization: Bearer <token>
```

Nếu token hết hạn (401), cần:
1. Gọi `logout()` để xóa token cũ
2. Redirect user về trang login
3. User đăng nhập lại để lấy token mới

---

## 🌐 MÔI TRƯỜNG

**Hiện tại đang dùng:** Render (Production)
- URL: https://ev-service-center-maintance-management-um2j.onrender.com

**Để đổi về localhost:**
1. Mở `src/api/config.js`
2. Đổi `const ENV = "render"` → `const ENV = "local"`
3. Khởi động backend trên port 8080

---

## ✅ TÌNH TRẠNG

- ✅ Tất cả 47 APIs đã được mapping theo Swagger
- ✅ Login function lưu đầy đủ: token, role, fullName, userId, centerId
- ✅ Logout function xóa đầy đủ thông tin
- ✅ Không có syntax error
- ✅ Backend đang kết nối tới Render (online)

---

**Last Updated**: November 7, 2025  
**Version**: 1.0  
**By**: GitHub Copilot
