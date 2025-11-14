# ✅ ADMIN → MANAGER DASHBOARD - MIGRATION COMPLETED

## 📋 **Tóm tắt thay đổi:**

### **1. Files mới được tạo:**

| File | Mô tả |
|------|-------|
| `src/pages/ManagerDashboard.jsx` | Dashboard mới cho Manager role |
| `src/pages/ManagerDashboard.css` | CSS cho Manager Dashboard |

### **2. Files được cập nhật:**

| File | Thay đổi |
|------|----------|
| `src/App.jsx` | - Import ManagerDashboard<br>- Thêm route `/manager`<br>- Giữ route `/admin` (backward compatibility) |
| `src/pages/Login.jsx` | - Redirect theo role sau khi login<br>- Manager → `/manager`<br>- Staff → `/staff`<br>- Technician → `/technician`<br>- Customer → `/home` |

### **3. Files được giữ lại:**

| File | Lý do |
|------|-------|
| `src/pages/AdminDashboard.jsx` | Backward compatibility (nếu còn user với role 'admin' trong DB) |
| `src/pages/AdminDashboard.css` | Dùng chung với ManagerDashboard |

---

## 🎯 **ManagerDashboard.jsx - Features mới:**

### **A. Imports:**
```javascript
import { getCurrentUser, getCurrentCenterId } from '../utils/centerFilter';
import { hasPermission, PERMISSIONS, ROLES } from '../constants/roles';
```

### **B. User Info:**
```javascript
const currentUser = getCurrentUser();
const { role, centerId, fullName } = currentUser;
```

### **C. Authorization Check:**
```javascript
useEffect(() => {
  // 1. Check login
  if (!token) {
    alert('Bạn cần đăng nhập!');
    return;
  }
  
  // 2. Check role = MANAGER
  if (role !== ROLES.MANAGER) {
    alert('Bạn không có quyền truy cập!');
    return;
  }
  
  // 3. Check có centerId
  if (!centerId) {
    alert('Tài khoản chưa được gán vào trung tâm!');
    return;
  }
}, []);
```

### **D. UI Updates:**
```jsx
{/* Header với Center ID */}
<h1>Manager Dashboard - Center #{centerId}</h1>

{/* User info */}
<p className="admin-name">{fullName || 'Manager'}</p>
<p className="admin-role">Quản lý trung tâm</p>
```

---

## 🔄 **Routing Flow:**

### **Login → Dashboard:**
```
Customer Login  → /home
Technician Login → /technician
Staff Login → /staff
Manager Login → /manager
Admin Login (old) → /manager (backward compatibility)
```

### **URL Routes:**
```
/home → Home (Customer)
/staff → StaffDashboard
/technician → TechnicianDashboard
/manager → ManagerDashboard ✨ NEW
/admin → AdminDashboard (deprecated, still works)
```

---

## 📝 **Testing Checklist:**

### **Backend cần có:**
- [ ] `LoginResponse` trả về `centerId`
- [ ] User với role `manager` trong database
- [ ] User có `center_id` được gán

### **Frontend Test:**

#### **Test 1: Login với Manager**
```
1. Login với email/password của manager
2. Expected:
   ✅ Redirect về /manager
   ✅ Header hiển thị "Manager Dashboard - Center #1" (hoặc #2)
   ✅ Hiển thị fullName của manager
   ✅ Hiển thị "Quản lý trung tâm"
```

#### **Test 2: Direct Access (không login)**
```
1. Truy cập http://localhost:5173 rồi navigate /manager
2. Expected:
   ❌ Alert: "Bạn cần đăng nhập"
   ✅ Redirect về /login
```

#### **Test 3: Login với role khác**
```
1. Login với customer/staff/technician
2. Thử access /manager
3. Expected:
   ❌ Alert: "Bạn không có quyền truy cập"
   ✅ Redirect về trang phù hợp
```

#### **Test 4: Manager không có centerId**
```
1. Login với manager nhưng center_id = NULL
2. Expected:
   ❌ Alert: "Tài khoản chưa được gán vào trung tâm"
   ✅ Redirect về /login
```

---

## 🚀 **Next Steps - Apply Center Filtering:**

### **Phase 1: Update API Calls (High Priority)**

Hiện tại ManagerDashboard vẫn dùng `API.*` trực tiếp. Cần update:

```javascript
// ❌ BEFORE (không filter):
const fetchCustomers = async () => {
  const data = await API.getAllCustomers();
  setAllCustomers(data);
};

// ✅ AFTER (có filter):
import CenterAPI from '../services/centerAwareAPI';

const fetchCustomers = async () => {
  const data = await CenterAPI.getCustomers(); // Auto-filter theo center
  setAllCustomers(data);
};
```

