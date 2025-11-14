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
    if (res.data?.role) localStorage.setItem("role", res.data.role);
    if (res.data?.fullName) localStorage.setItem("fullName", res.data.fullName);
    if (res.data?.id) localStorage.setItem("userId", res.data.id);
    if (res.data?.centerId) localStorage.setItem("centerId", res.data.centerId);
  }
  return res.data;
};

/* --------------------------------
   👤 USER PROFILE
---------------------------------- */

// Xem hồ sơ người dùng (✅ Cần token)
export const getProfile = async () => {
  const res = await axiosClient.get("/api/profile");
  return res.data;
};

// Cập nhật thông tin user (✅ Cần token)
export const updateUser = async (id, data) => {
  console.log('📤 API Request: PUT /api/update/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/update/${id}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Cập nhật hồ sơ (✅ Cần token) - Alias for backward compatibility
export const updateProfile = async (userId, data) => {
  return updateUser(userId, data);
};

// Đổi mật khẩu (✅ Cần token)
export const changePassword = async (data) => {
  const res = await axiosClient.post("/api/auth/change-password", data);
  return res.data;
};

<<<<<<< HEAD
// Staff: Lấy danh sách tất cả khách hàng (✅ Cần token)
export const getAllCustomers = async () => {
  const res = await axiosClient.get("/api/users/all_customer");
=======
// Lấy danh sách users theo role (✅ Cần token)
export const getUsersByRole = async (role) => {
  const res = await axiosClient.get("/api/users", { params: { role } });
  return res.data;
};

// Lấy tất cả customers (✅ Cần token - Admin/Staff)
export const getAllCustomers = async () => {
  console.log('📤 API Request: GET /api/users/all_customer');
  const res = await axiosClient.get("/api/users/all_customer");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total customers:', res.data?.length || 0);
  return res.data;
};

// Lấy danh sách technicians (✅ Cần token)
export const getAllTechnicians = async () => {
  const res = await axiosClient.get("/api/users/allTechnicians");
  return res.data;
};

// Tạo employee mới (Admin/Staff) (✅ Cần token)
export const createEmployee = async (role, data) => {
  const res = await axiosClient.post("/api/users/employees", data, {
    params: { role }
  });
  return res.data;
};

// Xóa employee (✅ Cần token)
export const deleteEmployee = async (id) => {
  const res = await axiosClient.delete(`/api/users/${id}`);
>>>>>>> main
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

<<<<<<< HEAD
// Lấy thời gian bảo dưỡng cuối cùng của xe (✅ Cần token)
export const getVehicleLatestMaintenanceTime = async (vehicleId) => {
  const res = await axiosClient.get(`/api/vehicles/${vehicleId}/appointments/latest_time`);
  return res.data; // Returns string (timestamp)
=======
// Lấy danh sách xe đã bảo dưỡng (với thông tin owner) (✅ Cần token)
export const getVehiclesMaintained = async () => {
  const res = await axiosClient.get("/api/vehicles/maintained");
  return res.data;
};

// Lấy lịch hẹn gần nhất của xe (✅)
export const getLatestAppointment = async (vehicleId) => {
  const res = await axiosClient.get(`/api/vehicles/${vehicleId}/appointments/latest_time`);
  return res.data;
>>>>>>> main
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

<<<<<<< HEAD
// Staff: Lấy tất cả appointments (✅ Cần token)
=======
// Lấy tất cả appointments (Admin) (✅ Cần token)
>>>>>>> main
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/api/appointments/all");
  return res.data;
};

<<<<<<< HEAD
// Staff: Chấp nhận lịch hẹn (✅ Cần token)
=======
// Lấy appointment đã hoàn thành theo ID (✅ Cần token)
export const getAppointmentDone = async (id) => {
  const res = await axiosClient.get(`/api/appointments/status/${id}`);
  return res.data;
};

// Lấy appointments của staff (✅ Cần token)
export const getAppointmentsByStaff = async (staffId) => {
  const res = await axiosClient.get("/api/appointments/staff", {
    params: { id: staffId }
  });
  return res.data;
};

// Staff: Chấp nhận lịch hẹn (pending → confirmed) (✅)
>>>>>>> main
export const acceptAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/accept`);
  return res.data;
};

// Staff: Hủy lịch hẹn (✅ Cần token)
export const cancelAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/cancel`);
  return res.data;
};

<<<<<<< HEAD
// Staff: Bắt đầu thực hiện lịch hẹn (✅ Cần token)
export const startAppointmentProgress = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/inProgress`);
=======
// Chuyển trạng thái sang In Progress (✅ Cần token)
export const inProgressAppointment = async (id, technicianIds) => {
  const res = await axiosClient.put(`/api/appointments/${id}/inProgress`, technicianIds);
  return res.data;
};

// Hoàn thành lịch hẹn (✅ Cần token)
export const doneAppointment = async (id, maintenanceData) => {
  const res = await axiosClient.put(`/api/appointments/${id}/done`, maintenanceData);
  return res.data;
};

/**
 * Staff: Bắt đầu thực hiện (confirmed → in-progress)
 * 
 * API: PUT /api/appointments/{appointmentId}/inProgress
 * Body: number[] (mảng ID của các kỹ thuật viên)
 * 
 * @param {number|string} appointmentId - ID của appointment
 * @param {number[]} [staffIds=[]] - Mảng ID của kỹ thuật viên
 * @returns {Promise<Object>} Response từ backend
 */
export const startAppointment = async (appointmentId, staffIds = []) => {
  console.log('🚀 startAppointment:', {
    appointmentId,
    staffIds,
    body: staffIds // Array trực tiếp, không phải object
  });
  
  // OpenAPI spec: Body phải là array of integers
  const res = await axiosClient.put(
    `/api/appointments/${appointmentId}/inProgress`,
    staffIds // 👈 Gửi array trực tiếp (không phải { staffIds })
  );
>>>>>>> main
  return res.data;
};

// Technician: Lấy appointments được giao cho technician (✅ Cần token + technicianId)
export const getAppointmentsForStaff = async () => {
  // Lấy user ID từ localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('Không tìm thấy thông tin user. Vui lòng đăng nhập lại.');
  }
  
  let userId;
  try {
    const userData = JSON.parse(userStr);
    userId = userData.user_id || userData.id || userData.userId;
    
    if (!userId) {
      console.error('❌ [API] User data:', userData);
      throw new Error('Không tìm thấy User ID. Vui lòng đăng nhập lại.');
    }
    
    console.log('👤 [API] Technician ID:', userId);
  } catch (e) {
    console.error('❌ [API] Lỗi parse user data:', e);
    throw new Error('Dữ liệu user không hợp lệ. Vui lòng đăng nhập lại.');
  }
  
  console.log(`🔗 [API] Calling: GET /api/appointments/staff/${userId}`);
  const res = await axiosClient.get(`/api/appointments/staff/${userId}`);
  console.log('✅ [API] Response status:', res.status);
  console.log('📦 [API] Response data:', res.data);
  return res.data;
};

// Technician: Lấy chi tiết appointment (✅ Cần token)
export const getAppointmentDetailWithTechs = async (appointmentId) => {
  const res = await axiosClient.get(`/api/appointments/${appointmentId}`);
  return res.data;
};

// Technician: Tạo Maintenance Record (✅ Cần token)
export const createMaintenanceRecord = async (appointmentId, recordData) => {
  console.log('📝 [API] Creating maintenance record for appointment:', appointmentId);
  console.log('📝 [API] Record data:', recordData);
  const res = await axiosClient.post(`/api/MaintainanceRecord/${appointmentId}`, recordData);
  console.log('✅ [API] Maintenance record created:', res.data);
  return res.data;
};

// Technician: Hoàn thành appointment (chuyển sang "done") (✅ Cần token)
export const markAppointmentAsDone = async (appointmentId) => {
  console.log('✔️ [API] Completing appointment (done):', appointmentId);
  // Gửi data rỗng theo yêu cầu backend
  const emptyData = {
    vehicleCondition: "",
    checklist: "",
    remarks: "",
    partsUsed: [],
    staffIds: []
  };
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/done`, emptyData);
  console.log('✅ [API] Appointment marked as done:', res.data);
  return res.data;
};

// Alias cho tương thích ngược (Staff Dashboard vẫn dùng tên này)
export const completeAppointmentDone = markAppointmentAsDone;

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
<<<<<<< HEAD
=======
   🧾 INVOICE API
---------------------------------- */

// Staff: Tạo hóa đơn cho appointment (✅ Cần token)
// OpenAPI: POST /api/auth/invoices/create/{appointmentId}
export const createInvoice = async (appointmentId) => {
  console.log('🧾 Creating invoice for appointment:', appointmentId);
  try {
    const res = await axiosClient.post(`/api/auth/invoices/create/${appointmentId}`);
    console.log('✅ Invoice created:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error creating invoice:', error);
    console.error('  📍 Status:', error.response?.status);
    console.error('  📝 Message:', error.response?.data?.message || error.message);
    throw error;
  }
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
   🔧 PARTS APIs
---------------------------------- */

// Lấy tất cả parts (✅ Cần token)
export const getAllParts = async () => {
  const res = await axiosClient.get("/api/auth/parts");
  return res.data;
};

// Lấy part theo ID (✅ Cần token)
export const getPartById = async (id) => {
  const res = await axiosClient.get(`/api/auth/parts/${id}`);
  return res.data;
};

// Tạo part mới (✅ Cần token)
export const createPart = async (data) => {
  const res = await axiosClient.post("/api/auth/parts/create", data);
  return res.data;
};

// Cập nhật part (✅ Cần token)
export const updatePart = async (id, data) => {
  const res = await axiosClient.put(`/api/auth/parts/update/${id}`, data);
  return res.data;
};

// Xóa part (✅ Cần token)
export const deletePart = async (id) => {
  const res = await axiosClient.delete(`/api/auth/parts/delete/${id}`);
  return res.data;
};

// Sử dụng part (✅ Cần token)
export const usePart = async (data) => {
  const res = await axiosClient.post("/api/technician/part_usage", data);
  return res.data;
};

/* --------------------------------
   📋 MAINTENANCE RECORD APIs
---------------------------------- */

// Tạo maintenance record (✅ Cần token)
export const createMaintenanceRecord = async (appointmentId, data) => {
  const res = await axiosClient.post(`/MaintainanceRecord/${appointmentId}`, data);
  return res.data;
};

// Lấy tất cả maintenance records (✅ Cần token)
export const getAllMaintenanceRecords = async () => {
  const res = await axiosClient.get("/MaintainanceRecord/all");
  return res.data;
};

// Lấy maintenance records theo center (✅ Cần token)
export const getMaintenanceRecordsByCenter = async () => {
  const res = await axiosClient.get("/MaintainanceRecord/all/serviceCenter");
  return res.data;
};

// Lấy maintenance records theo staff (✅ Cần token)
export const getMaintenanceRecordsByStaff = async (staffId) => {
  const res = await axiosClient.get(`/MaintainanceRecord/staff/${staffId}`);
  return res.data;
};

/* --------------------------------
   👷 STAFF ASSIGNMENT APIs
---------------------------------- */

// Assign technicians cho appointment (✅ Cần token)
export const assignTechnicians = async (appointmentId, technicianIds) => {
  const res = await axiosClient.put(`/assignments/${appointmentId}/staff`, technicianIds);
  return res.data;
};

// Lấy danh sách staff rảnh (✅ Cần token)
export const getFreeStaff = async () => {
  const res = await axiosClient.get("/assignments/free");
  return res.data;
};

/* --------------------------------
   📝 WORKLOG APIs
---------------------------------- */

// Tạo worklog thủ công (✅ Cần token)
export const createWorkLog = async (data) => {
  const res = await axiosClient.post("/worklogs", data);
  return res.data;
};

// Tạo worklog tự động cho appointment (✅ Cần token)
export const createAutoWorkLog = async (appointmentId) => {
  const res = await axiosClient.post(`/worklogs/${appointmentId}`);
  return res.data;
};

// Lấy tất cả worklogs theo center (✅ Cần token)
export const getAllWorkLogsByCenter = async () => {
  const res = await axiosClient.get("/worklogs/center");
  return res.data;
};

/* --------------------------------
   📊 REPORT APIs (Admin)
---------------------------------- */

// Lấy doanh thu theo khoảng thời gian (✅ Cần token - Admin)
export const getRevenue = async (startDate, endDate) => {
  const res = await axiosClient.get("/api/auth/invoices/revenue", {
    params: { startDate, endDate }
  });
  return res.data;
};

// Báo cáo doanh thu theo tháng (✅ Cần token - Admin)
export const getRevenueReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue");
  return res.data;
};

// Doanh thu tháng hiện tại (✅ Cần token - Admin)
export const getRevenueCurrentMonth = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue/current-month");
  return res.data;
};

