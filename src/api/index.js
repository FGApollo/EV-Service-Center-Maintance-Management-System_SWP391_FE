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
// ✅ Theo OpenAPI mới: PUT /api/auth/update/{id}
export const updateUser = async (id, data) => {
  console.log('📤 API Request: PUT /api/auth/update/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/auth/update/${id}`, data);
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

// Lấy danh sách users theo role (✅ Cần token)
export const getUsersByRole = async (role) => {
  const res = await axiosClient.get("/api/users", { params: { role } });
  return res.data;
};

// Lấy danh sách staff và technicians theo center (✅ Cần token)
// API: GET /api/users/center/staff_and_technician
// Response: Array of UserDto (có role TECHNICIAN hoặc STAFF)
export const getStaffAndTechnician = async () => {
  console.log('📤 API Request: GET /api/users/center/staff_and_technician');
  const res = await axiosClient.get("/api/users/center/staff_and_technician");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total staff & technicians:', res.data?.length || 0);
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

// Lấy tất cả users theo role (✅ Cần token - Admin)
// API: GET /api/users/all/{role}
export const getAllUsersByRole = async (role) => {
  console.log('📤 API Request: GET /api/users/all/' + role);
  const res = await axiosClient.get(`/api/users/all/${role}`);
  console.log('📥 API Response:', res.data);
  console.log('📊 Total users with role', role + ':', res.data?.length || 0);
  return res.data || [];
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
  return res.data;
};

// Tạo customer mới - Dùng register endpoint (❌ Không cần token - public API)
export const createCustomer = async (data) => {
  console.log('📤 Creating customer via register:', data);
  const res = await axiosClient.post("/api/auth/register", data);
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

// Cập nhật xe (✅)
export const updateVehicle = async (id, data) => {
  console.log('📤 API Request: PUT /api/vehicles/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/vehicles/${id}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Xóa xe (✅)
export const deleteVehicle = async (id) => {
  const res = await axiosClient.delete(`/api/vehicles/${id}`);
  return res.data;
};

// Lấy danh sách xe đã bảo dưỡng (với thông tin owner) (✅ Cần token)
export const getVehiclesMaintained = async () => {
  const res = await axiosClient.get("/api/vehicles/maintained");
  return res.data;
};

// Lấy lịch hẹn gần nhất của xe (✅)
export const getLatestAppointment = async (vehicleId) => {
  const res = await axiosClient.get(`/api/vehicles/${vehicleId}/appointments/latest_time`);
  return res.data;
};

// Lấy tất cả vehicles (✅ Cần token - Admin)
// API: GET /api/vehicles/all
export const getAllVehicles = async () => {
  try {
    console.log('📤 API Request: GET /api/vehicles/all');
    const res = await axiosClient.get("/api/vehicles/all");
    console.log('📥 API Response:', res.data);
    console.log('📊 Total vehicles:', res.data?.length || 0);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('❌ [getAllVehicles] Error:', err);
    // If 500 error, try fallback to maintained vehicles
    if (err.response?.status === 500 || err.response?.status === 404) {
      console.log(`⚠️ /api/vehicles/all returned ${err.response?.status}, trying /api/vehicles/maintained`);
      try {
        const res = await axiosClient.get("/api/vehicles/maintained");
        console.log('📥 API Response (maintained):', res.data);
        console.log('📊 Total vehicles:', res.data?.length || 0);
        return Array.isArray(res.data) ? res.data : [];
      } catch (fallbackErr) {
        console.error('❌ Fallback API also failed:', fallbackErr);
        // Return empty array instead of throwing
        return [];
      }
    }
    // For other errors, return empty array
    return [];
  }
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

// Staff: Lấy chi tiết appointment với đầy đủ thông tin techIds & users (✅)
// OpenAPI: GET /api/appointments/status/{id}
// Response: AppointmentDetailResponse (có techIds, users array với đầy đủ thông tin)
// Endpoint này hoạt động cho TẤT CẢ status (pending, accepted, in_progress, completed)
export const getAppointmentDetailWithTechs = async (appointmentId) => {
  console.log('📞 Fetching appointment detail with techs:', appointmentId);
  const res = await axiosClient.get(`/api/appointments/status/${appointmentId}`);
  console.log('✅ Appointment detail response:', res.data);
  console.log('   🎯 techIds:', res.data.techIds);
  console.log('   👥 users:', res.data.users?.length);
  return res.data;
};

// Staff: Lấy chi tiết appointment đã hoàn thành với đầy đủ thông tin (✅)
// OpenAPI: GET /api/appointments/status/done/{id}
// Response: AppointmentDetailResponse (có techIds, users array với đầy đủ thông tin)
export const getCompletedAppointmentById = async (appointmentId) => {
  console.log('📞 Fetching completed appointment detail:', appointmentId);
  const res = await axiosClient.get(`/api/appointments/status/done/${appointmentId}`);
  console.log('✅ Completed appointment detail response:', res.data);
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

// Lấy tất cả appointments (Admin) (✅ Cần token)
export const getAllAppointments = async () => {
  const res = await axiosClient.get("/api/appointments/all");
  return res.data;
};

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
export const acceptAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/accept`);
  return res.data;
};

// Staff: Hủy lịch hẹn (✅)
export const cancelAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/api/appointments/${appointmentId}/cancel`);
  return res.data;
};

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
// API: GET /api/MaintainanceRecord/all/serviceCenter/{centerId}
export const getMaintenanceRecordsByCenter = async (centerId = null) => {
  if (centerId) {
    console.log('📊 [getMaintenanceRecordsByCenter] GET /api/MaintainanceRecord/all/serviceCenter/' + centerId);
    const res = await axiosClient.get(`/api/MaintainanceRecord/all/serviceCenter/${centerId}`);
    console.log('✅ [getMaintenanceRecordsByCenter] Response:', res.data);
    console.log('📊 Total records:', res.data?.length || 0);
    return res.data;
  } else {
    // Fallback to old endpoint if no centerId provided
    console.log('📊 [getMaintenanceRecordsByCenter] GET /MaintainanceRecord/all/serviceCenter (no centerId)');
    const res = await axiosClient.get("/MaintainanceRecord/all/serviceCenter");
    return res.data;
  }
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

// Lấy tất cả worklogs theo centerId cụ thể (✅ Cần token)
// API: GET /api/worklogs/center/{centerId}
// Response format: [{ staffId: [number], appointmentId: number, hoursSpent: number, tasksDone: string }]
export const getAllWorkLogsByCenterId = async (centerId) => {
  console.log('📊 [getAllWorkLogsByCenterId] GET /api/worklogs/center/' + centerId);
  const res = await axiosClient.get(`/api/worklogs/center/${centerId}`);
  console.log('✅ [getAllWorkLogsByCenterId] Response:', res.data);
  console.log('📊 Total worklogs:', res.data?.length || 0);
  
  // Validate response format
  if (Array.isArray(res.data)) {
    return res.data;
  }
  console.warn('⚠️ [getAllWorkLogsByCenterId] Invalid response format, expected array');
  return [];
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

// Báo cáo doanh thu theo tháng (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getRevenueReport = async () => {
  const res = await axiosClient.get("/api/management/reports/revenue");
  return res.data;
};

// Doanh thu tháng hiện tại (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getRevenueCurrentMonth = async () => {
  const res = await axiosClient.get("/api/management/reports/revenue/current-month");
  return res.data;
};

// Doanh thu theo dịch vụ (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getRevenueByService = async () => {
  const res = await axiosClient.get("/api/management/reports/revenue/service");
  return res.data;
};

// Báo cáo lợi nhuận theo tháng (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getProfitReport = async () => {
  const res = await axiosClient.get("/api/management/reports/profit");
  return res.data;
};

// Chi phí tháng hiện tại (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getCurrentMonthExpense = async () => {
  const res = await axiosClient.get("/api/management/reports/expense/current-month");
  return res.data;
};

// Top dịch vụ phổ biến (all time) (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
// Optional centerId parameter để filter theo center
// Response format từ backend: [{ "Tên dịch vụ": số }] hoặc [{ key: string, value: number }]
export const getTrendingServices = async (centerId = null) => {
  const params = centerId ? { centerId } : {};
  console.log('📊 [getTrendingServices] GET /api/management/reports/trending-services/alltime', params);
  const res = await axiosClient.get("/api/management/reports/trending-services/alltime", { params });
  console.log('✅ [getTrendingServices] Raw Response:', res.data);
  
  // Transform response format: [{ "service": count }] → [{ key: "service", value: count }]
  if (Array.isArray(res.data)) {
    const transformed = res.data.map(item => {
      // Nếu đã có format { key, value } thì giữ nguyên
      if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
        return { key: String(item.key), value: Number(item.value) };
      }
      
      // Nếu là format { "service name": count }, transform sang { key, value }
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length > 0) {
          const serviceName = keys[0];
          const count = item[serviceName];
          return { key: String(serviceName), value: Number(count) || 0 };
        }
      }
      
      return null;
    }).filter(item => item !== null);
    
    console.log('✅ [getTrendingServices] Transformed:', transformed);
    return transformed;
  }
  
  console.warn('⚠️ [getTrendingServices] Invalid response format, expected array');
  return [];
};

