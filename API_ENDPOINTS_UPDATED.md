# 📋 API Endpoints - Đã Cập Nhật Theo OpenAPI Spec

> **Ngày cập nhật**: November 13, 2025  
> **Trạng thái**: ✅ Hoàn thành - Đã sync với OpenAPI specification từ backend

## 🔧 Cấu hình

### Backend URL
- **Local**: `http://localhost:8080` (đã thay đổi sang **render** trong `config.js`)
- **Render**: `https://ev-service-center-maintance-management-um2j.onrender.com`

### Token Authentication
- Tất cả API (trừ `/auth/login` và `/auth/register`) đều yêu cầu token
- Token được gửi qua header: `Authorization: Bearer <token>`
- Token được lưu trong `localStorage` sau khi login thành công

---

## 📑 Danh Sách API Endpoints

### 🧾 Authentication
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| POST | `/api/auth/register` | `RegisterUserDto` | ❌ | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | `LoginRequest` | ❌ | Đăng nhập |

### 👤 User Management
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| GET | `/api/profile` | - | ✅ | Xem hồ sơ user hiện tại |
| PUT | `/api/auth/update/{id}` | `UpdateUserRequest` | ✅ | Cập nhật thông tin user |
| GET | `/api/users?role={role}` | `role` (query) | ✅ | Lấy users theo role |
| GET | `/api/users/all_customer` | - | ✅ | Lấy tất cả customers |
| GET | `/api/users/allTechnicians` | - | ✅ | Lấy tất cả technicians |
| POST | `/api/users/employees?role={role}` | `RegisterUserDto`, `role` (query) | ✅ | Tạo employee mới |
| DELETE | `/api/users/{id}` | `id` (path) | ✅ | Xóa employee |

### 🚗 Vehicles
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| GET | `/api/vehicles` | - | ✅ | Lấy danh sách xe của user |
| GET | `/api/vehicles/maintained` | - | ✅ | Lấy xe đã bảo dưỡng |
| GET | `/api/vehicles/{vehicleId}/appointments/latest_time` | `vehicleId` (path) | ✅ | Lấy lịch hẹn gần nhất |
| POST | `/api/vehicles` | `VehicleDto` | ✅ | Thêm xe mới |
| DELETE | `/api/vehicles/{id}` | `id` (path) | ✅ | Xóa xe |

### 🏢 Service Centers
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| GET | `/api/center` | - | ✅ | Lấy tất cả centers |
| POST | `/api/center` | `CenterDTO` | ✅ | Tạo center mới (Admin) |
| PUT | `/api/center/{id}` | `CenterDTO`, `id` (path) | ✅ | Cập nhật center (Admin) |
| DELETE | `/api/center/{id}` | `id` (path) | ✅ | Xóa center (Admin) |

### 🕒 Appointments
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| GET | `/api/appointments` | - | ✅ | Lấy appointments của customer |
| GET | `/api/appointments/all` | - | ✅ | Lấy tất cả appointments (Staff) |
| GET | `/api/appointments/appointments/status/{status}` | `status` (path) | ✅ | Lấy appointments theo status |
| GET | `/api/appointments/staff?id={staffId}` | `id` (query) | ✅ | Lấy appointments của staff |
| GET | `/api/appointments/status/{id}` | `id` (path) | ✅ | Lấy chi tiết appointment |
| POST | `/api/appointments` | `AppointmentRequest` | ✅ | Đặt lịch mới (Customer) |
| PUT | `/api/appointments/{id}/accept` | `id` (path) | ✅ | Chấp nhận appointment (Staff) |
| PUT | `/api/appointments/{id}/cancel` | `id` (path) | ✅ | Hủy appointment |
| PUT | `/api/appointments/{id}/inProgress` | `number[]` (body), `id` (path) | ✅ | Bắt đầu thực hiện (Staff) |
| PUT | `/api/appointments/{id}/done` | `MaintainanceRecordDto` (body), `id` (path) | ✅ | Hoàn thành (Staff) |

### 👥 Staff Assignment
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| PUT | `/assignments/{appointmentId}/staff` | `StaffAssignmentRequest`, `appointmentId` (path) | ✅ | Giao việc cho technicians |
| GET | `/assignments/free` | - | ✅ | Lấy danh sách staff rảnh |

**StaffAssignmentRequest** format:
```json
{
  "staffIds": [1, 2, 3],
  "notes": "Optional notes"
}
```

### 🔧 Parts
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| GET | `/api/auth/parts` | - | ✅ | Lấy tất cả parts |
| GET | `/api/auth/parts/{id}` | `id` (path) | ✅ | Lấy part theo ID |
| POST | `/api/auth/parts/create` | `Part` | ✅ | Tạo part mới |
| PUT | `/api/auth/parts/update/{id}` | `Part`, `id` (path) | ✅ | Cập nhật part |
| DELETE | `/api/auth/parts/delete/{id}` | `id` (path) | ✅ | Xóa part |
| POST | `/api/technician/part_usage` | `PartUsageRequest` | ✅ | Sử dụng part (Technician) |