// Doanh thu theo dịch vụ (✅ Cần token - Admin)
export const getRevenueByService = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue/service");
  return res.data;
};

// Báo cáo lợi nhuận theo tháng (✅ Cần token - Admin)
export const getProfitReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/profit");
  return res.data;
};

// Chi phí tháng hiện tại (✅ Cần token - Admin)
export const getCurrentMonthExpense = async () => {
  const res = await axiosClient.get("/api/admin/reports/expense/current-month");
  return res.data;
};

// Top dịch vụ phổ biến (all time) (✅ Cần token - Admin)
export const getTrendingServices = async () => {
  const res = await axiosClient.get("/api/admin/reports/trending-services/alltime");
  return res.data;
};

// Top dịch vụ tháng trước (✅ Cần token - Admin)
export const getTrendingServicesLastMonth = async () => {
  const res = await axiosClient.get("/api/admin/reports/trending-services/last-month");
  return res.data;
};

// Top 5 parts được dùng nhiều nhất tháng trước (✅ Cần token - Admin)
export const getTrendingParts = async () => {
  const res = await axiosClient.get("/api/admin/reports/trending-parts");
  return res.data;
};

// Báo cáo tồn kho phụ tùng (✅ Cần token - Admin)
export const getPartStockReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/parts/stock-report");
  return res.data;
};

// Thống kê phương thức thanh toán (✅ Cần token - Admin)
export const getPaymentMethods = async () => {
  const res = await axiosClient.get("/api/admin/reports/payment-methods");
  return res.data;
};

/* --------------------------------
   🔔 REMINDER APIs (Test)
---------------------------------- */

// Chạy scheduler manually (test) (✅ Cần token)
export const runReminderScheduler = async () => {
  const res = await axiosClient.get("/api/auth/reminder/run");
  return res.data;
};

/* --------------------------------
>>>>>>> main
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");
  localStorage.removeItem("centerId");
};
