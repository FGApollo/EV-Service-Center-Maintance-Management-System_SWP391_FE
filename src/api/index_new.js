import axiosClient from "./axiosClient";

/* ================================
   🔐 AUTHENTICATION APIs
================================ */

// POST /api/auth/register - Đăng ký tài khoản mới
export const register = async (data) => {
  const res = await axiosClient.post("/api/auth/register", data);
  return res.data;
};

// POST /api/auth/login - Đăng nhập
export const login = async (data) => {
  const res = await axiosClient.post("/api/auth/login", data);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    if (res.data?.role) localStorage.setItem("role", res.data.role);
    if (res.data?.fullName) localStorage.setItem("fullName", res.data.fullName);
    if (res.data?.id) localStorage.setItem("userId", res.data.id);
    if (res.data?.centerId) localStorage.setItem("centerId", res.data.centerId);
  }
  return res.data;
};

/* ================================
   👤 USER & PROFILE APIs
================================ */

// GET /api/profile - Lấy thông tin profile người dùng hiện tại
export const getProfile = async () => {
  const res = await axiosClient.get("/api/profile");
  return res.data;
};

// PUT /api/update/{id} - Cập nhật thông tin user
export const updateUser = async (id, data) => {
  const res = await axiosClient.put(`/api/update/${id}`, data);
  return res.data;
};

// GET /api/users - Lấy danh sách users theo role
export const getUsersByRole = async (role) => {
  const res = await axiosClient.get("/api/users", { params: { role } });
  return res.data;
};

// GET /api/users/all_customer - Lấy tất cả customers
export const getAllCustomers = async () => {
  const res = await axiosClient.get("/api/users/all_customer");
  return res.data;
};

// GET /api/users/allTechnicians - Lấy danh sách technicians
export const getAllTechnicians = async () => {
  const res = await axiosClient.get("/api/users/allTechnicians");
  return res.data;
};

// POST /api/users/employees - Tạo employee mới (Admin/Staff)
export const createEmployee = async (role, data) => {
  const res = await axiosClient.post("/api/users/employees", data, {
    params: { role }
  });
  return res.data;
};

// DELETE /api/users/{id} - Xóa employee
export const deleteEmployee = async (id) => {
  const res = await axiosClient.delete(`/api/users/${id}`);
  return res.data;
};

/* ================================
   🚗 VEHICLE APIs
================================ */

// GET /api/vehicles - Lấy xe của user hiện tại
export const getVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles");
  return res.data;
};

// POST /api/vehicles - Thêm xe mới
export const addVehicle = async (data) => {
  const res = await axiosClient.post("/api/vehicles", data);
  return res.data;
};

// DELETE /api/vehicles/{id} - Xóa xe
export const deleteVehicle = async (id) => {
  const res = await axiosClient.delete(`/api/vehicles/${id}`);
  return res.data;
};

// GET /api/vehicles/maintained - Lấy danh sách xe đã bảo dưỡng (với thông tin owner)
export const getVehiclesMaintained = async () => {
  const res = await axiosClient.get("/api/vehicles/maintained");
  return res.data;
};

// GET /api/vehicles/{vehicleId}/appointments/latest_time - Lấy lịch hẹn gần nhất của xe
export const getLatestAppointment = async (vehicleId) => {
  const res = await axiosClient.get(`/api/vehicles/${vehicleId}/appointments/latest_time`);
  return res.data;
};

/* ================================
   📅 APPOINTMENT APIs
================================ */

// GET /api/appointments - Lấy lịch hẹn của user hiện tại
export const getAppointments = async () => {
  const res = await axiosClient.get("/api/appointments");
  return res.data;
};

// POST /api/appointments - Tạo lịch hẹn mới
export const createAppointment = async (data) => {
  const res = await axiosClient.post("/api/appointments", data);
  return res.data;
};

// GET /api/appointments/all - Lấy tất cả appointments (Admin)
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/api/appointments/all");
  return res.data;
};

// GET /api/appointments/appointments/status/{status} - Lấy appointments theo status
export const getAppointmentsByStatus = async (status) => {
  const res = await axiosClient.get(`/api/appointments/appointments/status/${status}`);
  return res.data;
};

// GET /api/appointments/status/done/{id} - Lấy appointment đã hoàn thành theo ID
export const getAppointmentDone = async (id) => {
  const res = await axiosClient.get(`/api/appointments/status/done/${id}`);
  return res.data;
};

// GET /api/appointments/staff - Lấy appointments của staff
export const getAppointmentsByStaff = async (staffId) => {
  const res = await axiosClient.get("/api/appointments/staff", {
    params: { id: staffId }
  });
  return res.data;
};

// PUT /api/appointments/{id}/accept - Chấp nhận lịch hẹn
export const acceptAppointment = async (id) => {
  const res = await axiosClient.put(`/api/appointments/${id}/accept`);
  return res.data;
};

// PUT /api/appointments/{id}/inProgress - Chuyển trạng thái sang In Progress
export const inProgressAppointment = async (id, technicianIds) => {
  const res = await axiosClient.put(`/api/appointments/${id}/inProgress`, technicianIds);
  return res.data;
};

// PUT /api/appointments/{id}/done - Hoàn thành lịch hẹn
export const doneAppointment = async (id, maintenanceData) => {
  const res = await axiosClient.put(`/api/appointments/${id}/done`, maintenanceData);
  return res.data;
};

// PUT /api/appointments/{id}/cancel - Hủy lịch hẹn
export const cancelAppointment = async (id) => {
  const res = await axiosClient.put(`/api/appointments/${id}/cancel`);
  return res.data;
};

