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
   🚗 VEHICLES (Quản lý xe)
---------------------------------- */

// Lấy danh sách tất cả xe (✅ Cần token)
export const getVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles");
  return res.data; // Trả về: [{ id, vin, model, year, color, licensePlate }]
};

// Lấy thông tin chi tiết 1 xe theo ID
export const getVehicleById = async (id) => {
  const res = await axiosClient.get(`/api/vehicles/${id}`);
  return res.data;
};

// Thêm xe mới (✅ Cần token)
export const addVehicle = async (data) => {
  // data = { vin, model, year, color, licensePlate, userId }
  const res = await axiosClient.post("/api/vehicles", data);
  return res.data;
};

// Cập nhật thông tin xe
export const updateVehicle = async (id, data) => {
  const res = await axiosClient.put(`/api/vehicles/${id}`, data);
  return res.data;
};

// Xóa xe (✅ Cần token)
export const deleteVehicle = async (id) => {
  const res = await axiosClient.delete(`/api/vehicles/${id}`);
  return res.data;
};

// Lấy danh sách xe của user hiện tại
export const getMyVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles/my");
  return res.data;
};

/* --------------------------------
   🕒 APPOINTMENTS
---------------------------------- */

// Xem lịch hẹn hiện tại (✅)
export const getAppointments = async () => {
  const res = await axiosClient.get("/api/appointments");
  return res.data;
};

// Đặt lịch bảo dưỡng (✅)
export const createAppointment = async (data) => {
  const res = await axiosClient.post("/api/appointments", data);
  return res.data;
};

/* --------------------------------
   👥 ADMIN - CUSTOMER MANAGEMENT
---------------------------------- */

// Lấy tất cả khách hàng (Admin)
export const getAllCustomers = async () => {
  const res = await axiosClient.get("/api/admin/customers");
  return res.data;
};

// Lấy chi tiết khách hàng kèm danh sách xe
export const getCustomerWithVehicles = async (customerId) => {
  const res = await axiosClient.get(`/api/admin/customers/${customerId}/vehicles`);
  return res.data;
};

// Lấy danh sách khách hàng theo role (✅ Cần token)
export const getCustomersByRole = async (role = "CUSTOMER") => {
  const res = await axiosClient.get(`/api/auth/register?role=${role}`);
  return res.data;
};

/* --------------------------------
   🚗 ADMIN - VEHICLE MANAGEMENT
---------------------------------- */

// Lấy tất cả xe kèm thông tin khách hàng (Admin)
export const getAllVehiclesWithOwner = async () => {
  const res = await axiosClient.get("/api/admin/vehicles");
  return res.data; // [{vehicle, owner}, ...]
};

// Thêm xe cho khách hàng (Admin)
export const addVehicleForCustomer = async (customerId, vehicleData) => {
  const res = await axiosClient.post(`/api/admin/customers/${customerId}/vehicles`, vehicleData);
  return res.data;
};

// Cập nhật thông tin xe (Admin)
export const updateVehicleAdmin = async (vehicleId, vehicleData) => {
  const res = await axiosClient.put(`/api/admin/vehicles/${vehicleId}`, vehicleData);
  return res.data;
};

// Xóa xe (Admin)
export const deleteVehicleAdmin = async (vehicleId) => {
  const res = await axiosClient.delete(`/api/admin/vehicles/${vehicleId}`);
  return res.data;
};

/* --------------------------------
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
};
