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

// Staff: Lấy danh sách tất cả khách hàng (✅ Cần token)
export const getAllCustomers = async () => {
  const res = await axiosClient.get("/api/users/all_customer");
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

// Lấy lịch sử bảo dưỡng của xe (✅ Cần token - Staff)
export const getMaintainedVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles/maintained");
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

// Lấy thời gian bảo dưỡng cuối cùng của xe (✅ Cần token)
export const getVehicleLatestMaintenanceTime = async (vehicleId) => {
  const res = await axiosClient.get(`/api/vehicles/${vehicleId}/appointments/latest_time`);
  return res.data; // Returns string (timestamp)
};

/* --------------------------------
   🕒 APPOINTMENTS
---------------------------------- */

// Customer: Xem lịch hẹn của khách hàng (✅)
export const getAppointments = async () => {
  const res = await axiosClient.get("/api/appointments");
  return res.data;
};

// Customer: Đặt lịch bảo dưỡng mới (✅)
export const createAppointment = async (data) => {
  const res = await axiosClient.post("/api/appointments", data);
  return res.data;
};

// Staff: Lấy tất cả appointments (✅ Cần token)
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/api/appointments/all");
  return res.data;
};

// Staff: Chấp nhận lịch hẹn (✅ Cần token)
export const acceptAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/accept`);
  return res.data;
};

// Staff: Hủy lịch hẹn (✅ Cần token)
export const cancelAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/cancel`);
  return res.data;
};

// Staff: Bắt đầu thực hiện lịch hẹn (✅ Cần token)
export const startAppointmentProgress = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/inProgress`);
  return res.data;
};

// Staff: Hoàn thành lịch hẹn (✅ Cần token)
export const completeAppointmentDone = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/done`);
  return res.data;
};

// Technician: Lấy appointments (✅ Cần token)
export const getAppointmentsForStaff = async (status = null) => {
  const url = status ? `/api/staff/appointments?status=${status}` : "/api/staff/appointments";
  const res = await axiosClient.get(url);
  return res.data;
};

// Technician: Lấy chi tiết appointment (✅ Cần token)
export const getAppointmentDetailWithTechs = async (appointmentId) => {
  const res = await axiosClient.get(`/api/appointments/${appointmentId}`);
  return res.data;
};

// Staff: Lấy chi tiết appointment với thông tin kỹ thuật viên (✅ Cần token)
export const getAppointmentStatus = async (appointmentId) => {
  const res = await axiosClient.get(`/api/appointments/status/${appointmentId}`);
  return res.data;
};

// Technician: Bắt đầu appointment (✅ Cần token)
export const startAppointment = async (appointmentId) => {
  const res = await axiosClient.post(`/api/technician/appointments/${appointmentId}/start`);
  return res.data;
};

// Technician: Hoàn thành appointment (✅ Cần token)
export const completeAppointment = async (appointmentId) => {
  const res = await axiosClient.post(`/api/technician/appointments/${appointmentId}/complete`);
  return res.data;
};

/* --------------------------------
   👨‍🔧 TECHNICIAN & STAFF ASSIGNMENT
---------------------------------- */

// Lấy danh sách tất cả technicians (✅ Cần token)
export const getAllTechnicians = async () => {
  const res = await axiosClient.get('/api/users/allTechnicians');
  return res.data;
};

// Giao việc cho technicians (✅ Cần token)
export const assignTechniciansToAppointment = async (appointmentId, staffIds, notes = '') => {
  // Quick sanity check: ensure we have a token before calling protected endpoint
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('🔐 No auth token found in localStorage - aborting assignTechniciansToAppointment');
    try {
      window.dispatchEvent(new CustomEvent('app:logout', { detail: { reason: 'no_token', status: 0 } }));
    } catch (e) {}
    throw new Error('No authentication token');
  }

  console.log('🔧 assignTechniciansToAppointment called:', {
    appointmentId,
    staffIds,
    notes
  });

  try {
    const res = await axiosClient.put(`/api/assignments/${appointmentId}/staff`, {
      notes,
      staffIds
    });
    console.log('✅ Assignment successful:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Assignment error:');
    console.error('  📍 Status:', error.response?.status);
    console.error('  📝 Message:', error.response?.data?.message || error.message);
    console.error('  📦 Response:', error.response?.data);
    console.error('  🔗 URL:', error.config?.url);
    console.error('  📤 Request data:', error.config?.data);
    console.error('  🔁 Response headers:', error.response?.headers);
    throw error;
  }
};

/* --------------------------------
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
};