**Các API calls cần update:**
1. `fetchCustomers()` - Xem khách hàng
2. `fetchVehicles()` - Xem xe
3. `fetchAppointments()` - Xem lịch hẹn
4. `fetchParts()` - Xem phụ tùng
5. `fetchEmployees()` - Xem nhân viên
6. `fetchReports()` - Xem báo cáo

### **Phase 2: Add Permission Checks (Medium Priority)**

Add permission checks vào UI buttons:

```javascript
// Example: Chỉ Manager mới thấy nút xóa customer
{hasPermission(role, 'DELETE_CUSTOMERS') && (
  <button onClick={handleDeleteCustomer}>
    <FaTrash /> Xóa
  </button>
)}

// Example: Chỉ Manager mới thấy tab Employees
{hasPermission(role, 'VIEW_EMPLOYEES') && (
  <button className="tab-btn" onClick={() => setActiveTab('employees')}>
    <FaUsers /> Nhân sự
  </button>
)}
```

### **Phase 3: Validate Center Access (Low Priority)**

Validate trước khi edit/delete:

```javascript
import { validateCenterAccess } from '../utils/centerFilter';

const handleEditCustomer = (customer) => {
  const { allowed, reason } = validateCenterAccess(customer, 'edit');
  
  if (!allowed) {
    alert(`Không thể chỉnh sửa: ${reason}`);
    return;
  }
  
  // Proceed...
};
```

---

## 📊 **File Structure Overview:**

```
src/
├── constants/
│   └── roles.js ✅ (4 roles: customer, technician, staff, manager)
├── utils/
│   └── centerFilter.js ✅ (center filtering utilities)
├── services/
│   └── centerAwareAPI.js ✅ (API wrapper với center logic)
├── pages/
│   ├── ManagerDashboard.jsx ✨ NEW (Manager dashboard)
│   ├── ManagerDashboard.css ✨ NEW
│   ├── AdminDashboard.jsx ⚠️ DEPRECATED (kept for compatibility)
│   ├── AdminDashboard.css (shared with ManagerDashboard)
│   ├── StaffDashboard.jsx
│   ├── TechnicianDashboard.jsx
│   ├── Login.jsx ✅ UPDATED (redirect theo role)
│   └── ...
├── App.jsx ✅ UPDATED (add /manager route)
└── ...
```

---

## ⚠️ **Important Notes:**

### **1. Backward Compatibility:**
- Route `/admin` vẫn hoạt động → render AdminDashboard
- Nếu user login với role `admin` → redirect về `/manager`
- AdminDashboard.jsx được giữ lại để tránh breaking changes

### **2. Database Migration:**
Cần update role trong database:
```sql
UPDATE users 
SET role = 'manager' 
WHERE role = 'admin' 
AND center_id IS NOT NULL;
```

### **3. Gradual Migration:**
Có thể migrate từng bước:
1. ✅ Phase 1: Tạo ManagerDashboard (DONE)
2. 🔄 Phase 2: Apply center filtering
3. 🔄 Phase 3: Add permission checks
4. ⏳ Phase 4: Remove AdminDashboard (sau khi test kỹ)

### **4. CSS Classes:**
ManagerDashboard dùng chung CSS với AdminDashboard:
```jsx
<div className="admin-dashboard manager-dashboard">
```
- `admin-dashboard` → Dùng CSS hiện tại
- `manager-dashboard` → Có thể override styles nếu cần

---

## 🐛 **Troubleshooting:**

### **Lỗi: "Bạn không có quyền truy cập"**
**Nguyên nhân:**
- User role không phải `manager`
- Database còn role `admin` chưa update

**Giải pháp:**
```sql
-- Check role của user
SELECT id, email, role, center_id FROM users WHERE email = 'your@email.com';

-- Update role nếu cần
UPDATE users SET role = 'manager' WHERE id = YOUR_USER_ID;
```

### **Lỗi: "Tài khoản chưa được gán vào trung tâm"**
**Nguyên nhân:**
- User chưa có `center_id`

**Giải pháp:**
```sql
-- Gán user vào center
UPDATE users SET center_id = 1 WHERE id = YOUR_USER_ID;
```

### **Lỗi: "Cannot read property 'centerId' of null"**
**Nguyên nhân:**
- Login response không trả về `centerId`

**Giải pháp:**
- Check backend `LoginResponse` có field `centerId`
- Update backend để return `centerId` trong login response

---

## 📞 **Support:**

Nếu gặp vấn đề:
1. Check console logs (F12)
2. Check localStorage: `centerId`, `role`, `fullName`
3. Check backend LoginResponse có trả về đủ fields
4. Xem file `ROLE_CENTER_GUIDE.md` để biết thêm chi tiết

---

**Last Updated:** November 10, 2025  
**Status:** ✅ Migration Complete - Phase 1  
**Next:** Apply Center Filtering & Permission Checks