/* ================================
   🔧 PARTS APIs
================================ */

// GET /api/auth/parts - Lấy tất cả parts
export const getAllParts = async () => {
  const res = await axiosClient.get("/api/auth/parts");
  return res.data;
};

// GET /api/auth/parts/{id} - Lấy part theo ID
export const getPartById = async (id) => {
  const res = await axiosClient.get(`/api/auth/parts/${id}`);
  return res.data;
};

// POST /api/auth/parts/create - Tạo part mới
export const createPart = async (data) => {
  const res = await axiosClient.post("/api/auth/parts/create", data);
  return res.data;
};

// PUT /api/auth/parts/update/{id} - Cập nhật part
export const updatePart = async (id, data) => {
  const res = await axiosClient.put(`/api/auth/parts/update/${id}`, data);
  return res.data;
};

// DELETE /api/auth/parts/delete/{id} - Xóa part
export const deletePart = async (id) => {
  const res = await axiosClient.delete(`/api/auth/parts/delete/${id}`);
  return res.data;
};

// POST /api/technician/part_usage - Sử dụng part
export const usePart = async (data) => {
  const res = await axiosClient.post("/api/technician/part_usage", data);
  return res.data;
};

/* ================================
   📋 MAINTENANCE RECORD APIs
================================ */

// POST /MaintainanceRecord/{appointmentId} - Tạo maintenance record
export const createMaintenanceRecord = async (appointmentId, data) => {
  const res = await axiosClient.post(`/MaintainanceRecord/${appointmentId}`, data);
  return res.data;
};

// GET /MaintainanceRecord/staff/{staffId} - Lấy maintenance records theo staff
export const getMaintenanceRecordsByStaff = async (staffId) => {
  const res = await axiosClient.get(`/MaintainanceRecord/staff/${staffId}`);
  return res.data;
};

/* ================================
   👷 STAFF ASSIGNMENT APIs
================================ */

// PUT /assignments/{appointmentId}/staff - Assign technicians cho appointment
export const assignTechnicians = async (appointmentId, technicianIds) => {
  const res = await axiosClient.put(`/assignments/${appointmentId}/staff`, technicianIds);
  return res.data;
};

// GET /assignments/free - Lấy danh sách staff rảnh
export const getFreeStaff = async () => {
  const res = await axiosClient.get("/assignments/free");
  return res.data;
};

/* ================================
   📝 WORKLOG APIs
================================ */

// POST /worklogs - Tạo worklog thủ công
export const createWorkLog = async (data) => {
  const res = await axiosClient.post("/worklogs", data);
  return res.data;
};

// POST /worklogs/{id} - Tạo worklog tự động cho appointment
export const createAutoWorkLog = async (appointmentId) => {
  const res = await axiosClient.post(`/worklogs/${appointmentId}`);
  return res.data;
};

/* ================================
   🧾 INVOICE APIs
================================ */

// POST /api/auth/invoices/create/{appointmentId} - Tạo invoice cho appointment
export const createInvoice = async (appointmentId) => {
  const res = await axiosClient.post(`/api/auth/invoices/create/${appointmentId}`);
  return res.data;
};

// GET /api/auth/invoices/revenue - Lấy doanh thu theo khoảng thời gian
export const getRevenue = async (startDate, endDate) => {
  const res = await axiosClient.get("/api/auth/invoices/revenue", {
    params: { startDate, endDate }
  });
  return res.data;
};

/* ================================
   💳 PAYMENT APIs
================================ */

// GET /api/customer/payments/create - Tạo payment link (VNPay)
export const createPayment = async (paymentDto) => {
  const res = await axiosClient.get("/api/customer/payments/create", {
    params: paymentDto
  });
  return res.data;
};

// GET /api/customer/payments/return - Xử lý callback từ VNPay
export const paymentReturn = async (params) => {
  const res = await axiosClient.get("/api/customer/payments/return", {
    params: params
  });
  return res.data;
};

/* ================================
   📊 REPORT APIs (Admin)
================================ */

// GET /api/admin/reports/revenue - Báo cáo doanh thu
export const getRevenueReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue");
  return res.data;
};

// GET /api/admin/reports/profit - Báo cáo lợi nhuận
export const getProfitReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/profit");
  return res.data;
};

// GET /api/admin/reports/trending-services/alltime - Top dịch vụ phổ biến (all time)
export const getTrendingServices = async () => {
  const res = await axiosClient.get("/api/admin/reports/trending-services/alltime");
  return res.data;
};

// GET /api/admin/reports/trending-services/last-month - Top dịch vụ tháng trước
export const getTrendingServicesLastMonth = async () => {
  const res = await axiosClient.get("/api/admin/reports/trending-services/last-month");
  return res.data;
};

// GET /api/admin/reports/trending-parts - Top 5 parts được dùng nhiều nhất tháng trước
export const getTrendingParts = async () => {
  const res = await axiosClient.get("/api/admin/reports/trending-parts");
  return res.data;
};

/* ================================
   🔔 REMINDER APIs (Test)
================================ */

// GET /api/auth/reminder/run - Chạy scheduler manually (test)
export const runReminderScheduler = async () => {
  const res = await axiosClient.get("/api/auth/reminder/run");
  return res.data;
};

/* ================================
   🚪 LOGOUT
================================ */

// Đăng xuất - xóa token và thông tin user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");
  localStorage.removeItem("centerId");
};
