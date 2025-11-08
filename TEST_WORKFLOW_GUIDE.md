# 🧪 Test Workflow Guide - Appointment với Technician Assignment

## ✅ Backend API đã hoạt động

Bạn đã có API endpoint hoàn chỉnh:

```
GET http://localhost:8080/api/appointments/status/49
```

**Response mẫu:**
```json
{
  "appointmentId": 49,
  "phone": "0987654321",
  "customerName": "Dùng Thanh Nộ",
  "vehicleModel": "Loin Model 2",
  "serviceCenterName": "EV Center HCM",
  "appointmentDate": "2025-11-10T09:00:00Z",
  "serviceNames": ["Brake Service"],
  "status": "in_progress",
  "techIds": "38",
  "users": [
    {
      "id": 38,
      "fullName": "Nguyen Van D",
      "email": "technicianD@example.com",
      "phone": "0987654321",
      "role": "technician",
      "status": "active",
      "vehicles": []
    }
  ]
}
```

## 🔄 Test Workflow Hoàn Chỉnh

### **Test 1: Xác nhận appointment (Pending → Accepted)**

1. **Tạo appointment mới với status "pending"**
2. **Frontend action:**
   - Chọn appointment trong list
   - Click button "Xác nhận"

3. **Expected API call:**
   ```javascript
   PUT /api/appointments/49/accept
   ```

4. **Expected result:**
   - Status chuyển thành "accepted"
   - Hiển thị button "Giao việc"
   - Console log: `✅ Accepted: { status: 'accepted' }`

---

### **Test 2: Giao việc cho kỹ thuật viên (Accepted → Assigned)**

1. **Frontend action:**
   - Click button "Giao việc"
   - Modal hiện ra với danh sách kỹ thuật viên
   - Chọn 1 hoặc nhiều kỹ thuật viên (VD: chọn ID 38)
   - Click "Xác nhận giao việc"

2. **Expected API call:**
   ```javascript
   PUT /api/assignments/49/staff
   Body: [38]
   ```

3. **Expected response:**
   ```json
   [
     {
       "id": 38,
       "fullName": "Nguyen Van D",
       "email": "technicianD@example.com",
       "phone": "0987654321",
       "appointmentId": 49,
       "working": false
     }
   ]
   ```

4. **Expected result:**
   - Modal đóng lại
   - Appointment detail hiển thị "Đã giao việc"
   - Section "Danh sách kỹ thuật viên" hiển thị card với thông tin:
     - Tên: Nguyen Van D
     - Email: technicianD@example.com
     - Phone: 0987654321
   - Console logs:
     ```
     ✅ Assigned: [...]
     🔄 Fetching appointment detail from DATABASE (with techIds): 49
     ✅ Fetched from NEW API (has techIds & users from DATABASE)
     🎯 techIds: "38"
     👥 users: 1
     ```

5. **Backend verification:**
   - Database table `appointments`: column `tech_ids` = "38"
   - Database table `staff_assignments`: có record mới với `appointment_id=49, staff_id=38`

---

### **Test 3: Bắt đầu thực hiện (Accepted → In Progress)**

1. **Frontend action:**
   - Click button "Bắt đầu làm việc"

2. **Expected API call:**
   ```javascript
   PUT /api/appointments/49/inProgress
   Body: [38]
   ```

3. **Expected result:**
   - Status chuyển thành "in_progress"
   - Vẫn hiển thị thông tin kỹ thuật viên đã giao trước đó
   - Console logs:
     ```
     🚀 Starting appointment with techIds: [38]
     ✅ Started: { status: 'in_progress', techIds: '38' }
     ```

---

### **Test 4: Reload page - Verify persistence**

1. **Frontend action:**
   - Press F5 to reload page

2. **Expected API calls:**
   ```javascript
   GET /api/appointments/all
   // hoặc
   GET /api/appointments/appointments/status/in_progress
   ```

3. **Expected response (from list API):**
   ```json
   [
     {
       "appointmentId": 49,
       "status": "in_progress",
       "techIds": "38",
       "users": [
         {
           "id": 38,
           "fullName": "Nguyen Van D",
           "role": "technician"
         }
       ]
     }
   ]
   ```

4. **Expected result:**
   - Appointment vẫn hiển thị trong list
   - Click vào appointment
   - Detail hiển thị đúng technician: "Nguyen Van D"
   - Console logs:
     ```
     🔍 Loading appointment detail: { id: 49, status: 'in_progress' }
     ✅ Using new API with full tech details: /api/appointments/status/49
     ✅ Appointment detail loaded (with techIds & users): { techIds: "38", usersCount: 1 }
     ✅ Merged appointment data: { techIds: "38", users: 1, hasAssignment: true }
     ```

---

### **Test 5: Hoàn thành appointment**

1. **Frontend action:**
   - Click button "Hoàn thành"

2. **Expected API call:**
   ```javascript
   PUT /api/appointments/49/done
   Body: {
     "vehicleCondition": "",
     "checklist": "",
     "remarks": "",
     "partsUsed": [],
     "staffIds": [38]
   }
   ```

