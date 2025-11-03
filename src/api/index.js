import axiosClient from "./axiosClient";

/* --------------------------------
   🧾 AUTHENTICATION
---------------------------------- */

// Đăng ký (❌ Không cần token)
export const register = async (data) => {
  const res = await axiosClient.post("/api/auth/register", data);
  return res.data;
};

// Đăng nhập (❌ Không cần token)
export const login = async (data) => {
  const res = await axiosClient.post("/api/auth/login", data);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

/* --------------------------------
   👤 USER PROFILE
---------------------------------- */

// Cập nhật hồ sơ (✅ Cần token)
export const updateProfile = async (userId, data) => {
  const res = await axiosClient.put(`/api/update/${userId}`, data);
  return res.data;
};

// Xem hồ sơ người dùng (✅ Cần token)
export const getProfile = async () => {
  const res = await axiosClient.get("/api/profile");
  return res.data;
};

// Đổi mật khẩu (✅ Cần token)
export const changePassword = async (data) => {
  const res = await axiosClient.post("/api/auth/change-password", data);
  return res.data;
};

/* --------------------------------
   🚗 VEHICLES
---------------------------------- */

// Lấy danh sách xe (✅)
export const getVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles");
  return res.data;
};

// Lấy danh sách xe đã được bảo dưỡng (✅ Cần token)
export const getServicedVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles/serviced");
  return res.data;
};

// Tìm xe theo VIN (✅)
export const getVehicleByVin = async (vin) => {
  const res = await axiosClient.get(`/api/vehicles/vin/${vin}`);
  return res.data;
};

// Lấy thông tin xe theo ID (✅)
export const getVehicleById = async (id) => {
  const res = await axiosClient.get(`/api/vehicles/${id}`);
  return res.data;
};

// Thêm xe mới (✅)
export const addVehicle = async (data) => {
  const res = await axiosClient.post("/api/vehicles", data);
  return res.data;
};

// Xóa xe (✅)
export const deleteVehicle = async (id) => {
  const res = await axiosClient.delete(`/api/vehicles/${id}`);
  return res.data;
};

/* --------------------------------
   🕒 APPOINTMENTS
---------------------------------- */

// Customer: Xem lịch hẹn của khách hàng (✅)
export const getAppointments = async () => {
  const res = await axiosClient.get("/api/appointments");
  return res.data;
};

// Staff: Xem tất cả lịch hẹn (✅)
export const getAppointmentsForStaff = async (status = null) => {
  const url = status 
    ? `/api/appointments/appointments/status/${status}` 
    : "/api/appointments/all";
  const res = await axiosClient.get(url);
  return res.data;
};

// Customer: Đặt lịch bảo dưỡng mới (✅)
export const createAppointment = async (data) => {
  const res = await axiosClient.post("/api/appointments", data);
  return res.data;
};

// Staff: Chấp nhận lịch hẹn (pending → confirmed) (✅)
export const acceptAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/accept`);
  return res.data;
};

// Staff: Hủy lịch hẹn (✅)
export const cancelAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/cancel`);
  return res.data;
};

// Staff: Bắt đầu thực hiện (confirmed → in-progress) (✅)
export const startAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/inProgress`);
  return res.data;
};

// Staff: Hoàn thành (in-progress → done) (✅)
export const completeAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/done`);
  return res.data;
};

/* --------------------------------
   👥 STAFF - CUSTOMER MANAGEMENT
---------------------------------- */

// Lấy danh sách khách hàng (✅ Cần token)
export const getCustomersByRole = async () => {
  const res = await axiosClient.get('/api/users/all_customer');
  return res.data;
};

/* --------------------------------
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
};
