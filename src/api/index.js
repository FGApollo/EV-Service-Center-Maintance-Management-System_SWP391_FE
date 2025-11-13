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
   💳 PAYMENT API
---------------------------------- */

// Create payment transaction
/**
 * Tạo payment transaction
 * 
 * API: GET /api/customer/payments/create
 * Headers: {
 *   "Authorization": "Bearer <token>",
 *   "Content-Type": "application/json"
 * }
 * Query Params: {
 *   invoiceId: number,
 *   method: string (default: "online"),
 *   clientIp: string
 * }
 * 
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.invoiceId - ID của invoice (bắt buộc)
 * @param {string} [paymentData.method="online"] - Phương thức thanh toán
 * @param {string} [paymentData.clientIp] - IP của client (fallback: "127.0.0.1")
 * @returns {Promise<Object>} Payment response (có thể chứa paymentUrl, qrCode, status, ...)
 */
export const createPayment = async (paymentData) => {
  const { invoiceId, method = "online", clientIp } = paymentData;
  
  // Validation
  if (!invoiceId || invoiceId === 0) {
    throw new Error('invoiceId is required and must be greater than 0');
  }
  
  // Build query string
  const params = new URLSearchParams({
    invoiceId: invoiceId.toString(),
    method: method.toString(),
    clientIp: (clientIp || "127.0.0.1").toString()
  });
  
  console.log('💳 Creating payment:', {
    endpoint: '/api/customer/payments/create',
    queryParams: Object.fromEntries(params)
  });
  
  const res = await axiosClient.get(`/api/customer/payments/create?${params.toString()}`);
  return res.data;
};

// Payment return/callback - Xử lý khi thanh toán xong và trả về từ gateway
export const handlePaymentReturn = async (returnData) => {
  // returnData: Query params từ payment gateway (VNPay/MoMo callback)
  // Ví dụ VNPay: { vnp_TransactionStatus, vnp_TxnRef, vnp_Amount, vnp_ResponseCode, ... }
  // Ví dụ MoMo: { partnerCode, orderId, requestId, amount, orderInfo, ... }
  // Note: Backend sử dụng GET request với query params
  const params = new URLSearchParams();
  
  // Convert returnData object thành query params
  Object.keys(returnData).forEach(key => {
    if (returnData[key] !== null && returnData[key] !== undefined) {
      params.append(key, returnData[key].toString());
    }
  });
  
  const res = await axiosClient.get(`/api/customer/payments/return?${params.toString()}`);
  return res.data;
};

// Get payment by appointment ID
export const getPaymentByAppointment = async (appointmentId) => {
  const res = await axiosClient.get(`/api/payments/appointment/${appointmentId}`);
  return res.data;
};

// VNPay callback handler
export const verifyVNPayPayment = async (callbackData) => {
  const res = await axiosClient.post("/api/payments/vnpay/callback", callbackData);
  return res.data;
};

// MoMo callback handler
export const verifyMoMoPayment = async (callbackData) => {
  const res = await axiosClient.post("/api/payments/momo/callback", callbackData);
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
  const res = await axiosClient.put(`/assignments/${appointmentId}/staff`, {
    notes,
    staffIds
  });
  return res.data;
};

/* --------------------------------
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
};