// Top dịch vụ tháng trước (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
// Optional centerId parameter để filter theo center
// Response format từ backend: [{ "Tên dịch vụ": số }] hoặc [{ key: string, value: number }]
export const getTrendingServicesLastMonth = async (centerId = null) => {
  const params = centerId ? { centerId } : {};
  console.log('📊 [getTrendingServicesLastMonth] GET /api/management/reports/trending-services/last-month', params);
  const res = await axiosClient.get("/api/management/reports/trending-services/last-month", { params });
  console.log('✅ [getTrendingServicesLastMonth] Raw Response:', res.data);
  
  // Transform response format: [{ "service": count }] → [{ key: "service", value: count }]
  if (Array.isArray(res.data)) {
    const transformed = res.data.map(item => {
      // Nếu đã có format { key, value } thì giữ nguyên
      if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
        return { key: String(item.key), value: Number(item.value) };
      }
      
      // Nếu là format { "service name": count }, transform sang { key, value }
      if (item && typeof item === 'object') {
        const keys = Object.keys(item);
        if (keys.length > 0) {
          const serviceName = keys[0];
          const count = item[serviceName];
          return { key: String(serviceName), value: Number(count) || 0 };
        }
      }
      
      return null;
    }).filter(item => item !== null);
    
    console.log('✅ [getTrendingServicesLastMonth] Transformed:', transformed);
    return transformed;
  }
  
  console.warn('⚠️ [getTrendingServicesLastMonth] Invalid response format, expected array');
  return [];
};