### 🧾 Invoices
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| POST | `/api/auth/invoices/create/{appointmentId}` | `appointmentId` (path) | ✅ | Tạo invoice (Staff) |
| GET | `/api/auth/invoices/revenue?startDate={date}&endDate={date}` | `startDate`, `endDate` (query) | ✅ | Lấy doanh thu |

### 💳 Payments
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| POST | `/api/customer/payments/create` | `PaymentDto` | ✅ | Tạo payment (Customer) |
| GET | `/api/auth/payments/return` | Query params from gateway | ❌ | Payment callback (Public) |

**PaymentDto** format:
```json
{
  "invoiceId": 123,
  "method": "online",
  "clientIp": "127.0.0.1"
}
```

### 📋 Maintenance Records
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| POST | `/MaintainanceRecord/{appointmentId}` | `MaintainanceRecordDto`, `appointmentId` (path) | ✅ | Tạo record |
| GET | `/MaintainanceRecord/all` | - | ✅ | Lấy tất cả records |
| GET | `/MaintainanceRecord/all/serviceCenter` | - | ✅ | Lấy records theo center |
| GET | `/MaintainanceRecord/staff/{staffId}` | `staffId` (path) | ✅ | Lấy records theo staff |

### 📝 Worklogs
| Method | Endpoint | Params | Auth | Mô tả |
|--------|----------|--------|------|-------|
| POST | `/worklogs` | `WorkLogDto` | ✅ | Tạo worklog thủ công |
| POST | `/worklogs/{id}` | `id` (path) | ✅ | Tạo worklog tự động |
| GET | `/worklogs/center` | - | ✅ | Lấy worklogs theo center |

### 📊 Reports (Manager/Admin)
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/management/reports/revenue` | ✅ | Báo cáo doanh thu theo tháng |
| GET | `/api/management/reports/revenue/current-month` | ✅ | Doanh thu tháng hiện tại |
| GET | `/api/management/reports/revenue/service` | ✅ | Doanh thu theo dịch vụ |
| GET | `/api/management/reports/center` | ✅ | Doanh thu theo center |
| GET | `/api/management/reports/profit` | ✅ | Báo cáo lợi nhuận |
| GET | `/api/management/reports/expense/current-month` | ✅ | Chi phí tháng hiện tại |
| GET | `/api/management/reports/trending-services/alltime` | ✅ | Top dịch vụ (all time) |
| GET | `/api/management/reports/trending-services/last-month` | ✅ | Top dịch vụ (tháng trước) |
| GET | `/api/management/reports/trending-parts` | ✅ | Top 5 parts (tháng trước) |
| GET | `/api/management/reports/parts/stock-report` | ✅ | Báo cáo tồn kho |
| GET | `/api/management/reports/payment-methods` | ✅ | Thống kê thanh toán |

### 🔔 Reminders (Test)
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/auth/reminder/run` | ✅ | Chạy scheduler manually |

---

## 🔄 Breaking Changes

### ❌ Các endpoints đã loại bỏ (không có trong OpenAPI spec):
- `GET /api/vehicles/serviced` → Dùng `/api/vehicles/maintained`
- `GET /api/vehicles/vin/{vin}` → Không còn trong spec
- `GET /api/vehicles/{id}` (get by ID) → Không còn trong spec
- `PUT /api/vehicles/{id}` (update) → Không còn trong spec
- `POST /api/auth/change-password` → Không còn trong spec

### ✅ Các endpoint đã sửa format:
- **Staff Assignment**: Body thay đổi từ `number[]` → `StaffAssignmentRequest { staffIds, notes }`
- **Payment Create**: Thay đổi từ GET với query params → POST với body `PaymentDto`

---

## 🐛 Sửa Lỗi

### Lỗi 403 Forbidden
Nếu gặp lỗi 403:
1. **Kiểm tra token**: Token có thể đã hết hạn
2. **Kiểm tra backend**: Backend có đang chạy không?
3. **Thử đăng nhập lại**: Token mới sẽ được tạo

### Debug Tools
File `axiosClient.js` đã được cập nhật với:
- ✅ Logging cho mọi request (URL, token status)
- ✅ Logging cho mọi response (success/error)
- ✅ Auto-clear token và redirect khi token hết hạn
- ✅ Alert user khi cần đăng nhập lại

### Test Backend Connection
```powershell
# Test login endpoint
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"manager@example.com","password":"123456"}'
```

---

## 📝 Notes

- **Token Management**: Token được lưu tự động sau khi login, tự động gửi trong mọi request
- **Error Handling**: Tất cả lỗi 401/403 đều được xử lý tự động (clear token, alert user)
- **Backward Compatibility**: Các alias functions được giữ lại cho code cũ

---

## 🚀 Next Steps

1. ✅ **Cập nhật API endpoints** - DONE
2. ✅ **Sửa format request body** - DONE (StaffAssignmentRequest)
3. ✅ **Thêm logging & error handling** - DONE
4. ⏳ **Test tất cả endpoints với backend** - TODO
5. ⏳ **Cập nhật components để dùng API mới** - TODO

---

**Liên hệ**: Team EV Service Center  
**Backend Spec**: OpenAPI 3.0.1
