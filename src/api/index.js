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

// Staff: Xem tất cả lịch hẹn (✅)
export const getAppointmentsForStaff = async (status = null) => {
  const url = status 
    ? `/api/appointments/appointments/status/${status}` 
    : "/api/appointments/all";
  const res = await axiosClient.get(url);
  return res.data;
};

// Staff: Lấy chi tiết một appointment (✅)
export const getAppointmentById = async (appointmentId) => {
  const res = await axiosClient.get(`/api/appointments/${appointmentId}`);
  return res.data;
};

// Lấy appointments theo status (✅)
// OpenAPI: GET /api/appointments/appointments/status/{status}
// Response: AppointmentResponse[] (có techIds field)
export const getAppointmentsByStatus = async (status) => {
  console.log('📞 Fetching appointments by status:', status);
  const res = await axiosClient.get(`/api/appointments/appointments/status/${status}`);
  console.log('✅ Appointments by status response:', res.data);
  return res.data;
};

// Lấy appointments đang thực hiện (in_progress) với thông tin kỹ thuật viên (✅)
// Hỗ trợ nhiều format status: in-progress, in_progress, inProgress
export const getInProgressAppointments = async () => {
  console.log('📞 Fetching in-progress appointments with technician info...');
  
  // Thử các format status khác nhau
  const statusVariants = ['in-progress', 'in_progress', 'inProgress'];
  let allAppointments = [];
  
  for (const status of statusVariants) {
    try {
      const res = await axiosClient.get(`/api/appointments/appointments/status/${status}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        console.log(`✅ Found ${res.data.length} appointments with status "${status}"`);
        allAppointments = [...allAppointments, ...res.data];
        break; // Nếu tìm thấy, dừng lại
      }
    } catch (error) {
      console.log(`⚠️ Status "${status}" not found or error:`, error.response?.status);
      // Tiếp tục thử status khác
    }
  }
  
  // Nếu không tìm thấy với bất kỳ format nào, thử lấy tất cả và filter
  if (allAppointments.length === 0) {
    console.log('⚠️ No appointments found with status variants, trying to get all...');
    try {
      const allRes = await axiosClient.get('/api/appointments/all');
      if (Array.isArray(allRes.data)) {
        allAppointments = allRes.data.filter(apt => {
          const aptStatus = apt.status?.toLowerCase();
          return aptStatus === 'in-progress' || 
                 aptStatus === 'in_progress' || 
                 aptStatus === 'inprogress' ||
                 aptStatus === 'in progress';
        });
        console.log(`✅ Filtered ${allAppointments.length} in-progress appointments from all`);
      }
    } catch (error) {
      console.error('❌ Error fetching all appointments:', error);
    }
  }
  
  console.log(`✅ Total in-progress appointments: ${allAppointments.length}`);
  console.log('   📋 Appointments with techIds:', allAppointments.map(apt => ({
    id: apt.appointmentId || apt.id,
    techIds: apt.techIds,
    status: apt.status
  })));
  
  return allAppointments;
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
  return res.data;
};

/**
 * Staff: Hoàn thành (in-progress → done)
 * 
 * API: PUT /api/appointments/{appointmentId}/done
 * Body: MaintainanceRecordDto {
 *   vehicleCondition?: string,
 *   checklist?: string,
 *   remarks?: string,
 *   partsUsed?: PartUsageDto[],
 *   staffIds?: number[]
 * }
 * 
 * @param {number|string} appointmentId - ID của appointment
 * @param {Object} [maintenanceData] - Optional maintenance record data
 * @returns {Promise<Object>} Response từ backend
 */
export const completeAppointment = async (appointmentId, maintenanceData = {}) => {
  // OpenAPI spec: Body là MaintainanceRecordDto
  // Có thể gửi empty object hoặc minimal data
  const body = {
    vehicleCondition: maintenanceData.vehicleCondition || '',
    checklist: maintenanceData.checklist || '',
    remarks: maintenanceData.remarks || '',
    partsUsed: maintenanceData.partsUsed || [],
    staffIds: maintenanceData.staffIds || []
  };
  
  console.log('✅ completeAppointment:', {
    appointmentId,
    body
  });
  
  try {
    const res = await axiosClient.put(`/api/appointments/${appointmentId}/done`, body);
    return res.data;
  } catch (error) {
    console.log('⚠️ /done failed, trying /complete...');
    try {
      const res = await axiosClient.put(`/api/appointments/${appointmentId}/complete`, body);
      return res.data;
    } catch (error2) {
      console.log('⚠️ /complete failed, trying /completed...');
      const res = await axiosClient.put(`/api/appointments/${appointmentId}/completed`, body);
      return res.data;
    }
  }
};

/* --------------------------------
   👥 STAFF - CUSTOMER MANAGEMENT
---------------------------------- */

// Lấy danh sách khách hàng (✅ Cần token)
export const getCustomersByRole = async () => {
  const res = await axiosClient.get('/api/users/all_customer');
  return res.data;
};

// Lấy danh sách technicians (✅ Cần token)
export const getTechnicians = async () => {
  const res = await axiosClient.get('/api/users/allTechnicians');
  return res.data;
};

// Staff: Giao việc cho technician (✅ Cần token)
// Backend yêu cầu: PUT /assignments/{appointmentId}/staff với body = số integer (không phải object)
/**
 * Giao việc cho một hoặc nhiều technicians
 * 
 * API: PUT /assignments/{appointmentId}/staff
 * Body: number[] (array of technician IDs)
 * 
 * @param {number|string} appointmentId - ID của appointment
 * @param {number|number[]} technicianIdOrIds - Một technician ID hoặc array of technician IDs
 * @returns {Promise<Array>} Array of StaffAssignmentDto
 */
export const assignTechnician = async (appointmentId, technicianIdOrIds) => {
  // Convert to array nếu là single ID
  const technicianIds = Array.isArray(technicianIdOrIds) 
    ? technicianIdOrIds 
    : [technicianIdOrIds];
  
  console.log('🔧 assignTechnician được gọi:');
  console.log('  📋 appointmentId:', appointmentId);
  console.log('  👷 technicianIds:', technicianIds);
  console.log('  🔗 URL:', `/assignments/${appointmentId}/staff`);
  console.log('  📦 Body (array):', technicianIds);
  
  try {
    // OpenAPI spec: Body là array of integers
    const res = await axiosClient.put(`/assignments/${appointmentId}/staff`, technicianIds);
    console.log('✅ Giao việc thành công:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Lỗi giao việc:');
    console.error('  📍 Status:', error.response?.status);
    console.error('  📝 Message:', error.response?.data?.message || error.message);
    console.error('  📦 Response:', error.response?.data);
    console.error('  🔗 URL:', error.config?.url);
    console.error('  📤 Request data:', error.config?.data);
    throw error;
  }
};

/* --------------------------------
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
   🧹 TIỆN ÍCH
---------------------------------- */

// Đăng xuất: xóa token local
export const logout = () => {
  localStorage.removeItem("token");
};