// Top 5 parts được dùng nhiều nhất tháng trước (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getTrendingParts = async () => {
  const res = await axiosClient.get("/api/management/reports/trending-parts");
  return res.data;
};

// Báo cáo tồn kho phụ tùng (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getPartStockReport = async () => {
  const res = await axiosClient.get("/api/management/reports/parts/stock-report");
  return res.data;
};

// Thống kê phương thức thanh toán (✅ Cần token - Manager/Admin)
// ✅ Updated: /api/admin → /api/management per OpenAPI spec
export const getPaymentMethods = async () => {
  const res = await axiosClient.get("/api/management/reports/payment-methods");
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
   🧹 TIỆN ÍCH
---------------------------------- */

/* --------------------------------
   🏢 SERVICE CENTER APIs (Admin)
---------------------------------- */

// Lấy tất cả centers (✅ Cần token - Admin)
// API: GET /api/center
export const getAllCenters = async () => {
  console.log('📤 API Request: GET /api/center');
  const res = await axiosClient.get("/api/center");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total centers:', res.data?.length || 0);
  return res.data || [];
};

// Tạo center mới (✅ Cần token - Admin)
// API: POST /api/center
// Body: CenterDTO { name, address, phone, email }
export const createCenter = async (centerData) => {
  console.log('📤 API Request: POST /api/center');
  console.log('📤 Request Data:', centerData);
  const res = await axiosClient.post("/api/center", centerData);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Cập nhật center (✅ Cần token - Admin)
// API: PUT /api/center/{id}
// Body: CenterDTO { name, address, phone, email }
export const updateCenter = async (id, centerData) => {
  console.log('📤 API Request: PUT /api/center/' + id);
  console.log('📤 Request Data:', centerData);
  const res = await axiosClient.put(`/api/center/${id}`, centerData);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Xóa center (✅ Cần token - Admin)
// API: DELETE /api/center/{id}
export const deleteCenter = async (id) => {
  console.log('📤 API Request: DELETE /api/center/' + id);
  const res = await axiosClient.delete(`/api/center/${id}`);
  console.log('📥 API Response:', res.data);
  return res.data;
};

/* --------------------------------
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
