# 🧪 TESTING GUIDE - MANAGER DASHBOARD

## 📋 **Pre-Test Checklist**

### **1. Backend Requirements:**

Trước khi test, cần chuẩn bị database với user có:
- ✅ `role = 'manager'` (hoặc `'admin'`)
- ✅ `center_id = 1` (hoặc `2`)
- ✅ Email & password để login

---

## 🗄️ **SETUP DATABASE**

### **Option A: Tạo Manager mới (Recommended)**

```sql
-- Tạo user mới với role manager
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at
) VALUES (
  'Manager Trung Tâm 1',
  'manager1@evservice.com',
  '$2a$10$...',  -- Hash của password "manager123"
  '0901234567',
  'manager',
  1,  -- Center 1
  NOW()
);

-- Tạo manager cho center 2
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at
) VALUES (
  'Manager Trung Tâm 2',
  'manager2@evservice.com',
  '$2a$10$...',  -- Hash của password "manager123"
  '0902345678',
  'manager',
  2,  -- Center 2
  NOW()
);
```

### **Option B: Update user hiện có**

```sql
-- Chuyển admin hiện có thành manager
UPDATE users 
SET role = 'manager', center_id = 1 
WHERE email = 'admin@example.com';

-- Hoặc update theo ID
UPDATE users 
SET role = 'manager', center_id = 1 
WHERE id = 1;
```

### **Option C: Dùng user đã có với role 'admin'**

Nếu đã có user với `role = 'admin'`:
```sql
-- Thêm center_id vào admin
UPDATE users 
SET center_id = 1 
WHERE role = 'admin' AND id = 1;
```

**Note:** Frontend sẽ redirect `admin` role → `/manager` route (backward compatibility)

---

## 🧪 **TEST CASES**

### **Test Case 1: Login với Manager**

**Steps:**
1. Mở http://localhost:5174/
2. Click "Trang Chủ" → Navigate to Login
3. Nhập credentials:
   ```
   Email: manager1@evservice.com
   Password: manager123
   ```
4. Click "Đăng xử lý..."

**Expected Results:**
- ✅ Alert: "🎉 Đăng nhập thành công!"
- ✅ Auto redirect to `/manager` route
- ✅ Hiển thị "Manager Dashboard - Center #1"
- ✅ Hiển thị tên: "Manager Trung Tâm 1"
- ✅ Không có error trong console

**Check localStorage:**
```javascript
localStorage.getItem('token')      // ✅ có token
localStorage.getItem('role')       // ✅ 'manager' hoặc 'admin'
localStorage.getItem('centerId')   // ✅ '1'
localStorage.getItem('fullName')   // ✅ 'Manager Trung Tâm 1'
localStorage.getItem('userId')     // ✅ có ID
```

---

### **Test Case 2: Kiểm tra Center Filtering**

**Setup:**
1. Login as Manager Center 1
2. Navigate to ManagerDashboard

**Check UI:**
- ✅ Header: "Manager Dashboard - Center #1"
- ✅ Tên manager hiển thị đúng
- ✅ Có các tabs: Tổng quan, Khách hàng, Phương tiện, Lịch hẹn, Nhân sự, Phụ tùng, Báo cáo

**Check Console:**
```javascript
// Mở Console (F12)
// Kiểm tra các API calls:

// ✅ Should see:
console.log('Current user:', localStorage.getItem('role'), 'Center:', localStorage.getItem('centerId'));
// Output: "Current user: manager Center: 1"
```

**Check Network Tab:**
- ✅ Các API calls có token trong header
- ✅ GET `/api/users/all_customer` - lấy customers
- ✅ GET `/api/vehicles/all` - lấy vehicles
- ✅ GET `/api/appointments/all` - lấy appointments

**Note:** Hiện tại backend **chưa filter** theo centerId, nên sẽ thấy tất cả data. Đây là expected behavior.

---

### **Test Case 3: Test Center 2 (Nếu có 2 centers)**

**Steps:**
1. Logout (clear localStorage)
2. Login with manager2@evservice.com
3. Check header shows "Center #2"

