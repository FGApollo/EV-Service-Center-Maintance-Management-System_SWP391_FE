# 🎯 MANAGER DASHBOARD - FULL CRUD GUIDE

**Date**: November 11, 2025  
**Version**: 2.0 - Updated with OpenAPI Spec

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [API Updates](#api-updates)
3. [Customer Management (CRUD)](#customer-management)
4. [Vehicle Management (CRUD)](#vehicle-management)
5. [Staff Management (CRUD)](#staff-management)
6. [Parts Management (CRUD)](#parts-management)
7. [Appointments Management](#appointments-management)
8. [Financial Reports](#financial-reports)
9. [Dashboard Overview](#dashboard-overview)
10. [Error Handling](#error-handling)

---

## 🎯 OVERVIEW

Manager Dashboard là trang quản lý trung tâm dịch vụ với đầy đủ chức năng CRUD cho:

### ✅ Đã Hoàn Thành
- **Khách hàng (Customer)**: ✅ Full CRUD
- **Xe (Vehicle)**: ✅ Full CRUD  
- **Lịch hẹn (Appointments)**: ✅ View & Update Status
- **Dashboard Overview**: ✅ Real-time Statistics
- **Báo cáo tài chính**: ✅ Revenue, Profit, Trending Services

### 🔧 Cần Thêm
- **Nhân sự (Staff)**: CRUD cho Staff/Technician
- **Phụ tùng (Parts)**: CRUD với inventory management
- **Chat**: Real-time messaging với khách hàng

---

## 🔄 API UPDATES

### ⚠️ Breaking Changes

**Old Endpoint** (Deprecated):
```javascript
PUT /api/update/{id}
```

**New Endpoint** (OpenAPI v1):
```javascript
PUT /api/auth/update/{id}
```

### ✅ Updated in Code
File: `src/api/index.js`

```javascript
// ✅ UPDATED - Theo OpenAPI mới
export const updateUser = async (id, data) => {
  const res = await axiosClient.put(`/api/auth/update/${id}`, data);
  return res.data;
};
```

---

## 👤 CUSTOMER MANAGEMENT (CRUD)

### 📍 Navigation
```
Dashboard → Tab "Khách hàng"
URL: localhost:5173/#manager/customers
```

### 1️⃣ **CREATE** - Thêm Khách Hàng Mới

**UI Flow**:
1. Click nút **"➕ Thêm khách hàng"**
2. Điền form:
   - Họ tên *
   - Tên đăng nhập * (unique)
   - Email * (@gmail.com only)
   - Số điện thoại (format Việt Nam)
   - Địa chỉ
3. Click **"Lưu"**

**API Call**:
```javascript
POST /api/auth/register
Body: {
  "username": "string",      // Required, unique
  "password": "123456",       // Default password
  "fullName": "string",       // Required
  "email": "string",          // Required, @gmail.com
  "phone": "string",          // Optional
  "address": "string",        // Optional
  "role": "customer"          // Auto-set
}
```

**Success Response**:
```json
{
  "id": 1,
  "fullName": "Phạ Thanh Dũng",
  "email": "tuankhodo4@gmail.com",
  "phone": "0968788239",
  "role": "customer",
  "status": "active"
}
```

**Auto Actions**:
- ✅ Password mặc định: `123456`
- ✅ Role tự động: `customer`
- ✅ Alert thông báo credentials cho khách hàng
- ✅ Refresh danh sách sau 500ms

### 2️⃣ **READ** - Xem Danh Sách Khách Hàng

**API Call**:
```javascript
GET /api/users/all_customer
```

**Response**: Array of `UserDto`
```json
[
  {
    "id": 1,
    "fullName": "Phạ Thanh Dũng",
    "email": "tuankhodo4@gmail.com",
    "phone": "0968788239",
    "role": "customer",
    "status": "active",
    "create_at": "2024-01-01T00:00:00",
    "vehicles": []
  }
]
```

**Features**:
- ✅ Search bar (tìm theo tên, email, SĐT)
- ✅ Hiển thị số xe của mỗi khách hàng
- ✅ Icons: 👁️ View, ✏️ Edit, 🗑️ Delete

### 3️⃣ **UPDATE** - Cập Nhật Khách Hàng

**UI Flow**:
1. Click icon ✏️ **Edit** trên row khách hàng
2. Form hiện với data có sẵn
3. Chỉnh sửa:
   - Họ tên
   - Email
   - Số điện thoại
   - Địa chỉ
4. Click **"Cập nhật"**

**API Call**:
```javascript
PUT /api/auth/update/{id}
Body: {
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "password": "string"  // Optional - để trống nếu không đổi
}
```

**⚠️ Important Notes**:
- Username **KHÔNG** được phép thay đổi
- Password field optional (để trống = giữ nguyên)
- Email phải unique trong hệ thống

### 4️⃣ **DELETE** - Xóa Khách Hàng

**UI Flow**:
1. Click icon 🗑️ **Delete**
2. Confirm dialog xuất hiện
3. Xác nhận xóa

**API Call**:
```javascript
DELETE /api/users/{id}
```

**⚠️ Business Rules**:
- ❌ Không xóa được nếu khách hàng có lịch hẹn
- ❌ Không xóa được nếu có xe liên quan
- ⚠️ Foreign key constraint sẽ block

**Error Cases**:
- `403`: Không có quyền
- `400`: Có ràng buộc dữ liệu (appointments, vehicles)

---

## 🚗 VEHICLE MANAGEMENT (CRUD)

### 📍 Navigation
```
Dashboard → Tab "Quản lý xe"
URL: localhost:5173/#manager/vehicles
```

### 1️⃣ **CREATE** - Thêm Xe Mới

**UI Flow**:
1. Click **"➕ Thêm xe"**
2. Chọn khách hàng (dropdown)
3. Điền thông tin:
   - Model xe *
   - VIN *
   - Biển số *
   - Năm sản xuất *
   - Màu sắc *
4. Click **"Lưu"**

**API Call**:
```javascript
POST /api/vehicles
Body: {
  "model": "Tesla Model 3",
  "vin": "5YJ3E1EA1KF123456",
  "licensePlate": "30A-12345",
  "year": 2024,
  "color": "Trắng"
}
```

**⚠️ Validation**:
- VIN: 17 ký tự
- Biển số: Format Việt Nam
- Năm: 1900 - năm hiện tại

### 2️⃣ **READ** - Xem Danh Sách Xe

**API Call**:
```javascript
GET /api/vehicles/maintained
```

**Response**:
```json
[
  {
    "vehicleId": 1,
    "model": "Tesla Model 3",
    "vin": "5YJ3E1EA1KF123456",
    "licensePlate": "30A-12345",
    "year": 2024,
    "color": "Trắng",
    "ownerName": "Phạ Thanh Dũng",
    "maintenanceCount": 5,
    "closetTime": "2024-11-10T10:00:00",
    "maintenanceServices": ["Bảo dưỡng định kỳ", "Thay dầu"]
  }
]
```

**Features**:
- ✅ Search (model, biển số, VIN, owner)
- ✅ Hiển thị số lần bảo dưỡng
- ✅ Lịch hẹn gần nhất
- ✅ Danh sách dịch vụ đã làm

### 3️⃣ **UPDATE** - Cập Nhật Xe

**UI Flow**:
1. Click **Edit** trên row xe
2. Form xuất hiện với data hiện tại
3. Chỉnh sửa thông tin
4. Click **"Cập nhật"**

**API Call**:
```javascript
PUT /api/vehicles/{id}
Body: {
  "id": 1,
  "model": "Tesla Model 3",
  "vin": "5YJ3E1EA1KF123456",
  "licensePlate": "30A-12345",
  "year": 2024,
  "color": "Đen"  // Changed
}
```

### 4️⃣ **DELETE** - Xóa Xe

**API Call**:
```javascript
DELETE /api/vehicles/{id}
```

**⚠️ Business Rules**:
- Soft delete (deleted = true)
- Không xóa nếu có lịch hẹn đang xử lý

---

## 👥 STAFF MANAGEMENT (CRUD)

### 📍 Navigation
```
Dashboard → Tab "Nhân sự"
URL: localhost:5173/#manager/staff
```

### 1️⃣ **CREATE** - Thêm Nhân Viên

**API Call**:
```javascript
POST /api/users/employees?role={role}
Body: {
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

**Roles**:
- `technician`: Kỹ thuật viên
- `staff`: Nhân viên văn phòng

### 2️⃣ **READ** - Xem Danh Sách

**API Calls**:
```javascript
// Get Staff
GET /api/users?role=staff

// Get Technicians  
GET /api/users/allTechnicians
```

### 3️⃣ **UPDATE** - Cập Nhật

**API Call**:
```javascript
PUT /api/auth/update/{id}
Body: {
  "fullName": "string",
  "email": "string", 
  "phone": "string",
  "password": "string"  // Optional
}
```

### 4️⃣ **DELETE** - Xóa Nhân Viên

**API Call**:
```javascript
DELETE /api/users/{id}
```

---

## 🔧 PARTS MANAGEMENT (CRUD)

### 📍 Navigation
```
Dashboard → Tab "Phụ tùng"
URL: localhost:5173/#manager/parts
```

### 1️⃣ **CREATE** - Thêm Phụ Tùng

**API Call**:
```javascript
POST /api/auth/parts/create
Body: {
  "name": "string",
  "description": "string",
  "unitPrice": 150000,
  "minStockLevel": 10
}
```

### 2️⃣ **READ** - Xem Danh Sách

**API Calls**:
```javascript
// Get All Parts
GET /api/auth/parts

// Get Part by ID
GET /api/auth/parts/{id}

// Get Stock Report
GET /api/management/reports/parts/stock-report
```

**Stock Report Response**:
```json
[
  {
    "id": 1,
    "name": "Lốp xe Tesla Model 3",
    "minStockLevel": 10,
    "totalStock": 25,
    "totalUsage": 5
  }
]
```

### 3️⃣ **UPDATE** - Cập Nhật

**API Call**:
```javascript
PUT /api/auth/parts/update/{id}
Body: {
  "id": 1,
  "name": "string",
  "description": "string",
  "unitPrice": 200000,
  "minStockLevel": 15
}
```

### 4️⃣ **DELETE** - Xóa Phụ Tùng

**API Call**:
```javascript
DELETE /api/auth/parts/delete/{id}
```

---

## 📅 APPOINTMENTS MANAGEMENT

### View All Appointments

**API Call**:
```javascript
GET /api/appointments/all
```

### Get by Status

**API Call**:
```javascript
GET /api/appointments/appointments/status/{status}
```

**Statuses**:
- `pending`: Chờ xác nhận
- `accepted`: Đã xác nhận
- `in-progress`: Đang thực hiện
- `completed`: Hoàn thành
- `cancelled`: Đã hủy

### Update Status

**Accept**:
```javascript
PUT /api/appointments/{id}/accept
```

**In Progress**:
```javascript
PUT /api/appointments/{id}/inProgress
Body: [technicianId1, technicianId2]  // Array of tech IDs
```

**Complete**:
```javascript
PUT /api/appointments/{id}/done
Body: {
  "vehicleCondition": "string",
  "checklist": "string",
  "remarks": "string",
  "partsUsed": [
    {
      "partId": 1,
      "quantityUsed": 2,
      "unitCost": 150000
    }
  ],
  "staffIds": [1, 2]
}
```

**Cancel**:
```javascript
PUT /api/appointments/{id}/cancel
```

---

## 💰 FINANCIAL REPORTS

### Revenue Report

**API Call**:
```javascript
GET /api/management/reports/revenue
```

**Response**:
```json
{
  "2024-01": 50000000,
  "2024-02": 65000000,
  "2024-03": 72000000
}
```

### Current Month Revenue

**API Call**:
```javascript
GET /api/management/reports/revenue/current-month
```

**Response**:
```json
{
  "thisMonth": 72000000,
  "lastMonth": 65000000,
  "percentChange": 10,
  "trend": "up"
}
```

### Profit Report

**API Call**:
```javascript
GET /api/management/reports/profit
```

### Trending Services

**All Time**:
```javascript
GET /api/management/reports/trending-services/alltime
```

**Last Month**:
```javascript
GET /api/management/reports/trending-services/last-month
```

**Response**:
```json
[
  {
    "key": "Bảo dưỡng định kỳ",
    "value": 150
  },
  {
    "key": "Thay dầu",
    "value": 120
  }
]
```

### Payment Methods Stats

**API Call**:
```javascript
GET /api/management/reports/payment-methods
```

**Response**:
```json
{
  "online": {
    "count": 50,
    "amount": 125000000,
    "percentage": 62.5
  },
  "offline": {
    "count": 30,
    "amount": 75000000,
    "percentage": 37.5
  }
}
```

---

## 📊 DASHBOARD OVERVIEW

### Stats Cards

Hiển thị real-time:

1. **💰 Tổng Doanh Thu** - `totalRevenue`
2. **👤 Khách Hàng** - `totalCustomers`  
3. **🚗 Xe Đã Bảo Dưỡng** - `totalVehicles`
4. **📅 Tổng Lịch Hẹn** - `totalAppointments`
5. **🕒 Chờ Xử Lý** - `pendingAppointments`
6. **🔧 Đang Bảo Dưỡng** - `inProgressAppointments`
7. **❌ Đã Hủy** - `cancelledAppointments`
8. **✅ Đã Hoàn Thành** - `completedAppointments`
9. **👥 Kỹ Thuật Viên** - `activeTechnicians`

### Charts

1. **Revenue Trend Chart** - Line chart theo tháng
2. **Trending Services** - Top 5 dịch vụ phổ biến
3. **Parts Usage** - Top 5 phụ tùng hay dùng
4. **Payment Methods** - Pie chart online vs offline

---

## ⚠️ ERROR HANDLING

### Token Expired (403/401)

**Detection**:
```javascript
if (status === 403 || status === 401) {
  const isTokenError = 
    errorMsg.toLowerCase().includes('token') ||
    errorMsg.toLowerCase().includes('expired') ||
    errorMsg.toLowerCase().includes('invalid');
}
```

**Action**:
1. Alert: "Phiên đăng nhập đã hết hạn"
2. Clear localStorage
3. Redirect to login

### Permission Denied (403)

**Message**: "Bạn không có quyền thực hiện thao tác này"

### Validation Errors

**Username Exists**:
```
❌ Tên đăng nhập đã tồn tại!
Vui lòng chọn tên đăng nhập khác.
```

**Email Exists**:
```
❌ Email đã được sử dụng!
Vui lòng dùng email khác.
```

**Foreign Key Constraint**:
```
❌ Không thể xóa vì:
- Có lịch hẹn liên quan
- Hoặc có dữ liệu phụ thuộc
```

### Network Errors

**Retry Button**: Xuất hiện khi API fail  
**Loading State**: Spinner + message
**Empty State**: "Chưa có dữ liệu"

---

## 🔧 TESTING CHECKLIST

### Customer CRUD
- [ ] Tạo customer mới với username unique
- [ ] Tạo customer với email đã tồn tại → Error
- [ ] Update customer info → Success
- [ ] Update với token hết hạn → Redirect login
- [ ] Delete customer không có data → Success
- [ ] Delete customer có appointments → Error
- [ ] Search customer theo tên/email/phone

### Vehicle CRUD
- [ ] Thêm xe cho customer
- [ ] Update xe (đổi màu, model)
- [ ] Delete xe không có appointment
- [ ] Delete xe đang có appointment → Error
- [ ] Search xe theo biển số/VIN

### Dashboard
- [ ] Hiển thị đúng số liệu stats
- [ ] Charts render đúng
- [ ] Real-time update sau CRUD
- [ ] Filter theo date range

---

## 📞 SUPPORT

**Issues**: Report to team lead  
**Documentation**: This file + `API_DOCUMENTATION.md`  
**Backend API**: http://localhost:8080/swagger-ui.html

---

**Last Updated**: November 11, 2025  
**Author**: EV Service Center Team
