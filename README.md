# EV Service Center Maintenance Management System

## Business Overview / Tổng quan nghiệp vụ

**VI**: Đây là hệ thống quản lý vận hành cho **trung tâm dịch vụ xe điện (EV Service Center)**, bao phủ toàn bộ vòng đời chăm sóc xe của khách hàng: **đặt lịch → tiếp nhận → phân công kỹ thuật viên → thực hiện bảo dưỡng/sửa chữa → đề xuất linh kiện thay thế → xuất hóa đơn → thanh toán → báo cáo vận hành**. Mục tiêu là giúp trung tâm **giảm thời gian xử lý**, **kiểm soát kho linh kiện**, **chuẩn hóa quy trình**, và **tăng tính minh bạch** với khách hàng.

**EN**: This system is an **operations management platform for EV service centers**, covering the full customer service lifecycle: **booking → check-in → technician assignment → maintenance/repair execution → suggested replacement parts → invoicing → payment → operational reporting**. It helps service centers **reduce turnaround time**, **control parts inventory**, **standardize workflows**, and **increase transparency** for customers.

---

## System Components / Thành phần hệ thống

- **Backend (BE)**: Spring Boot (Java), Spring Security (JWT), Maven, Dockerfile
- **Frontend (FE)**: React + Vite, Axios client

---

## Frontend Routes (UI) / Tuyến trang giao diện

From `src/routes.jsx`:

- `/` or `/home`: Home
- `/login`: Login
- `/booking`: Booking
- `/payment`: Payment Gateway
- `/payment-return`: Payment result
- `/profile`: Profile
- `/mycar`: My Cars
- `/staff`: Staff Dashboard
- `/technician`: Technician Dashboard
- `/admin`: Admin Dashboard
- `/manager/*`: Manager Dashboard (with sub-routes)

---

## Features by Role / Chức năng theo vai trò

> Notes / Ghi chú:
> - BE đang dùng phân quyền qua `@PreAuthorize(...)` với authorities: `customer`, `staff`, `technician`, `manager`, `admin`.
> - Danh sách dưới đây tổng hợp theo controller và các API đã thấy trong code.

### 1) Customer / Khách hàng

**VI**
- Đăng ký/Đăng nhập
- Quản lý hồ sơ cá nhân
- Quản lý xe (thêm/xóa/xem danh sách xe của mình)
- Đặt lịch bảo dưỡng/sửa chữa và theo dõi trạng thái lịch hẹn
- Xem gói dịch vụ (service types)
- Xem danh sách linh kiện được đề xuất cho từng lịch hẹn và **chấp nhận/từ chối**
- Nhận hóa đơn (theo lịch hẹn)
- Thanh toán online và xem lịch sử thanh toán

**EN**
- Register/Login
- Manage profile
- Manage vehicles (add/delete/list own vehicles)
- Create appointments and track appointment status
- View service packages (service types)
- View suggested parts per appointment and **accept/deny**
- View invoice (by appointment)
- Pay online and view payment history

### 2) Staff / Nhân viên

**VI**
- Tiếp nhận và xử lý lịch hẹn (duyệt/chấp nhận, hủy, chuyển trạng thái in-progress, bàn giao)
- Phân công kỹ thuật viên cho lịch hẹn (gán staff/technician)
- Xem danh sách kỹ thuật viên
- Xem danh sách khách hàng
- Thanh toán tiền mặt cho hóa đơn
- Xem linh kiện được đề xuất và có thể chấp nhận/từ chối (theo API)

**EN**
- Process appointments (accept, cancel, move to in-progress, handover)
- Assign technicians to appointments
- List technicians
- List customers
- Create cash payment for invoices
- Manage suggested parts (accept/deny)

### 3) Technician / Kỹ thuật viên

**VI**
- Xem các lịch hẹn được giao
- Cập nhật trạng thái xử lý (in-progress, done/waiting)
- Tạo/cập nhật phiếu bảo dưỡng (maintenance record)
- Gửi đề xuất linh kiện cần thay thế cho lịch hẹn
- Xem danh sách linh kiện

**EN**
- View assigned appointments
- Update appointment progress (in-progress, done/waiting)
- Create/update maintenance records
- Submit suggested replacement parts for an appointment
- View parts list

### 4) Manager / Quản lý trung tâm