**Expected:**
- ✅ centerId trong localStorage = '2'
- ✅ Dashboard header: "Manager Dashboard - Center #2"
- ✅ (Future) Chỉ thấy data của center 2

---

### **Test Case 4: Test Backward Compatibility**

**Test với role = 'admin':**
1. Login với user có `role = 'admin'`
2. Should auto redirect to `/manager` (not `/admin`)
3. ManagerDashboard displays correctly

**Direct URL access:**
- ✅ Navigate to `http://localhost:5174/?page=admin`
- ✅ Should display AdminDashboard (deprecated)
- ✅ No errors

---

### **Test Case 5: Test Footer Navigation**

**Steps:**
1. Login as any role
2. Scroll to footer
3. Check buttons visible

**Expected:**
- ✅ 4 buttons: Staff | Technician | **Manager** (new, orange) | Admin (gray, deprecated)
- ✅ Click Manager → Navigate to `/manager`
- ✅ Click Admin → Navigate to `/admin` (deprecated route)

---

### **Test Case 6: Test Permission Checks**

**Current Implementation:**
```javascript
// ManagerDashboard.jsx đã có checks:

useEffect(() => {
  if (role !== ROLES.MANAGER) {
    alert('Bạn không có quyền truy cập!');
    onNavigate('login');
  }
  if (!centerId) {
    alert('Chưa được gán vào trung tâm!');
    onNavigate('login');
  }
}, []);
```

**Test: Login as Customer**
1. Login với role = 'customer'
2. Manually navigate to `/?page=manager`
3. **Expected:** Alert "Bạn không có quyền truy cập!" → Redirect to login

**Test: Manager without centerId**
1. Login với role = 'manager' nhưng `center_id = NULL`
2. **Expected:** Alert "Chưa được gán vào trung tâm!" → Redirect to login

---

## 🐛 **TROUBLESHOOTING**

### **Issue 1: Console Error - CORS**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Cause:** Backend chưa enable CORS cho frontend

**Fix Backend:**
```java
// Spring Boot - CorsConfig.java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5174")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

### **Issue 2: centerId is null**

**Console:**
```javascript
localStorage.getItem('centerId')  // null
```

**Cause:** Backend không trả về `centerId` trong LoginResponse

**Fix Backend:**
```java
// LoginResponse DTO
public class LoginResponse {
    private String token;
    private String role;
    private String fullName;
    private Long id;
    private Integer centerId;  // ← Thêm field này
    
    // getters/setters...
}

// AuthController.java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    User user = authService.authenticate(request.getEmail(), request.getPassword());
    
    LoginResponse response = new LoginResponse();
    response.setToken(jwtUtil.generateToken(user));
    response.setRole(user.getRole());
    response.setFullName(user.getFullName());
    response.setId(user.getId());
    response.setCenterId(user.getCenterId());  // ← Thêm dòng này
    
    return ResponseEntity.ok(response);
}
```

---

### **Issue 3: Dashboard trống - không có data**

**Symptoms:**
- ✅ Login thành công
- ✅ Redirect đúng
- ❌ Không thấy customers/appointments/vehicles

**Debug:**
1. Mở Console (F12) → Network tab
2. Check API calls:
   - ❌ Status 401? → Token invalid
   - ❌ Status 403? → No permission
   - ❌ Status 500? → Backend error
   - ✅ Status 200 but empty array? → Database empty

**Fix:**
```sql
-- Check có data không
SELECT COUNT(*) FROM users WHERE role = 'customer';
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM vehicles;

-- Nếu empty, tạo sample data
INSERT INTO users (full_name, email, role) VALUES 
('Customer 1', 'customer1@test.com', 'customer'),
('Customer 2', 'customer2@test.com', 'customer');
```

---

### **Issue 4: "Bạn không có quyền truy cập"**

**Cause:** `role` trong localStorage không phải `'manager'`

**Debug:**
```javascript
console.log('Role:', localStorage.getItem('role'));
// Output: "admin" hoặc "customer" etc.
```

**Fix:**
- Option A: Update database `role = 'manager'`
- Option B: Code already handles `'admin'` → Should work with backward compatibility

**Check Login.jsx:**
```javascript
// Line 91-104 handles redirect
case 'manager':
case 'admin': // ← Backward compatibility
  onNavigate("manager");
  break;