3. **Expected result:**
   - Status chuyển thành "completed"
   - Vẫn hiển thị thông tin kỹ thuật viên
   - Technician status `working` chuyển về `false`

---

### **Test 6: Verify techIds sau nhiều status changes**

**Test sequence:**
```
1. Pending → Accept → status: "accepted", techIds: null
2. Accepted → Assign(38,39) → status: "accepted", techIds: "38,39"
3. Accepted → Start → status: "in_progress", techIds: "38,39"
4. F5 Reload → Fetch from DB → techIds vẫn: "38,39"
5. In Progress → Complete → status: "completed", techIds: "38,39"
6. F5 Reload → Fetch from DB → techIds vẫn: "38,39"
```

**Expected:**
- Mỗi step đều hiển thị đúng 2 technicians
- techIds không bao giờ bị mất
- UI hiển thị tên đầy đủ: "Nguyen Van D, Nguyen Van E"

---

## 🐛 Debug Checklist

### **Nếu techIds bị mất sau khi reload:**

1. **Check Console logs:**
   ```
   🔬 Sample appointment structure: {...}
   👥 Tech assignment fields: { techIds: ?, users: ? }
   ```
   - Nếu `techIds: null` → Backend không trả về
   - Nếu `users: []` → Backend không trả về users array

2. **Check Backend API response:**
   ```bash
   curl http://localhost:8080/api/appointments/all
   # hoặc
   curl http://localhost:8080/api/appointments/status/49
   ```
   - Verify response có `techIds` field
   - Verify response có `users` array với technicians

3. **Check Database:**
   ```sql
   SELECT id, status, tech_ids FROM appointments WHERE id = 49;
   SELECT * FROM staff_assignments WHERE appointment_id = 49;
   ```
   - Verify `tech_ids` column có data
   - Verify `staff_assignments` có records

### **Nếu users array không có technicians:**

1. **Check Backend query:**
   - Có filter users theo `techIds` không?
   - Có join với `staff_assignments` table không?

2. **Check response structure:**
   - `users` array có chứa cả customer không?
   - Frontend có filter theo `role === 'technician'` không? ✅ (Đã có)

### **Nếu hiển thị sai tên:**

1. **Check Console logs:**
   ```
   ✅ Parsed technicians from users array: [...]
   ✅ Mapped staffs from techIds: [...]
   ```

2. **Verify mapping logic:**
   - Frontend có map `techIds` với `users` array không? ✅ (Đã có)
   - Có fallback khi không tìm thấy? ✅ (Đã có)

---

## 📊 Success Criteria

### ✅ **Pass nếu:**

1. **Persistence:**
   - [ ] techIds được lưu vào database sau khi assign
   - [ ] techIds không bị mất sau reload
   - [ ] techIds không bị mất sau status change

2. **UI Display:**
   - [ ] Hiển thị đúng tên kỹ thuật viên (không phải "Kỹ thuật viên #38")
   - [ ] Hiển thị đầy đủ email, phone
   - [ ] Section "Danh sách kỹ thuật viên" hiển thị cards đẹp

3. **API Integration:**
   - [ ] API `/api/appointments/status/{id}` trả về đúng techIds
   - [ ] API trả về users array với technicians
   - [ ] Frontend fetch và parse đúng

4. **Workflow:**
   - [ ] Pending → Accepted: OK
   - [ ] Accepted → Assign → In Progress: OK, techIds retained
   - [ ] In Progress → Completed: OK, techIds retained
   - [ ] Reload at any stage: OK, techIds loaded from DB

### ❌ **Fail nếu:**

1. techIds bị null sau reload
2. users array không có technicians
3. Hiển thị "Kỹ thuật viên #38" thay vì tên thật
4. Console có error: "❌ Error loading appointment detail"

---

## 🎯 Next Steps

1. **Test workflow với backend thật:**
   ```bash
   # Start backend
   cd backend
   ./mvnw spring-boot:run
   
   # Start frontend
   cd frontend
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **Login as STAFF**

4. **Follow test sequence trên**

5. **Check Console logs** để verify mọi step

6. **Báo lại kết quả:**
   - ✅ Nếu pass all tests
   - ❌ Nếu có lỗi, gửi screenshot + console logs

---

## 📝 API Endpoints Summary

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|--------------|----------|
| `/api/appointments/{id}/accept` | PUT | Xác nhận | `{}` | `{ status: 'accepted' }` |
| `/api/assignments/{id}/staff` | PUT | Giao việc | `[38, 39]` | `[{ id: 38, fullName: '...' }]` |
| `/api/appointments/{id}/inProgress` | PUT | Bắt đầu | `[38, 39]` | `{ status: 'in_progress', techIds: '38,39' }` |
| `/api/appointments/{id}/done` | PUT | Hoàn thành | `{ staffIds: [38,39], ... }` | `{ status: 'completed' }` |
| `/api/appointments/status/{id}` | GET | Chi tiết | - | `{ techIds: '38,39', users: [...] }` |
| `/api/appointments/all` | GET | Danh sách | - | `[{ techIds: '38,39', users: [...] }]` |

Good luck testing! 🚀

