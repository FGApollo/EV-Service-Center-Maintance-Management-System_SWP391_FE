# 🚀 Hướng Dẫn Triển Khai UI Đầy Đủ Cho Backend

## 📋 Tổng Quan

Dự án cần cập nhật **10 components/pages** để tích hợp đầy đủ 47 APIs backend. Dưới đây là kế hoạch chi tiết và code templates.

---

## 1️⃣ ADMIN DASHBOARD - Trang Quản Trị

### 📊 Tab Overview & Reports (Ưu tiên cao)

**APIs cần tích hợp:**
- `getRevenueReport()` - Báo cáo doanh thu
- `getProfitReport()` - Báo cáo lợi nhuận  
- `getTrendingServices()` - Dịch vụ phổ biến
- `getTrendingServicesLastMonth()` - Dịch vụ phổ biến tháng trước
- `getTop5PartsUsed()` - Top 5 parts dùng nhiều nhất
- `getAllCustomers()` - Tổng số khách hàng
- `getVehiclesMaintained()` - Tổng số xe
- `getAllAppointments()` - Tổng lịch hẹn

**Code Template Overview Tab:**

```javascript
const [overviewStats, setOverviewStats] = useState({
  totalCustomers: 0,
  totalVehicles: 0,
  totalAppointments: 0,
  revenueData: {},
  profitData: {},
  trendingServices: [],
  trendingParts: []
});

const fetchOverviewData = async () => {
  try {
    setLoading(true);
    
    // Fetch tất cả data song song
    const [
      customers,
      vehicles,
      appointments,
      revenue,
      profit,
      trending,
      trendingMonth,
      parts
    ] = await Promise.all([
      API.getAllCustomers(),
      API.getVehiclesMaintained(),
      API.getAllAppointments(),
      API.getRevenueReport(),
      API.getProfitReport(),
      API.getTrendingServices(),
      API.getTrendingServicesLastMonth(),
      API.getTop5PartsUsed()
    ]);
    
    setOverviewStats({
      totalCustomers: customers.length,
      totalVehicles: vehicles.length,
      totalAppointments: appointments.length,
      revenueData: revenue,
      profitData: profit,
      trendingServices: trending,
      trendingParts: parts
    });
    
  } catch (error) {
    console.error('Error loading overview:', error);
    setError('Không thể tải dữ liệu tổng quan');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchOverviewData();
}, []);
```

**UI Sections:**
1. **Stats Cards** - Hiển thị tổng số (customers, vehicles, appointments, revenue)
2. **Revenue Chart** - Biểu đồ doanh thu theo tháng
3. **Profit Chart** - Biểu đồ lợi nhuận
4. **Trending Services Table** - Bảng dịch vụ phổ biến
5. **Top Parts Table** - Top 5 linh kiện dùng nhiều nhất

---

### 👥 Tab Customers Management

**APIs:**
- `getAllCustomers()` - GET danh sách
- `createEmployee(role, data)` - POST tạo employee mới
- `deleteEmployee(id)` - DELETE xóa employee
- `getUsersByRole(role)` - GET users theo role

**Code Template:**

```javascript
const [customers, setCustomers] = useState([]);
const [employees, setEmployees] = useState([]);
const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

// Fetch customers
const fetchCustomers = async () => {
  try {
    const data = await API.getAllCustomers();
    setCustomers(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Fetch employees (staff & technicians)
const fetchEmployees = async () => {
  try {
    const [staff, technicians] = await Promise.all([
      API.getUsersByRole('ROLE_STAFF'),
      API.getUsersByRole('ROLE_TECHNICIAN')
    ]);
    setEmployees([...staff, ...technicians]);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create employee
const handleCreateEmployee = async (formData) => {
  try {
    const role = formData.role; // 'ROLE_STAFF' hoặc 'ROLE_TECHNICIAN'
    const employeeData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };
    
    await API.createEmployee(role, employeeData);
    alert('Tạo nhân viên thành công!');
    fetchEmployees();
    setShowAddEmployeeModal(false);
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.message));
  }
};

// Delete employee
const handleDeleteEmployee = async (employeeId) => {
  if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return;
  
  try {
    await API.deleteEmployee(employeeId);
    alert('Xóa thành công!');
    fetchEmployees();
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.message));
  }
};
```

**UI Sections:**
1. **Customers Table** - Danh sách khách hàng (read-only)
2. **Employees Management** - Quản lý staff & technicians với CRUD
3. **Add Employee Modal** - Form thêm nhân viên mới