```

---

### **Issue 5: Manager thấy tất cả data (không filter theo center)**

**Expected Behavior (Hiện tại):**
- ⚠️ **ĐÚNG** - Frontend chưa apply filter
- ⚠️ **ĐÚNG** - Backend chưa filter theo centerId
- ⚠️ Manager sẽ thấy **TẤT CẢ** data của cả 2 centers

**Why?**
- `CenterAPI` wrapper đã tạo nhưng **chưa được dùng** trong ManagerDashboard
- Backend API chưa nhận param `centerId`

**Fix (Phase 2):**
```javascript
// BEFORE (ManagerDashboard.jsx):
const customers = await getAllCustomers();

// AFTER:
import CenterAPI from '../services/centerAwareAPI';
const customers = await CenterAPI.getCustomers(); // ✅ Auto-filtered
```

---

## ✅ **SUCCESS CRITERIA**

### **Minimum Viable Test:**
- [x] Có user với `role='manager'` và `centerId=1` trong database
- [x] Login thành công
- [x] Redirect to `/manager`
- [x] Dashboard hiển thị "Center #1"
- [x] No console errors (except CORS - acceptable)
- [x] localStorage có đủ: token, role, centerId, fullName, userId

### **Complete Test (Future):**
- [ ] Manager Center 1 chỉ thấy data Center 1
- [ ] Manager Center 2 chỉ thấy data Center 2
- [ ] Permission checks working (buttons hidden by role)
- [ ] Backend filtering by centerId

---

## 📝 **TEST LOG TEMPLATE**

Copy template này để log test results:

```
=== TEST EXECUTION LOG ===
Date: [DATE]
Tester: [YOUR NAME]
Branch: admin
Commit: [COMMIT HASH]

--- Test Case 1: Login Manager ---
✅/❌ Login successful
✅/❌ Redirect to /manager
✅/❌ Dashboard header shows "Center #1"
✅/❌ localStorage has centerId
Notes: [ANY ISSUES]

--- Test Case 2: Center Filtering ---
✅/❌ Header shows correct center ID
✅/❌ API calls successful
✅/❌ Data displays (note: not filtered yet - expected)
Notes: [ANY ISSUES]

--- Test Case 3: Footer Navigation ---
✅/❌ Manager button visible
✅/❌ Manager button works
✅/❌ Admin button deprecated styling
Notes: [ANY ISSUES]

--- Overall Status ---
🟢 PASS / 🟡 PARTIAL / 🔴 FAIL
Blockers: [LIST ANY BLOCKERS]
Next Steps: [WHAT TO DO NEXT]
```

---

## 🚀 **NEXT STEPS AFTER TESTING**

### **If Test PASS ✅:**
1. Apply `CenterAPI` to ManagerDashboard
2. Add permission checks to UI buttons
3. Request backend to add centerId filtering
4. Re-test with actual filtering

### **If Test FAIL ❌:**
1. Check error messages in console
2. Verify database setup
3. Check backend logs
4. Reference troubleshooting section above
5. Ask for help if stuck

---

## 📞 **SUPPORT**

**Documentation:**
- `MIGRATION_SUMMARY.md` - Full migration guide
- `ROLE_CENTER_GUIDE.md` - Role system documentation
- `ADMIN_ROLE_EXPANSION.md` - Future admin role guide

**Key Files:**
- `src/pages/ManagerDashboard.jsx` - Manager dashboard
- `src/constants/roles.js` - Role definitions
- `src/utils/centerFilter.js` - Filtering utilities
- `src/api/index.js` - API calls (line 21 - centerId handling)

**Debug Commands:**
```javascript
// In browser console:
console.log({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  centerId: localStorage.getItem('centerId'),
  fullName: localStorage.getItem('fullName'),
  userId: localStorage.getItem('userId')
});
```

---

**Version:** 1.0  
**Last Updated:** November 10, 2025  
**Status:** Ready for Testing 🧪