**VI**
- Quản lý nhân sự trong hệ thống (tạo/xóa nhân viên theo role, xem danh sách theo role)
- Quản lý kho linh kiện theo Service Center (xem tồn, cập nhật số lượng)
- Xem báo cáo doanh thu/lợi nhuận/chi phí/xu hướng dịch vụ & linh kiện
- Xem danh sách hóa đơn đã thanh toán và chi tiết hóa đơn
- Xem danh sách kỹ thuật viên rảnh để điều phối
- Xem lịch sử bảo dưỡng theo center (maintenance records)

**EN**
- Manage employees (create/delete employees by role, list users by role)
- Manage service center inventory (view stock, update quantities)
- View revenue/profit/expense and trending services/parts reports
- View paid invoices list and invoice details
- Find free technicians for scheduling
- View maintenance records by service center

### 5) Admin / Quản trị hệ thống

**VI**
- Quản lý danh mục gói dịch vụ (service types)
- Quản lý trung tâm dịch vụ (Service Centers)
- Quản lý nhân sự (tạo/xóa nhân viên) và xem danh sách user theo role
- Quản lý danh sách linh kiện (parts) (tùy theo quyền trong API)

**EN**
- Manage service packages (service types)
- Manage service centers
- Manage employees (create/delete) and list users by role
- Manage parts catalog (depending on API permissions)

---

## API Modules / Các module API chính (Backend)

### A) Authentication & User Profile / Xác thực & hồ sơ
- `POST /api/auth/register` — Register customer
- `POST /api/auth/login` — Login (returns token)
- `PUT /api/update/{id}` — Update user info

### B) Vehicles / Xe
- `GET /api/vehicles` — List customer vehicles (`customer`)
- `POST /api/vehicles` — Add vehicle (`customer`, `staff`)
- `DELETE /api/vehicles/{id}` — Delete vehicle (`customer`)
- `GET /api/vehicles/{vehicleId}/appointments/latest_time` — Latest appointment time
- `GET /api/vehicles/maintained` — Vehicles with completed maintenance (no explicit auth in controller)
- `GET /api/vehicles/all` — All vehicles (`admin`)

### C) Appointments / Lịch hẹn
- `POST /api/appointments` — Create appointment (`customer`)
- `GET /api/appointments` — Get current customer appointments (`customer`)
- `PUT /api/appointments/{id}/accept` — Accept (`staff`, `manager`)
- `PUT /api/appointments/{id}/cancel` — Cancel (`staff`, `manager`)
- `PUT /api/appointments/{id}/inProgress` — Mark in progress (`staff`, `manager`, `technician`)
- `PUT /api/appointments/{id}/waiting` — Mark awaiting pickup (`staff`, `manager`, `technician`)
- `PUT /api/appointments/{id}/handover` — Handover (`staff`)
- `GET /api/appointments/appointments/status/{status}` — List by status (center) (`staff`, `manager`, `technician`)
- `GET /api/appointments/status/{id}` — Appointment details by id (`staff`, `manager`, `technician`)
- `GET /api/appointments/staff/{id}` — Appointments by staff id (`staff`, `technician`, `manager`)
- `GET /api/appointments/all` — All appointments (`staff`, `manager`, `admin`)

### D) Staff Assignment / Phân công nhân sự
- `PUT /api/assignments/{appointmentId}/staff` — Assign technicians (`staff`, `manager`)
- `GET /api/assignments/free` — Find free technicians (`manager`, `staff`)

### E) Maintenance Records / Phiếu bảo dưỡng
- `POST /api/MaintainanceRecord/{appointmentId}` — Create/update record (`technician`)
- `GET /api/MaintainanceRecord/staff/{staffId}` — Records by staff (`staff`, `manager`, `technician`)
- `GET /api/MaintainanceRecord/all` — All records (`manager`)
- `GET /api/MaintainanceRecord/all/serviceCenter/{centerId}` — Records by center (`manager`)

### F) Suggested Parts / Đề xuất linh kiện
- `POST /api/suggested_part` — Technician submits suggested parts (`technician`)
- `GET /api/suggested_part/{appointmentId}` — List suggested parts for appointment (`customer`, `staff`, `technician`)
- `GET /api/suggested_part/all` — Customer list all suggested parts (`customer`)
- `PUT /api/suggested_part/{id}/accept` — Accept (`customer`, `staff`)
- `PUT /api/suggested_part/{id}/deny` — Deny (`customer`, `staff`)