---

### 🚗 Tab Vehicles Management

**APIs:**
- `getVehiclesMaintained()` - GET tất cả xe (có owner info)
- `addVehicle(data)` - POST thêm xe cho customer
- `deleteVehicle(id)` - DELETE xóa xe
- `getLatestAppointmentTime(vehicleId)` - GET lịch hẹn gần nhất

**Code Template:**

```javascript
const [vehicles, setVehicles] = useState([]);

const fetchVehicles = async () => {
  try {
    const data = await API.getVehiclesMaintained();
    setVehicles(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleAddVehicle = async (formData) => {
  try {
    const vehicleData = {
      vin: formData.vin,
      model: formData.model,
      year: parseInt(formData.year),
      color: formData.color,
      licensePlate: formData.licensePlate
    };
    
    await API.addVehicle(vehicleData);
    alert('Thêm xe thành công!');
    fetchVehicles();
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.message));
  }
};

const handleDeleteVehicle = async (vehicleId) => {
  if (!confirm('Bạn có chắc muốn xóa xe này?')) return;
  
  try {
    await API.deleteVehicle(vehicleId);
    alert('Xóa thành công!');
    fetchVehicles();
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.message));
  }
};
```

---

### 📅 Tab Appointments Management

**APIs:**
- `getAllAppointments()` - GET tất cả appointments
- `getAppointmentsByStatus(status)` - GET theo status
- `acceptAppointment(id)` - PUT accept
- `cancelAppointment(id)` - PUT cancel
- `assignTechnicians(appointmentId, technicianIds)` - PUT assign techs
- `getFreeStaff()` - GET staff rảnh

**Code Template:**

```javascript
const [appointments, setAppointments] = useState([]);
const [freeStaff, setFreeStaff] = useState([]);

const fetchAppointments = async () => {
  try {
    const data = await API.getAllAppointments();
    setAppointments(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchFreeStaff = async () => {
  try {
    const data = await API.getFreeStaff();
    setFreeStaff(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleAcceptAppointment = async (appointmentId) => {
  try {
    await API.acceptAppointment(appointmentId);
    alert('Chấp nhận lịch hẹn thành công!');
    fetchAppointments();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};

const handleAssignTechnicians = async (appointmentId, techIds) => {
  try {
    await API.assignTechnicians(appointmentId, techIds);
    alert('Phân công kỹ thuật viên thành công!');
    fetchAppointments();
    fetchFreeStaff();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
```

---

### 🔧 Tab Parts & Inventory Management

**APIs:**
- `getAllParts()` - GET tất cả parts
- `createPart(data)` - POST tạo part mới
- `updatePart(id, data)` - PUT cập nhật part
- `deletePart(id)` - DELETE xóa part

**Code Template:**

```javascript
const [parts, setParts] = useState([]);

const fetchParts = async () => {
  try {
    const data = await API.getAllParts();
    setParts(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleCreatePart = async (formData) => {
  try {
    const partData = {
      name: formData.name,
      description: formData.description,
      unitPrice: parseFloat(formData.unitPrice),
      minStockLevel: parseInt(formData.minStockLevel)
    };
    
    await API.createPart(partData);
    alert('Tạo linh kiện thành công!');
    fetchParts();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};

const handleUpdatePart = async (partId, formData) => {
  try {
    await API.updatePart(partId, formData);
    alert('Cập nhật thành công!');
    fetchParts();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
```

---

## 2️⃣ STAFF DASHBOARD - Nhân Viên Tiếp Nhận

### 📋 Appointments Management

**APIs:**
- `getAllAppointments()` - Xem tất cả lịch hẹn
- `acceptAppointment(id)` - Chấp nhận lịch hẹn
- `cancelAppointment(id)` - Hủy lịch hẹn
- `assignTechnicians(appointmentId, technicianIds)` - Phân công kỹ thuật viên
- `getFreeStaff()` - Lấy danh sách technician rảnh
- `getAllTechnicians()` - Lấy tất cả technicians

**Code giống Admin nhưng chỉ hiển thị appointments của center hiện tại**

---

## 3️⃣ TECHNICIAN DASHBOARD - Kỹ Thuật Viên

### 🔧 My Assignments

**APIs:**
- `getAppointmentsByStaff(staffId)` - GET appointments được assign
- `inProgressAppointment(id, technicianIds)` - PUT bắt đầu công việc
- `doneAppointment(id, maintenanceData)` - PUT hoàn thành
- `usePart(data)` - POST ghi nhận sử dụng linh kiện
- `createWorkLog(data)` - POST tạo worklog
- `getMaintenanceRecordsByStaff(staffId)` - GET lịch sử bảo dưỡng

