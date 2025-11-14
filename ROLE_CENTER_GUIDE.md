# 🎯 ROLE & CENTER MANAGEMENT - IMPLEMENTATION GUIDE

## 📋 Overview

System có **4 Roles chính** và **2 Service Centers**:
- **Customer**: Khách hàng
- **Technician**: Kỹ thuật viên
- **Staff**: Nhân viên tiếp nhận
- **Manager**: Quản lý trung tâm (Admin cũ đổi thành Manager)

Mỗi Manager/Staff/Technician được gán vào **1 center cụ thể** thông qua `centerId`.

---

## 🗂️ File Structure

```
src/
├── constants/
│   └── roles.js                    # ✅ Role definitions, permissions, helpers
├── utils/
│   └── centerFilter.js             # ✅ Center filtering utilities
├── services/
│   └── centerAwareAPI.js           # ✅ API wrapper with center filtering
└── pages/
    ├── AdminDashboard.jsx          # → Đổi tên thành ManagerDashboard.jsx
    ├── StaffDashboard.jsx          # Giữ nguyên
    └── TechnicianDashboard.jsx     # Giữ nguyên
```

---

## 🔐 Role Definitions

### **1. CUSTOMER (Khách hàng)**
**Scope:** Chỉ data của chính mình

**Quyền hạn:**
- ✅ Xem/sửa profile của mình
- ✅ Quản lý xe của mình
- ✅ Đặt lịch bảo dưỡng
- ✅ Xem lịch sử dịch vụ
- ✅ Chat với trung tâm
- ✅ Thanh toán hóa đơn

**Không có quyền:**
- ❌ Xem dữ liệu khách hàng khác
- ❌ Xem dữ liệu nội bộ center
- ❌ Quản lý nhân sự, phụ tùng

---

### **2. TECHNICIAN (Kỹ thuật viên)**
**Scope:** Công việc được giao tại center của mình

**Quyền hạn:**
- ✅ Xem công việc được giao
- ✅ Cập nhật tiến độ (Bắt đầu → Đang làm → Hoàn tất)
- ✅ Ghi nhận tình trạng xe, checklist EV
- ✅ Sử dụng phụ tùng
- ✅ Xem phụ tùng available tại center
- ✅ Chat với khách hàng (về công việc)

**Không có quyền:**
- ❌ Xem/sửa thông tin khách hàng
- ❌ Phân công công việc
- ❌ Quản lý nhân sự
- ❌ Xem báo cáo tài chính
- ❌ Thao tác với center khác

---

### **3. STAFF (Nhân viên tiếp nhận)**
**Scope:** Quy trình dịch vụ tại center của mình

**Quyền hạn:**

**a. Quản lý khách hàng & xe:**
- ✅ Xem danh sách khách hàng (của center)
- ✅ Xem/sửa thông tin khách hàng
- ✅ Xem/thêm xe cho khách hàng
- ✅ Chat với khách hàng

**b. Quản lý lịch hẹn:**
- ✅ Tiếp nhận yêu cầu đặt lịch
- ✅ Chấp nhận/từ chối lịch hẹn
- ✅ Phân công kỹ thuật viên
- ✅ Quản lý hàng chờ

**c. Quản lý quy trình:**
- ✅ Theo dõi tiến độ xe
- ✅ Xem checklist/tình trạng xe

**d. Phụ tùng (hạn chế):**
- ✅ Xem số lượng phụ tùng
- ✅ Xem lịch sử sử dụng
- ❌ Không thêm/xóa/sửa phụ tùng

**e. Tài chính (hạn chế):**
- ✅ Tạo báo giá, hóa đơn
- ✅ Ghi nhận thanh toán
- ❌ Không xem báo cáo doanh thu

**Không có quyền:**
- ❌ Quản lý nhân sự
- ❌ Xem báo cáo tài chính/thống kê
- ❌ Quản lý phụ tùng (thêm/xóa/tồn kho)
- ❌ Thao tác với center khác

---

### **4. MANAGER (Quản lý trung tâm)**
**Scope:** Quản lý toàn bộ 1 center cụ thể

**Quyền hạn FULL tại center:**

**a. Quản lý khách hàng & xe:**
- ✅ Tất cả quyền của Staff
- ✅ Xem thống kê khách hàng

**b. Quản lý lịch hẹn:**
- ✅ Tất cả quyền của Staff
- ✅ Xem thống kê lịch hẹn

**c. Quản lý phụ tùng:**
- ✅ Thêm/xóa/sửa phụ tùng
- ✅ Kiểm soát tồn kho tối thiểu
- ✅ Xem AI gợi ý nhu cầu phụ tùng
- ✅ Đặt hàng phụ tùng

**d. Quản lý nhân sự:**
- ✅ Thêm/xóa/sửa Staff & Technician
- ✅ Phân công ca làm việc
- ✅ Theo dõi hiệu suất nhân viên
- ✅ Quản lý chứng chỉ chuyên môn EV