### G) Parts Catalog / Danh mục linh kiện
- `GET /api/management2/parts` — List parts (`manager`, `technician`, `admin`, `staff`)
- `GET /api/management2/parts/{id}` — Part by id (`manager`, `admin`)
- `POST /api/management2/parts/create` — Create part (`manager`, `admin`) (also binds to current user center)
- `PUT /api/management2/parts/update/{id}` — Update part (`manager`, `admin`)
- `DELETE /api/management2/parts/delete/{id}` — Delete part (`manager`, `admin`)

### H) Inventory / Kho linh kiện
- `GET /api/management/inventory/parts` — View stock by center
- `PUT /api/management/inventory/{partId}?quantity={quantity}` — Update stock quantity by center

### I) Invoices / Hóa đơn
- `POST /api/auth/invoices/create/{appointmentId}` — Create invoice
- `POST /api/auth/invoices/part/{appointmentId}` — Create part invoice
- `GET /api/auth/invoices/customer/{appointmentId}` — Customer invoice data
- `GET /api/auth/invoices/{id}/download` — Download invoice PDF
- `GET /api/auth/invoices/revenue?startDate=...&endDate=...` — Revenue by date range

### J) Payments / Thanh toán
- `POST /api/customer/payments/create` — Create payment url
- `GET /api/auth/payments/return` — Payment return/callback (redirect to FE)
- `GET /api/customer/payments/history` — Payment history
- `POST /api/refunds` — Create refund (staff/manager)
- `GET /api/auth/refund/return` — Refund callback
- `PUT /api/cash-payment/{invoiceId}` — Cash payment (staff/manager)
- `POST /api/part-payments/{appointmentId}` — Part payment url (staff)

### K) Reports / Báo cáo
Base path: `/api/management/reports`
- `GET /trending-parts`
- `GET /trending-services/last-month`
- `GET /trending-services/alltime`
- `GET /revenue`
- `GET /profit`
- `GET /revenue/current-month`
- `GET /expense/current-month`
- `GET /revenue/service`
- `GET /revenue/service/current-month`
- `GET /payment-methods`
- `GET /parts/stock-report`
- `GET /center` — Revenue stats by center (uses current user center)
- `GET /invoices` — Paid invoices by center
- `GET /invoices/{invoiceId}` — Invoice details

### L) Service Centers / Trung tâm dịch vụ
- `GET /api/center` — List centers (`admin`, `customer`)
- `POST /api/center` — Create center (`admin`)
- `PUT /api/center/{id}` — Update center (`admin`)
- `DELETE /api/center/{id}` — Deactivate center (`admin`)

### M) Worklogs / Nhật ký công việc
- `POST /api/worklogs` — Create worklog (`manager`)
- `GET /api/worklogs/center/{centerId}` — List worklogs by center (`manager`)

### N) Chat (WebSocket) / Chat realtime
**VI**
- Hệ thống có module chat realtime sử dụng STOMP/WebSocket.
- Customer gửi message vào `/app/chat.send`.
- Staff subscribe danh sách session tại `/topic/staff/sessions` và nội dung chat theo phòng tại `/topic/chat/{sessionId}`.
- Có event `CREATED` và `CLOSED` để staff mở/đóng chatbox theo session.

**EN**
- Realtime chat module via STOMP/WebSocket.
- Customer sends messages to `/app/chat.send`.
- Staff subscribes sessions via `/topic/staff/sessions` and room messages via `/topic/chat/{sessionId}`.
- Session lifecycle events: `CREATED` and `CLOSED`.

---

## Quickstart / Chạy dự án

### Backend
```bash
cd Ev-System
./mvnw spring-boot:run
```

### Frontend
```bash
npm install
npm run dev
```

---

## Environment Notes / Cấu hình môi trường

- FE config `baseURL` in `src/api/config.js` to point to BE.
- FE stores `token` in `localStorage` after login.

---

## Next Improvements / Gợi ý hoàn thiện

**VI**
- Bổ sung Swagger/OpenAPI link vào README để dễ test API.
- Chuẩn hóa quyền truy cập (một số endpoint chưa có `@PreAuthorize`).
- Mô tả chuẩn các trạng thái appointment (pending/accepted/in_progress/awaiting_pickup/completed/cancelled...) và chuyển trạng thái hợp lệ.

**EN**
- Add Swagger/OpenAPI link for easier API testing.
- Normalize authorization rules (some endpoints have no `@PreAuthorize`).
- Document appointment statuses and valid transitions.