**Code Template:**

```javascript
const [myAppointments, setMyAppointments] = useState([]);
const [availableParts, setAvailableParts] = useState([]);

const fetchMyAppointments = async () => {
  const staffId = localStorage.getItem('userId');
  try {
    const data = await API.getAppointmentsByStaff(parseInt(staffId));
    setMyAppointments(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleStartWork = async (appointmentId) => {
  const staffId = localStorage.getItem('userId');
  try {
    await API.inProgressAppointment(appointmentId, [parseInt(staffId)]);
    alert('Bắt đầu công việc!');
    fetchMyAppointments();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};

const handleCompleteWork = async (appointmentId, formData) => {
  try {
    const maintenanceData = {
      vehicleCondition: formData.condition,
      checklist: formData.checklist,
      remarks: formData.remarks,
      partsUsed: formData.partsUsed, // Array of { partId, quantityUsed, unitCost }
      staffIds: [parseInt(localStorage.getItem('userId'))]
    };
    
    await API.doneAppointment(appointmentId, maintenanceData);
    alert('Hoàn thành công việc!');
    fetchMyAppointments();
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};

const handleUsePart = async (partUsageData) => {
  try {
    const data = {
      partId: partUsageData.partId,
      centerId: parseInt(localStorage.getItem('centerId')),
      recordId: partUsageData.recordId,
      quantityUsed: partUsageData.quantity
    };
    
    await API.usePart(data);
    alert('Đã ghi nhận sử dụng linh kiện!');
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
};
```

---

## 4️⃣ BOOKING PAGE - Đặt Lịch Hẹn

**APIs:**
- `getVehicles()` - GET xe của user hiện tại
- `addVehicle(data)` - POST thêm xe mới
- `createAppointment(data)` - POST tạo lịch hẹn

**Code Template:**

```javascript
const [myVehicles, setMyVehicles] = useState([]);
const [selectedVehicle, setSelectedVehicle] = useState(null);
const [selectedServices, setSelectedServices] = useState([]);
const [appointmentDate, setAppointmentDate] = useState('');

const fetchMyVehicles = async () => {
  try {
    const data = await API.getVehicles();
    setMyVehicles(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleCreateAppointment = async () => {
  try {
    const appointmentData = {
      vehicleId: selectedVehicle.id,
      serviceCenterId: 1, // Hoặc cho user chọn
      appointmentDate: appointmentDate, // ISO format: "2025-11-20T14:00:00"
      serviceTypeIds: selectedServices.map(s => s.id)
    };
    
    await API.createAppointment(appointmentData);
    alert('Đặt lịch thành công!');
    // Navigate to My Appointments
  } catch (error) {
    alert('Lỗi: ' + (error.response?.data?.message || error.message));
  }
};
```

---

## 5️⃣ MY CAR PAGE - Quản Lý Xe Của Tôi

**APIs:**
- `getVehicles()` - GET xe của user
- `addVehicle(data)` - POST thêm xe mới
- `deleteVehicle(id)` - DELETE xóa xe
- `getAppointments()` - GET lịch hẹn của xe này

---

## 6️⃣ PROFILE PAGE - Thông Tin Cá Nhân

**APIs:**
- `getProfile()` - GET thông tin profile
- `updateUser(id, data)` - PUT cập nhật thông tin

**Code đã có sẵn, chỉ cần kiểm tra**

---

## 7️⃣ INVOICE & PAYMENT PAGES (MỚI)

### 💳 InvoicePage

**APIs:**
- `createInvoice(appointmentId)` - POST tạo invoice
- `getRevenue(startDate, endDate)` - GET doanh thu

### 💰 PaymentPage  

**APIs:**
- `createPayment(paymentDto)` - GET tạo payment link VNPay
- `paymentReturn(params)` - GET xử lý callback từ VNPay

**Code Template:**