**e. Quản lý tài chính & báo cáo:**
- ✅ Xem doanh thu, chi phí, lợi nhuận
- ✅ Xem báo cáo chi tiết
- ✅ Thống kê loại dịch vụ, xu hướng
- ✅ Xuất báo cáo Excel/PDF

**Không có quyền:**
- ❌ Thao tác với center khác
- ❌ Quản lý Manager khác
- ❌ Cấu hình hệ thống toàn cục

---

## 🔧 Backend API Requirements

### **API đã có (theo OpenAPI):**

✅ **User APIs:**
- `POST /api/auth/login` → Response có `centerId`
- `PUT /api/auth/update/{id}`
- `GET /api/users/all_customer`
- `GET /api/users/allTechnicians`
- `POST /api/users/employees?role={role}` → Tạo employee
- `DELETE /api/users/{id}`

✅ **Appointment APIs:**
- `GET /api/appointments` → Customer appointments
- `GET /api/appointments/all` → All appointments
- `GET /api/appointments/appointments/status/{status}`
- `PUT /api/appointments/{id}/accept`
- `PUT /api/appointments/{id}/inProgress`
- `PUT /api/appointments/{id}/done`

✅ **Parts APIs:**
- `GET /api/auth/parts`
- `POST /api/auth/parts/create`
- `PUT /api/auth/parts/update/{id}`
- `DELETE /api/auth/parts/delete/{id}`

✅ **Report APIs:**
- `GET /api/admin/reports/revenue`
- `GET /api/admin/reports/revenue/current-month`
- `GET /api/admin/reports/trending-services/alltime`
- `GET /api/admin/reports/trending-parts`
- `GET /api/admin/reports/parts/stock-report`

✅ **Center APIs:**
- `GET /api/center` → Get all centers
- `POST /api/center` → Create center
- `PUT /api/center/{id}` → Update center
- `DELETE /api/center/{id}` → Delete center

### **API cần thêm/sửa:**

❗ **Backend cần filter theo centerId:**

1. **GET /api/users/all_customer**
   - Cần thêm query param: `?centerId={id}`
   - Hoặc backend auto-filter theo user's centerId

2. **GET /api/users/allTechnicians**
   - Cần filter theo centerId

3. **GET /api/appointments/all**
   - Cần filter theo centerId (Staff/Manager chỉ xem appointment của center mình)

4. **GET /api/appointments/appointments/status/{status}**
   - Cần filter theo centerId

5. **POST /api/users/employees**
   - Request body cần thêm field `centerId`
   - Hoặc backend auto-gán centerId từ token

6. **GET /api/auth/parts**
   - Cần filter parts theo centerId (xem inventory của center)

7. **GET /api/admin/reports/***
   - Cần thêm query param `?centerId={id}` để filter report theo center
   - Manager chỉ xem report của center mình

---

## 🎨 Frontend Implementation

### **1. Cập nhật routing:**

```javascript
// src/App.jsx
import { ROLES } from './constants/roles';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Routes
<Routes>
  <Route path="/login" element={<Login />} />
  
  {/* Customer */}
  <Route path="/customer-dashboard" element={
    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
      <Home />
    </ProtectedRoute>
  } />
  
  {/* Technician */}
  <Route path="/technician-dashboard" element={
    <ProtectedRoute allowedRoles={[ROLES.TECHNICIAN]}>
      <TechnicianDashboard />
    </ProtectedRoute>
  } />
  
  {/* Staff */}
  <Route path="/staff-dashboard" element={
    <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
      <StaffDashboard />
    </ProtectedRoute>
  } />
  
  {/* Manager */}
  <Route path="/manager-dashboard" element={
    <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
      <ManagerDashboard />
    </ProtectedRoute>
  } />
</Routes>
```

### **2. Sử dụng centerAwareAPI:**

```javascript
// TRƯỚC (không filter):
import * as API from '../api/index';

const fetchCustomers = async () => {
  const data = await API.getAllCustomers(); // ← Lấy tất cả customers
  setCustomers(data);
};

// SAU (có filter):
import CenterAPI from '../services/centerAwareAPI';

const fetchCustomers = async () => {
  const data = await CenterAPI.getCustomers(); // ← Auto-filter theo center
  setCustomers(data);
};
```

### **3. Sử dụng permission check:**

```javascript
import { hasPermission, PERMISSIONS } from '../constants/roles';

const role = localStorage.getItem('role');

// Check quyền xóa customer
if (hasPermission(role, 'DELETE_CUSTOMERS')) {
  return (
    <button onClick={handleDelete}>
      <FaTrash /> Xóa
    </button>
  );
}

// Check quyền xem báo cáo
if (hasPermission(role, 'VIEW_REPORTS')) {
  return <ReportsTab />;
}
```

### **4. Validate center access:**

```javascript
import { validateCenterAccess } from '../utils/centerFilter';

