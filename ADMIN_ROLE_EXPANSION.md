# 🔄 ADMIN ROLE - FUTURE EXPANSION

## 📌 **Hiện tại (Phase 1):**
Hệ thống đang sử dụng **4 roles**:
- ✅ CUSTOMER
- ✅ TECHNICIAN  
- ✅ STAFF
- ✅ MANAGER (Admin cũ đổi thành Manager)

Mỗi Manager quản lý **1 center cụ thể** thông qua `centerId`.

---

## 🚀 **Mở rộng sau (Phase 2 - Optional):**

Nếu cần thêm role **ADMIN** (Super Admin) để quản lý toàn hệ thống:

### **1. Cập nhật `src/constants/roles.js`:**

```javascript
export const ROLES = {
  CUSTOMER: 'customer',
  TECHNICIAN: 'technician',
  STAFF: 'staff',
  MANAGER: 'manager',
  ADMIN: 'admin'  // ← Thêm dòng này
};

export const ROLE_LABELS = {
  // ... existing
  [ROLES.ADMIN]: 'Quản trị viên hệ thống'
};

export const ROLE_SCOPES = {
  // ... existing
  [ROLES.ADMIN]: 'system'  // ← Toàn hệ thống
};
```

### **2. Cập nhật permissions:**

```javascript
export const PERMISSIONS = {
  // Tất cả permissions hiện tại
  // ...
  
  // Thêm permissions chỉ Admin có:
  VIEW_ALL_CENTERS: [ROLES.ADMIN],
  MANAGE_CENTERS: [ROLES.ADMIN],
  MANAGE_MANAGERS: [ROLES.ADMIN],
  SYSTEM_CONFIG: [ROLES.ADMIN],
  
  // Cập nhật permissions hiện tại để include ADMIN:
  VIEW_CUSTOMERS: [ROLES.STAFF, ROLES.MANAGER, ROLES.ADMIN],
  VIEW_REPORTS: [ROLES.MANAGER, ROLES.ADMIN],
  // ... etc
};
```

### **3. Uncomment logic trong `centerFilter.js`:**

Tìm các dòng có `TODO: Admin role` và uncomment:

```javascript
// BEFORE:
export const canAccessCenter = (dataCenterId) => {
  const { role, centerId } = getCurrentUser();
  
  // TODO: Khi có Admin role, uncomment dòng này
  // if (role === ROLES.ADMIN) return true;
  
  // ...
};

// AFTER:
export const canAccessCenter = (dataCenterId) => {
  const { role, centerId } = getCurrentUser();
  
  // Admin có thể access tất cả centers
  if (role === ROLES.ADMIN) return true;  // ← Uncomment
  
  // ...
};
```

### **4. Các function cần uncomment:**

1. `canAccessCenter()` - Admin access tất cả centers
2. `shouldFilterByCenter()` - Admin không cần filter
3. `filterByUserCenter()` - Admin xem tất cả data
4. `filterAppointmentsByRole()` - Admin xem tất cả appointments
5. `filterCustomersByRole()` - Admin xem tất cả customers
6. `filterEmployeesByRole()` - Admin xem tất cả employees
7. `filterPartsByRole()` - Admin xem tất cả parts
8. `addCenterIdToParams()` - Admin không thêm centerId
9. `getCenterFilter()` - Admin không filter
10. `shouldShowCenterSelector()` - Admin thấy center selector
11. `validateCenterAccess()` - Admin luôn allowed

### **5. Database migration:**

```sql
-- Không cần thay đổi schema
-- Chỉ cần insert user mới với role = 'admin'

INSERT INTO users (full_name, email, password_hash, role, center_id, status)
VALUES ('Super Admin', 'admin@evservice.com', 'hashed_password', 'admin', NULL, 'active');
-- ⚠️ Admin không có center_id (NULL)
```

### **6. Backend API:**

Admin có thể:
- Xem tất cả centers: `GET /api/center`
- Tạo/sửa/xóa center: `POST/PUT/DELETE /api/center/{id}`
- Xem data của tất cả centers (không filter `?centerId=`)
- Quản lý managers: `POST /api/users/employees?role=manager`

### **7. Frontend routing:**

```javascript
export const DASHBOARD_ROUTES = {
  [ROLES.CUSTOMER]: '/customer-dashboard',
  [ROLES.TECHNICIAN]: '/technician-dashboard',
  [ROLES.STAFF]: '/staff-dashboard',
  [ROLES.MANAGER]: '/manager-dashboard',
  [ROLES.ADMIN]: '/admin-dashboard'  // ← Thêm route
};
```

### **8. UI cho Admin:**

Admin dashboard sẽ có thêm:
- 🏢 **Center Selector**: Dropdown chọn center để xem
- 📊 **Dashboard tổng hợp**: So sánh 2 centers
- 👥 **Manager Management**: Thêm/xóa/sửa managers
- ⚙️ **System Config**: Cấu hình hệ thống

---

## 📋 **Checklist khi implement Admin:**

### **Backend:**
- [ ] Database: Allow `role = 'admin'` with `center_id = NULL`
- [ ] API: Remove `centerId` filter for Admin role
- [ ] API: Add `/api/admin/*` endpoints cho system management
- [ ] Security: Validate Admin role trong middleware
- [ ] Test: Admin có thể xem data của tất cả centers

### **Frontend:**
- [ ] Add `ROLES.ADMIN` to `roles.js`
- [ ] Uncomment all `TODO: Admin role` lines
- [ ] Create `AdminDashboard.jsx` (hoặc mở rộng ManagerDashboard)
- [ ] Add center selector cho Admin
- [ ] Add manager management UI
- [ ] Update routing
- [ ] Test: Admin login và access multi-center data

---

## ⚠️ **Security Notes:**

1. **Admin là role nguy hiểm**: Chỉ tạo khi thực sự cần
2. **Limit số Admin**: Tối đa 1-2 admin accounts
3. **Audit log**: Log tất cả actions của Admin
4. **2FA**: Bắt buộc 2FA cho Admin
5. **IP Whitelist**: Chỉ cho Admin login từ IP cố định (nếu cần)

---

## 🎯 **Khi nào nên thêm Admin role:**

✅ **NÊN thêm khi:**
- Cần so sánh hiệu suất giữa 2 centers
- Cần quản lý nhiều managers
- Cần cấu hình system-wide settings
- Có yêu cầu audit/compliance

❌ **KHÔNG CẦN thêm khi:**
- Chỉ có 2 centers độc lập
- Mỗi Manager tự quản lý center tốt
- Không cần so sánh cross-center
- Đơn giản hóa hệ thống

---

**Last Updated:** November 10, 2025  
**Status:** Phase 1 (4 Roles) - Admin role planned for Phase 2