```javascript
const handlePayment = async (invoiceId) => {
  try {
    const paymentDto = {
      invoiceId: invoiceId,
      method: 'VNPAY',
      clientIp: '192.168.1.1' // Hoặc lấy từ browser
    };
    
    const response = await API.createPayment(paymentDto);
    // response sẽ chứa URL redirect đến VNPay
    window.location.href = response.paymentUrl;
  } catch (error) {
    alert('Lỗi tạo thanh toán: ' + error.message);
  }
};

// Xử lý callback sau khi thanh toán
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const vnpParams = Object.fromEntries(urlParams.entries());
  
  if (vnpParams.vnp_TransactionStatus) {
    handlePaymentReturn(vnpParams);
  }
}, []);

const handlePaymentReturn = async (params) => {
  try {
    const result = await API.paymentReturn(params);
    if (result.success) {
      alert('Thanh toán thành công!');
    } else {
      alert('Thanh toán thất bại!');
    }
  } catch (error) {
    alert('Lỗi xác nhận thanh toán: ' + error.message);
  }
};
```

---

## 8️⃣ APP.JSX - ROUTING & AUTHORIZATION

**Cập nhật routes:**

```javascript
import TechnicianDashboard from './pages/TechnicianDashboard.jsx';
import InvoicePage from './pages/InvoicePage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';

const renderPage = () => {
  const role = localStorage.getItem('role');
  
  switch (currentPage) {
    case 'admin':
      if (role !== 'ROLE_ADMIN') {
        alert('Bạn không có quyền truy cập!');
        return <Home onNavigate={setCurrentPage} />;
      }
      return <AdminDashboard onNavigate={setCurrentPage} />;
      
    case 'staff':
      if (role !== 'ROLE_STAFF') {
        alert('Bạn không có quyền truy cập!');
        return <Home onNavigate={setCurrentPage} />;
      }
      return <StaffDashboard onNavigate={setCurrentPage} />;
      
    case 'technician':
      if (role !== 'ROLE_TECHNICIAN') {
        alert('Bạn không có quyền truy cập!');
        return <Home onNavigate={setCurrentPage} />;
      }
      return <TechnicianDashboard onNavigate={setCurrentPage} />;
      
    case 'invoice':
      return <InvoicePage onNavigate={setCurrentPage} />;
      
    case 'payment':
      return <PaymentPage onNavigate={setCurrentPage} />;
      
    // ... other cases
  }
};
```

---

## 📝 CHECKLIST TRIỂN KHAI

### Phase 1: Admin Dashboard (3-4 ngày)
- [ ] Overview & Reports Tab
- [ ] Customers Management Tab
- [ ] Vehicles Management Tab
- [ ] Appointments Management Tab
- [ ] Parts & Inventory Tab

### Phase 2: Staff & Technician (2-3 ngày)
- [ ] Staff Dashboard - Appointments
- [ ] Technician Dashboard - My Work
- [ ] Worklog & Maintenance Records

### Phase 3: Customer Features (2 ngày)
- [ ] Booking Page - Full Flow
- [ ] My Car Page - Vehicle Management
- [ ] My Appointments - History

### Phase 4: Payment (1 ngày)
- [ ] Invoice Page
- [ ] VNPay Payment Integration
- [ ] Payment Return Handler

### Phase 5: Testing & Polish (1 ngày)
- [ ] Test all CRUD operations
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design

---

## 🎨 UI/UX RECOMMENDATIONS

1. **Loading States**: Thêm spinner khi fetch data
2. **Error Handling**: Hiển thị error messages rõ ràng
3. **Confirmation Modals**: Confirm trước khi delete
4. **Success Feedback**: Toast notifications sau mỗi action
5. **Empty States**: Hiển thị "No data" khi chưa có dữ liệu
6. **Search & Filter**: Thêm tìm kiếm cho bảng dài
7. **Pagination**: Phân trang cho danh sách lớn
8. **Real-time Updates**: Tự động refresh sau mỗi action

---

## 🚀 HƯỚNG DẪN BẮT ĐẦU

### Bước 1: Test API Connection
```javascript
// Test trong console browser
import * as API from './api/index.js';

// Test login
const testLogin = async () => {
  const result = await API.login({
    email: 'admin@example.com',
    password: '123456'
  });
  console.log('Login result:', result);
};

// Test get customers
const testCustomers = async () => {
  const customers = await API.getAllCustomers();
  console.log('Customers:', customers);
};
```

### Bước 2: Implement theo thứ tự ưu tiên
1. Admin Dashboard Overview (most important)
2. Booking Page (customer-facing)
3. Technician Dashboard (daily operations)
4. Payment Integration (revenue)

### Bước 3: Deploy & Test
- Test trên localhost trước
- Deploy lên staging
- User acceptance testing
- Production deployment

---

**Last Updated**: November 7, 2025  
**Estimate**: 10-12 ngày làm việc (full-time)  
**Team Size**: 1-2 developers recommended