const handleEditCustomer = (customer) => {
  const { allowed, reason } = validateCenterAccess(customer, 'edit');
  
  if (!allowed) {
    alert(`Không thể chỉnh sửa: ${reason}`);
    return;
  }
  
  // Proceed with edit
  setEditingCustomer(customer);
  setShowModal(true);
};
```

---

## 📊 Database Schema

### **Users Table cần có:**

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  role ENUM('customer', 'technician', 'staff', 'manager', 'admin'),
  center_id INT,  -- ← Thêm cột này
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (center_id) REFERENCES service_centers(id),
  
  -- Customer không có center_id (NULL)
  -- Staff/Technician/Manager phải có center_id
  CHECK (
    (role = 'customer' AND center_id IS NULL) OR
    (role IN ('staff', 'technician', 'manager') AND center_id IS NOT NULL) OR
    (role = 'admin')
  )
);
```

---

## 🚀 Migration Steps

### **Bước 1: Cập nhật database**
```sql
-- Thêm cột centerId
ALTER TABLE users ADD COLUMN center_id INT;

-- Thêm foreign key
ALTER TABLE users ADD FOREIGN KEY (center_id) REFERENCES service_centers(id);

-- Update existing users (Admin cũ → Manager)
UPDATE users SET role = 'manager', center_id = 1 WHERE role = 'admin' AND id = 1;
UPDATE users SET role = 'manager', center_id = 2 WHERE role = 'admin' AND id = 2;
```

### **Bước 2: Cập nhật backend**
- Thêm `centerId` vào `LoginResponse`
- Thêm filter theo `centerId` vào các API endpoints
- Validate user chỉ thao tác với data của center mình

### **Bước 3: Cập nhật frontend**
- ✅ Tạo `/src/constants/roles.js`
- ✅ Tạo `/src/utils/centerFilter.js`
- ✅ Tạo `/src/services/centerAwareAPI.js`
- 🔄 Đổi tên `AdminDashboard.jsx` → `ManagerDashboard.jsx`
- 🔄 Cập nhật routing trong `App.jsx`
- 🔄 Replace `API.*` calls → `CenterAPI.*` calls
- 🔄 Thêm permission checks vào UI

---

## ✅ Checklist

### **Backend:**
- [ ] Add `centerId` to User model
- [ ] Update `LoginResponse` to include `centerId`
- [ ] Add center filter to customer APIs
- [ ] Add center filter to appointment APIs
- [ ] Add center filter to report APIs
- [ ] Add `centerId` to employee creation
- [ ] Validate center access in controllers

### **Frontend:**
- [✅] Create `roles.js` constants
- [✅] Create `centerFilter.js` utilities
- [✅] Create `centerAwareAPI.js` service
- [ ] Rename `AdminDashboard` → `ManagerDashboard`
- [ ] Update `App.jsx` routing
- [ ] Replace API calls with CenterAPI
- [ ] Add permission checks to UI
- [ ] Test with 2 different centers

### **Database:**
- [ ] Add `center_id` column to `users` table
- [ ] Add foreign key constraint
- [ ] Update existing admin users to managers
- [ ] Assign `centerId` to staff/technicians

---

## 📖 Usage Examples

### **Example 1: Manager Dashboard**

```javascript
import { useEffect, useState } from 'react';
import CenterAPI from '../services/centerAwareAPI';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import { getCurrentUser } from '../utils/centerFilter';

function ManagerDashboard() {
  const [stats, setStats] = useState({});
  const [customers, setCustomers] = useState([]);
  const { role, centerId, fullName } = getCurrentUser();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      // Auto-filtered theo center
      const revenue = await CenterAPI.getRevenueCurrentMonth();
      const customerList = await CenterAPI.getCustomers();
      
      setStats(revenue);
      setCustomers(customerList);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <h1>Dashboard - Center #{centerId}</h1>
      <p>Welcome, {fullName}</p>
      
      {hasPermission(role, 'VIEW_REVENUE') && (
        <div>
          <h2>Doanh thu: ${stats.thisMonth}</h2>
        </div>
      )}
      
      {hasPermission(role, 'ADD_EMPLOYEES') && (
        <button onClick={handleAddEmployee}>
          Thêm nhân viên
        </button>
      )}
    </div>
  );
}
```

### **Example 2: Staff assign technician**

```javascript
const handleAssignTech = async (appointmentId, techIds) => {
  try {
    // CenterAPI sẽ validate techIds có thuộc center không
    await CenterAPI.assignTechnicians(appointmentId, techIds);
    
    toast.success('Đã phân công kỹ thuật viên!');
    fetchAppointments();
  } catch (error) {
    toast.error('Lỗi: ' + error.message);
  }
};
```

---

## 🔒 Security Notes

1. **Backend MUST validate `centerId`**: Không tin tưởng frontend
2. **Use JWT token**: Token chứa `userId`, `role`, `centerId`
3. **Middleware check**: Mỗi request check user có quyền truy cập center không
4. **SQL Injection**: Use parameterized queries
5. **CORS**: Chỉ allow frontend domain

---

## 📞 Support

Nếu có thắc mắc về implementation, liên hệ:
- Team Lead: [Your Name]
- Backend Dev: [Backend Dev Name]
- Frontend Dev: [Frontend Dev Name]

---

**Last Updated:** November 10, 2025
**Version:** 1.0
