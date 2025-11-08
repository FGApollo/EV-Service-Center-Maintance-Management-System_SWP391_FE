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
  console.log('📤 API Request: PUT /api/update/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/update/${id}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// GET /api/users - Lấy danh sách users theo role
export const getUsersByRole = async (role) => {
  const res = await axiosClient.get("/api/users", { params: { role } });
  return res.data;
};

// GET /api/users/all_customer - Lấy tất cả customers
export const getAllCustomers = async () => {
  console.log('📤 API Request: GET /api/users/all_customer');
  const res = await axiosClient.get("/api/users/all_customer");
  console.log('📥 API Response:', res.data);
  console.log('📊 Total customers:', res.data?.length || 0);
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

// GET /api/appointments/status/done/{id} - Lấy appointment đã hoàn thành theo ID
export const getAppointmentDone = async (id) => {
  const res = await axiosClient.get(`/api/appointments/status/${id}`);
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

// POST /MaintainanceRecord/{appointmentId} - Tạo maintenance record
export const createMaintenanceRecord = async (appointmentId, data) => {
  const res = await axiosClient.post(`/MaintainanceRecord/${appointmentId}`, data);
  return res.data;
};

// GET /MaintainanceRecord/all - Lấy tất cả maintenance records
export const getAllMaintenanceRecords = async () => {
  const res = await axiosClient.get("/MaintainanceRecord/all");
  return res.data;
};

// GET /MaintainanceRecord/all/serviceCenter - Lấy maintenance records theo center
export const getMaintenanceRecordsByCenter = async () => {
  const res = await axiosClient.get("/MaintainanceRecord/all/serviceCenter");
  return res.data;
};

// GET /MaintainanceRecord/staff/{staffId} - Lấy maintenance records theo staff
export const getMaintenanceRecordsByStaff = async (staffId) => {
  const res = await axiosClient.get(`/MaintainanceRecord/staff/${staffId}`);
  return res.data;
};

/* ================================
   👷 STAFF ASSIGNMENT APIs

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

// GET /worklogs/center - Lấy tất cả worklogs theo center
export const getAllWorkLogsByCenter = async () => {
  const res = await axiosClient.get("/worklogs/center");
  return res.data;
};

/* ================================
   🧾 INVOICE APIs

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

// POST /api/customer/payments/create - Tạo payment link (VNPay)
export const createPayment = async (paymentDto) => {
  const res = await axiosClient.post("/api/customer/payments/create", paymentDto);
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

// GET /api/admin/reports/revenue - Báo cáo doanh thu theo tháng
export const getRevenueReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue");
  return res.data;
};

// GET /api/admin/reports/revenue/current-month - Doanh thu tháng hiện tại
export const getRevenueCurrentMonth = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue/current-month");
  return res.data;
};

// GET /api/admin/reports/revenue/service - Doanh thu theo dịch vụ
export const getRevenueByService = async () => {
  const res = await axiosClient.get("/api/admin/reports/revenue/service");
  return res.data;
};

// GET /api/admin/reports/profit - Báo cáo lợi nhuận theo tháng
export const getProfitReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/profit");
  return res.data;
};

// GET /api/admin/reports/expense/current-month - Chi phí tháng hiện tại
export const getCurrentMonthExpense = async () => {
  const res = await axiosClient.get("/api/admin/reports/expense/current-month");
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

// GET /api/admin/reports/parts/stock-report - Báo cáo tồn kho phụ tùng
export const getPartStockReport = async () => {
  const res = await axiosClient.get("/api/admin/reports/parts/stock-report");
  return res.data;
};

// GET /api/admin/reports/payment-methods - Thống kê phương thức thanh toán
export const getPaymentMethods = async () => {
  const res = await axiosClient.get("/api/admin/reports/payment-methods");
  return res.data;
};

/* ================================
   🔔 REMINDER APIs (Test)

// GET /api/auth/reminder/run - Chạy scheduler manually (test)
export const runReminderScheduler = async () => {
  const res = await axiosClient.get("/api/auth/reminder/run");
  return res.data;
};

/* ================================
   🚪 LOGOUT
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

// Đăng xuất - xóa token và thông tin user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  localStorage.removeItem("userId");
  localStorage.removeItem("centerId");
};
