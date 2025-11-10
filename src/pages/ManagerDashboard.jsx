import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';
import { 
  FaUser, FaCar, FaComments, FaSearch, FaPlus, FaHistory, FaClock, 
  FaPhone, FaEnvelope, FaCalendarAlt, FaTools, FaCheckCircle, FaTimes, 
  FaEdit, FaUsers, FaMoneyBillWave, FaChartLine, FaChartBar, FaCertificate,
  FaWarehouse, FaRobot, FaClipboardCheck, FaReceipt, FaCreditCard, 
  FaFileInvoiceDollar, FaCalendarWeek, FaUserTie, FaBriefcase, FaEye
} from 'react-icons/fa';
import * as API from '../api/index.js';
import { getCurrentUser, getCurrentCenterId } from '../utils/centerFilter';
import { hasPermission, PERMISSIONS, ROLES } from '../constants/roles';

/**
 * MANAGER DASHBOARD
 * 
 * Dashboard cho Manager - quản lý trung tâm dịch vụ
 * Scope: Chỉ xem & quản lý data của 1 center cụ thể
 * 
 * Quyền hạn:
 * - Quản lý khách hàng & xe của center
 * - Quản lý lịch hẹn & dịch vụ
 * - Quản lý phụ tùng & tồn kho
 * - Quản lý nhân sự (staff, technician)
 * - Xem báo cáo tài chính & thống kê
 */
function ManagerDashboard({ onNavigate }) {
  console.log('ManagerDashboard component loaded!', { onNavigate });
  
  // Lấy thông tin user & center
  const currentUser = getCurrentUser();
  const { role, centerId, fullName } = currentUser;
  
  // Kiểm tra đăng nhập & quyền truy cập
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để truy cập trang này!');
      onNavigate && onNavigate('login');
      return;
    }
    
    // Kiểm tra role có phải Manager/Admin không
    // Accept both 'manager' and 'admin' for backward compatibility
    if (role !== ROLES.MANAGER && role?.toLowerCase() !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      onNavigate && onNavigate('login');
      return;
    }
    
    // Kiểm tra có centerId không
    if (!centerId) {
      alert('Tài khoản chưa được gán vào trung tâm nào!');
      onNavigate && onNavigate('login');
      return;
    }
    
    console.log('✅ Manager authorized:', { role, centerId, fullName });
  }, []); // Fixed: remove onNavigate from deps to prevent infinite loop
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]); // Danh sách khách hàng từ API
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal quản lý xe
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleFormData, setVehicleFormData] = useState({
    vin: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    customerId: ''
  });
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Overview Stats - Real-time data from APIs
  const [overviewStats, setOverviewStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    inProgressAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0, // ✅ Add cancelled count
    totalRevenue: 0,
    revenueData: {},
    profitData: {},
    trendingServices: [],
    trendingServicesLastMonth: [],
    trendingParts: [],
    activeTechnicians: 0
  });
  const [loadingOverview, setLoadingOverview] = useState(false);

  // useEffect: Load danh sách xe và khách hàng khi component mount
  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
    fetchAppointments(); // Thêm fetch appointments
    if (activeTab === 'overview') {
      fetchOverviewData();
    }
    if (activeTab === 'parts') {
      fetchParts();
    }
  }, [activeTab]);

  // ========== FETCH OVERVIEW DATA - CHỈ DÙNG API ==========
  const fetchOverviewData = async () => {
    try {
      setLoadingOverview(true);
      setError(null);
      console.log('🔄 Loading overview data from API...');

      // Fetch tất cả data song song để tăng tốc độ
      const [
        customersData,
        vehiclesData,
        appointmentsData,
        revenueData,
        profitData,
        trendingData,
        trendingMonthData,
        partsData,
        techniciansData
      ] = await Promise.all([
        API.getAllCustomers().catch(err => { console.error('Error customers:', err); return []; }),
        API.getVehiclesMaintained().catch(err => { console.error('Error vehicles:', err); return []; }),
        API.getAllAppointments().catch(err => { console.error('Error appointments:', err); return []; }),
        API.getRevenueReport().catch(err => { console.error('Error revenue:', err); return {}; }),
        API.getProfitReport().catch(err => { console.error('Error profit:', err); return {}; }),
        API.getTrendingServices().catch(err => { console.error('Error trending:', err); return []; }),
        API.getTrendingServicesLastMonth().catch(err => { console.error('Error trending month:', err); return []; }),
        API.getAllParts().catch(err => { console.error('Error parts:', err); return []; }), // Sử dụng getAllParts thay vì getTop5PartsUsed
        API.getAllTechnicians().catch(err => { console.error('Error technicians:', err); return []; })
      ]);

      console.log('📊 Overview Data:', {
        customers: customersData.length,
        vehicles: vehiclesData.length,
        appointments: appointmentsData.length,
        revenue: revenueData,
        profit: profitData,
        trending: trendingData,
        parts: partsData,
        technicians: techniciansData.length
      });

      // Log appointment statuses for debugging
      console.log('📋 Appointment Statuses:', appointmentsData.map(a => ({
        id: a.appointmentId,
        status: a.status,
        statusLower: a.status?.toLowerCase()
      })));

      // Count appointments by status - Đồng bộ với getStatusColor/getStatusText
      const pending = appointmentsData.filter(a => {
        const status = a.status?.toLowerCase();
        return status === 'pending';
      }).length;
      
      const inProgress = appointmentsData.filter(a => {
        const status = a.status?.toLowerCase();
        return status === 'in-progress' || status === 'in_progress' || status === 'inprogress';
      }).length;
      
      const completed = appointmentsData.filter(a => {
        const status = a.status?.toLowerCase();
        return status === 'completed' || status === 'done';
      }).length;

      // ✅ Count cancelled appointments
      const cancelled = appointmentsData.filter(a => {
        const status = a.status?.toLowerCase();
        return status === 'cancelled' || status === 'canceled';
      }).length;

      // Calculate total revenue
      const totalRevenue = Object.values(revenueData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

      // ✅ Debug trending services data structure
      console.log('🔍 Trending Services Raw:', trendingData);
      console.log('🔍 Trending Services Last Month Raw:', trendingMonthData);
      console.log('🔍 Parts Raw:', partsData);

      setOverviewStats({
        totalCustomers: customersData.length,
        totalVehicles: vehiclesData.length,
        totalAppointments: appointmentsData.length,
        pendingAppointments: pending,
        inProgressAppointments: inProgress,
        completedAppointments: completed,
        cancelledAppointments: cancelled, // ✅ Add cancelled count
        totalRevenue: Math.abs(totalRevenue), // ✅ Use absolute value
        revenueData: revenueData,
        profitData: profitData,
        trendingServices: Array.isArray(trendingData) ? trendingData : Object.entries(trendingData || {}),
        trendingServicesLastMonth: Array.isArray(trendingMonthData) ? trendingMonthData : Object.entries(trendingMonthData || {}),
        trendingParts: partsData,
        activeTechnicians: techniciansData.length
      });

      console.log('✅ Overview data loaded successfully');
    } catch (err) {
      console.error('❌ Error loading overview data:', err);
      setError('Không thể tải dữ liệu tổng quan: ' + (err.message || 'Unknown error'));
    } finally {
      setLoadingOverview(false);
    }
  };

  // Hàm fetch danh sách khách hàng từ API - CHỈ DÙNG API
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      console.log('🔄 Fetching customers from API...');
      const data = await API.getAllCustomers();
      console.log('📦 Raw API Response:', data);
      console.log('📦 Data type:', typeof data);
      console.log('📦 Is array?', Array.isArray(data));
      console.log(`✅ Loaded ${data?.length || 0} customers from API`);
      
      // Log chi tiết từng customer để kiểm tra data
      if (data && data.length > 0) {
        console.log('👤 First customer sample:', data[0]);
        console.log('👤 Customer fields:', Object.keys(data[0]));
      }
      
      setAllCustomers(data || []);
      console.log('✅ State updated with customers');
    } catch (err) {
      console.error('❌ Error loading customers:', err);
      console.error('❌ Error details:', err.response?.data || err.message);
      setAllCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Hàm fetch danh sách xe từ API (kèm thông tin chủ xe) - CHỈ DÙNG API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching vehicles from API...');
      
      const data = await API.getVehiclesMaintained();
      setVehicles(data);
      console.log(`✅ Loaded ${data.length} vehicles with owners from API`);
    } catch (err) {
      console.error('❌ Error loading vehicles:', err);
      setError(err.message || 'Không thể tải dữ liệu từ API');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal thêm xe
  const handleAddVehicleClick = () => {
    setModalMode('add');
    setSelectedVehicle(null);
    setVehicleFormData({
      vin: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: '',
      customerId: ''
    });
    setShowVehicleModal(true);
  };

  // Mở modal sửa xe
  const handleEditVehicle = (vehicle) => {
    setModalMode('edit');
    setSelectedVehicle(vehicle);
    setVehicleFormData({
      vin: vehicle.vin || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      color: vehicle.color || '',
      licensePlate: vehicle.licensePlate || '',
      customerId: vehicle.owner?.id || ''
    });
    setShowVehicleModal(true);
  };

  // Mở modal xem chi tiết
  const handleViewVehicle = (vehicle) => {
    setModalMode('view');
    setSelectedVehicle(vehicle);
    setVehicleFormData({
      vin: vehicle.vin || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      color: vehicle.color || '',
      licensePlate: vehicle.licensePlate || '',
      customerId: vehicle.owner?.id || ''
    });
    setShowVehicleModal(true);
  };

  // Lưu xe (thêm hoặc sửa)
  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!vehicleFormData.vin || !vehicleFormData.model || !vehicleFormData.licensePlate) {
      alert('⚠️ Vui lòng điền đầy đủ: VIN, Model, Biển số');
      return;
    }

    try {
      setSavingVehicle(true);
      
      if (modalMode === 'add') {
        // Thêm xe mới cho khách hàng
        if (!vehicleFormData.customerId) {
          alert('⚠️ Vui lòng chọn khách hàng');
          return;
        }
        await API.addVehicle({
          vin: vehicleFormData.vin,
          model: vehicleFormData.model,
          year: vehicleFormData.year,
          color: vehicleFormData.color,
          licensePlate: vehicleFormData.licensePlate
        });
        alert('✅ Thêm xe thành công!');
      } else if (modalMode === 'edit') {
        // Cập nhật xe - API không có endpoint này, chỉ có thể xóa và thêm lại
        alert('⚠️ Chức năng cập nhật xe chưa được hỗ trợ từ backend');
        // await API.updateVehicle(selectedVehicle.id, {
        //   vin: vehicleFormData.vin,
        //   model: vehicleFormData.model,
        //   year: vehicleFormData.year,
        //   color: vehicleFormData.color,
        //   licensePlate: vehicleFormData.licensePlate
        // });
        // alert('✅ Cập nhật xe thành công!');
      }
      
      setShowVehicleModal(false);
      fetchVehicles(); // Reload danh sách
    } catch (err) {
      console.error('❌ Error saving vehicle:', err);
      alert(`❌ Lỗi: ${err.message || 'Không thể lưu xe'}`);
    } finally {
      setSavingVehicle(false);
    }
  };

  // Xóa xe
  const handleDeleteVehicle = async (vehicleId) => {
    if (!confirm('⚠️ Bạn có chắc muốn xóa xe này?')) {
      return;
    }

    try {
      await API.deleteVehicle(vehicleId);
      alert('✅ Đã xóa xe thành công!');
      fetchVehicles();
    } catch (err) {
      console.error('❌ Error deleting vehicle:', err);
      alert(`❌ Lỗi: ${err.message || 'Không thể xóa xe'}`);
    }
  };

  // ========================================
  // 🧑 CUSTOMER CRUD HANDLERS
  // ========================================
  
  // Thêm khách hàng mới
  const handleAddCustomer = () => {
    setCustomerModalMode('add');
    setSelectedCustomer(null);
    setCustomerFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowCustomerModal(true);
  };

  // Sửa khách hàng
  const handleEditCustomer = (customer) => {
    setCustomerModalMode('edit');
    setSelectedCustomer(customer);
    setCustomerFormData({
      name: customer.name || '',
      username: customer.username || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setShowCustomerModal(true);
  };

  // Xem chi tiết khách hàng
  const handleViewCustomer = (customer) => {
    setCustomerModalMode('view');
    setSelectedCustomer(customer);
    setCustomerFormData({
      name: customer.name || '',
      username: customer.username || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setShowCustomerModal(true);
  };

  // Lưu khách hàng (add/edit)
  const handleSaveCustomer = async () => {
    // Validation
    if (!customerFormData.username.trim()) {
      alert('⚠️ Vui lòng nhập tên đăng nhập!');
      return;
    }
    if (!customerFormData.email.trim() || !customerFormData.email.includes('@')) {
      alert('⚠️ Vui lòng nhập email hợp lệ!');
      return;
    }

    setSavingCustomer(true);
    try {
      if (customerModalMode === 'edit' && selectedCustomer) {
        // Cập nhật khách hàng
        console.log('🔄 Updating customer:', selectedCustomer.id, customerFormData);
        const response = await API.updateUser(selectedCustomer.id, {
          fullName: customerFormData.name, // Backend expects 'fullName' not 'name'
          email: customerFormData.email,
          phone: customerFormData.phone
          // Note: username and address không được hỗ trợ bởi backend API
        });
        console.log('✅ Update response:', response);
        
        // Cập nhật state ngay lập tức thay vì fetch lại
        setAllCustomers(prevCustomers => 
          prevCustomers.map(c => 
            c.id === selectedCustomer.id 
              ? { ...c, ...customerFormData }
              : c
          )
        );
        
        alert('✅ Cập nhật khách hàng thành công!');
      } else if (customerModalMode === 'add') {
        // Tính năng thêm khách hàng - cần API endpoint
        alert('⚠️ Chức năng thêm khách hàng chưa được hỗ trợ bởi backend!');
        setShowCustomerModal(false);
        setSavingCustomer(false);
        return;
      }
      
      setShowCustomerModal(false);
      // Fetch lại để đảm bảo đồng bộ với server
      console.log('🔄 Force refresh customer list...');
      
      // Đợi 500ms để backend xử lý xong
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await fetchCustomers();
    } catch (err) {
      console.error('❌ Error saving customer:', err);
      alert(`❌ Lỗi: ${err.message || 'Không thể lưu khách hàng'}`);
    } finally {
      setSavingCustomer(false);
    }
  };

  // Xóa khách hàng
  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('⚠️ Bạn có chắc muốn xóa khách hàng này?')) {
      return;
    }

    try {
      await API.deleteEmployee(customerId); // API dùng chung cho user
      alert('✅ Đã xóa khách hàng thành công!');
      fetchCustomers();
    } catch (err) {
      console.error('❌ Error deleting customer:', err);
      alert(`❌ Lỗi: ${err.message || 'Không thể xóa khách hàng'}`);
    }
  };

  // Appointments Data
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  // ✅ Customer Modal & Edit State
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [savingCustomer, setSavingCustomer] = useState(false);

  // Maintenance, Parts, Staff, Financial, Chat Data - CHỜ API
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [partsList, setPartsList] = useState([]);
  const [loadingParts, setLoadingParts] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [financialData, setFinancialData] = useState({
    revenue: { thisMonth: 0 },
    expenses: { thisMonth: 0 },
    profit: { thisMonth: 0 },
    serviceStats: [],
    paymentMethods: { online: 0, offline: 0 }
  });
  const [chatCustomers, setChatCustomers] = useState([]);

  // Fetch Parts from API
  const fetchParts = async () => {
    try {
      setLoadingParts(true);
      console.log('🔄 Fetching parts from API...');
      const data = await API.getAllParts();
      setPartsList(data);
      console.log(`✅ Loaded ${data.length} parts from API`);
    } catch (err) {
      console.error('❌ Error loading parts:', err);
      setPartsList([]);
    } finally {
      setLoadingParts(false);
    }
  };

  // Hàm fetch danh sách appointments từ API - CHỈ DÙNG API
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      setAppointmentsError(null);
      console.log('🔄 Fetching appointments from API...');
      
      const data = await API.getAllAppointments();
      console.log('✅ API Response:', data);
      
      if (Array.isArray(data)) {
        setAppointments(data);
        console.log(`✅ Loaded ${data.length} appointments from API`);
      } else {
        setAppointments([]);
        console.warn('⚠️ API returned non-array data');
      }
    } catch (err) {
      console.error('❌ Error fetching appointments:', err);
      setAppointmentsError(err.message || 'Không thể tải dữ liệu từ API');
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const [activeChatCustomer, setActiveChatCustomer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Helper Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'pending': return 'status-pending';
      case 'accepted':
      case 'confirmed': return 'status-confirmed';
      case 'in-progress':
      case 'in_progress':
      case 'inprogress': return 'status-in-progress';
      case 'completed':
      case 'done': return 'status-completed';
      case 'waiting': return 'status-waiting';
      case 'cancelled':
      case 'canceled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'pending': return 'Chờ xác nhận';
      case 'accepted':
      case 'confirmed': return 'Đã xác nhận';
      case 'in-progress':
      case 'in_progress':
      case 'inprogress': return 'Đang thực hiện';
      case 'completed':
      case 'done': return 'Hoàn thành';
      case 'waiting': return 'Đang chờ';
      case 'cancelled':
      case 'canceled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && activeChatCustomer) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'manager',
        text: newMessage,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="manager-dashboard">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Quay lại
          </button>
          <h1>Manager Dashboard - Center #{centerId}</h1>
        </div>
        <div className="header-right">
          <div className="manager-info">
            <div className="manager-avatar">
              <FaUserTie />
            </div>
            <div className="manager-details">
              <p className="manager-name">{fullName || 'Manager'}</p>
              <p className="manager-role">Quản lý trung tâm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine />
          Tổng quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <FaUser />
          Khách hàng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <FaCar />
          Quản lý xe
        </button>
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <FaCalendarAlt />
          Lịch hẹn & Dịch vụ
        </button>
        <button 
          className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <FaTools />
          Quy trình Bảo dưỡng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
          onClick={() => setActiveTab('parts')}
        >
          <FaWarehouse />
          Phụ tùng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          <FaUsers />
          Nhân sự
        </button>
        <button 
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          <FaMoneyBillWave />
          Tài chính & Báo cáo
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <FaComments />
          Chat
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            {loadingOverview ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu tổng quan...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error}</p>
                <button onClick={fetchOverviewData} className="btn-retry">
                  Thử lại
                </button>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card revenue">
                    <div className="stat-icon">
                      <FaMoneyBillWave />
                    </div>
                    <div className="stat-info">
                      <h3>{formatCurrency(overviewStats.totalRevenue)}</h3>
                      <p>Tổng doanh thu</p>
                      <span className="stat-trend positive">↑ Real-time</span>
                    </div>
                  </div>
                  
                  <div className="stat-card customers">
                    <div className="stat-icon">
                      <FaUser />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.totalCustomers}</h3>
                      <p>Khách hàng</p>
                      <span className="stat-detail">Tổng số đăng ký</span>
                    </div>
                  </div>
                  
                  <div className="stat-card cars">
                    <div className="stat-icon">
                      <FaCar />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.totalVehicles}</h3>
                      <p>Xe đã bảo dưỡng</p>
                      <span className="stat-detail">Đang quản lý</span>
                    </div>
                  </div>
                  
                  <div className="stat-card appointments">
                    <div className="stat-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.totalAppointments}</h3>
                      <p>Tổng lịch hẹn</p>
                      <span className="stat-detail">Tất cả thời gian</span>
                    </div>
                  </div>
                  
                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <FaClock />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.pendingAppointments}</h3>
                      <p>Chờ xử lý</p>
                      <span className="stat-detail status-pending">Cần xác nhận</span>
                    </div>
                  </div>
                  
                  <div className="stat-card in-progress">
                    <div className="stat-icon">
                      <FaTools />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.inProgressAppointments}</h3>
                      <p>Đang bảo dưỡng</p>
                      <span className="stat-detail status-progress">Đang làm việc</span>
                    </div>
                  </div>
                  
                  {/* ✅ NEW: Cancelled Appointments Card */}
                  <div className="stat-card cancelled">
                    <div className="stat-icon">
                      <FaTimes />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.cancelledAppointments}</h3>
                      <p>Đã hủy</p>
                      <span className="stat-detail status-cancelled">Không thực hiện</span>
                    </div>
                  </div>
                  
                  <div className="stat-card completed">
                    <div className="stat-icon">
                      <FaCheckCircle />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.completedAppointments}</h3>
                      <p>Đã hoàn thành</p>
                      <span className="stat-detail status-done">Thành công</span>
                    </div>
                  </div>
                  
                  <div className="stat-card staff">
                    <div className="stat-icon">
                      <FaUsers />
                    </div>
                    <div className="stat-info">
                      <h3>{overviewStats.activeTechnicians}</h3>
                      <p>Kỹ thuật viên</p>
                      <span className="stat-detail">Đang hoạt động</span>
                    </div>
                  </div>
                </div>

                {/* Charts & Reports Section */}
                <div className="charts-section">
                  {/* Revenue Chart */}
                  <div className="chart-card revenue-chart">
                    <div className="chart-header">
                      <h3><FaChartBar /> Doanh thu theo tháng</h3>
                      <button 
                        onClick={fetchOverviewData} 
                        className="btn-refresh"
                        title="Refresh data"
                      >
                        🔄
                      </button>
                    </div>
                    <div className="chart-body">
                      {Object.keys(overviewStats.revenueData || {}).length > 0 ? (
                        <div className="bar-chart">
                          {Object.entries(overviewStats.revenueData).map(([month, revenue]) => {
                            // ✅ Convert to absolute value to avoid negative display
                            const revenueValue = Math.abs(typeof revenue === 'number' ? revenue : parseFloat(revenue) || 0);
                            const allValues = Object.values(overviewStats.revenueData).map(v => Math.abs(parseFloat(v) || 0));
                            const maxRevenue = Math.max(...allValues, 1); // Avoid division by 0
                            const height = (revenueValue / maxRevenue) * 100;
                            return (
                              <div key={month} className="bar-item">
                                <div className="bar-wrapper">
                                  <div 
                                    className="bar" 
                                    style={{ height: `${height}%` }}
                                    title={formatCurrency(revenueValue)}
                                  ></div>
                                </div>
                                <div className="bar-label">{String(month)}</div>
                                <div className="bar-value">{formatCurrency(revenueValue)}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="chart-empty">
                          <FaChartBar size={40} />
                          <p>Chưa có dữ liệu doanh thu</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profit Chart */}
                  <div className="chart-card profit-chart">
                    <div className="chart-header">
                      <h3><FaChartLine /> Lợi nhuận theo tháng</h3>
                    </div>
                    <div className="chart-body">
                      {Object.keys(overviewStats.profitData || {}).length > 0 ? (
                        <div className="bar-chart">
                          {Object.entries(overviewStats.profitData).map(([month, profit]) => {
                            // ✅ Convert to absolute value to avoid negative display
                            const profitValue = Math.abs(typeof profit === 'number' ? profit : parseFloat(profit) || 0);
                            const allValues = Object.values(overviewStats.profitData).map(v => Math.abs(parseFloat(v) || 0));
                            const maxProfit = Math.max(...allValues, 1); // Avoid division by 0
                            const height = (profitValue / maxProfit) * 100;
                            return (
                              <div key={month} className="bar-item">
                                <div className="bar-wrapper">
                                  <div 
                                    className="bar bar-profit" 
                                    style={{ height: `${height}%` }}
                                    title={formatCurrency(profitValue)}
                                  ></div>
                                </div>
                                <div className="bar-label">{String(month)}</div>
                                <div className="bar-value">{formatCurrency(profitValue)}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="chart-empty">
                          <FaChartLine size={40} />
                          <p>Chưa có dữ liệu lợi nhuận</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trending Tables */}
                <div className="trending-section">
                  {/* Trending Services */}
                  <div className="trending-card">
                    <div className="card-header">
                      <h3><FaTools /> Dịch vụ phổ biến nhất (All Time)</h3>
                    </div>
                    <div className="card-body">
                      {overviewStats.trendingServices.length > 0 ? (
                        <table className="trending-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Dịch vụ</th>
                              <th>Số lần</th>
                            </tr>
                          </thead>
                          <tbody>
                            {overviewStats.trendingServices.slice(0, 5).map((item, index) => {
                              // ✅ Handle different data formats from API
                              let serviceName = 'N/A';
                              let count = 0;
                              
                              if (Array.isArray(item)) {
                                // Format: [key, value]
                                serviceName = item[0] || 'N/A';
                                count = item[1] || 0;
                              } else if (typeof item === 'object') {
                                // Format: {key, value} or {serviceType, count}
                                serviceName = item.key || item.serviceType || item.name || 'N/A';
                                count = item.value || item.count || 0;
                              }
                              
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{serviceName}</td>
                                  <td className="count-badge">{count}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="empty-state-small">
                          <p>Chưa có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trending Services Last Month */}
                  <div className="trending-card">
                    <div className="card-header">
                      <h3><FaCalendarWeek /> Dịch vụ phổ biến (Tháng trước)</h3>
                    </div>
                    <div className="card-body">
                      {overviewStats.trendingServicesLastMonth.length > 0 ? (
                        <table className="trending-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Dịch vụ</th>
                              <th>Số lần</th>
                            </tr>
                          </thead>
                          <tbody>
                            {overviewStats.trendingServicesLastMonth.slice(0, 5).map((item, index) => {
                              // ✅ Handle different data formats from API
                              let serviceName = 'N/A';
                              let count = 0;
                              
                              if (Array.isArray(item)) {
                                // Format: [key, value]
                                serviceName = item[0] || 'N/A';
                                count = item[1] || 0;
                              } else if (typeof item === 'object') {
                                // Format: {key, value} or {serviceType, count}
                                serviceName = item.key || item.serviceType || item.name || 'N/A';
                                count = item.value || item.count || 0;
                              }
                              
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{serviceName}</td>
                                  <td className="count-badge">{count}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="empty-state-small">
                          <p>Chưa có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Parts Used */}
                  <div className="trending-card">
                    <div className="card-header">
                      <h3><FaWarehouse /> Phụ tùng trong kho</h3>
                    </div>
                    <div className="card-body">
                      {Array.isArray(overviewStats.trendingParts) && overviewStats.trendingParts.length > 0 ? (
                        <table className="trending-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Phụ tùng</th>
                              <th>Số lượng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {overviewStats.trendingParts.slice(0, 5).map((part, index) => (
                              <tr key={part.id || index}>
                                <td>{index + 1}</td>
                                <td>{part.name || part.partName || 'N/A'}</td>
                                <td className="count-badge">{part.quantityInStock || part.quantity || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="empty-state-small">
                          <p>Chưa có dữ liệu</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Customers & Cars Tab */}
        {activeTab === 'customers' && (
          <div className="customers-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng (tên, email, SĐT)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="add-btn" onClick={handleAddCustomer}>
                <FaPlus />
                Thêm khách hàng
              </button>
            </div>

            {loadingCustomers && (
              <div className="loading-message">
                <p>⏳ Đang tải dữ liệu khách hàng từ API...</p>
              </div>
            )}

            {!loadingCustomers && allCustomers.length === 0 && (
              <div className="empty-message">
                <p>📭 Chưa có khách hàng nào trong hệ thống</p>
              </div>
            )}

            {!loadingCustomers && allCustomers.length > 0 && (
              <div className="customers-grid">
                {allCustomers
                  .filter(customer => 
                    searchQuery === '' || 
                    customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(customer => (
                    <div key={customer.id} className="customer-card">
                      <div className="customer-header">
                        <div className="customer-avatar">
                          <FaUser />
                        </div>
                        <div>
                          <h3>{customer.fullName || customer.name || customer.username}</h3>
                          <p>ID: #{customer.id}</p>
                        </div>
                      </div>
                      
                      <div className="customer-info">
                        <div className="info-row">
                          <FaEnvelope />
                          <span>{customer.email}</span>
                        </div>
                        <div className="info-row">
                          <FaPhone />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.joinDate && (
                          <div className="info-row">
                            <FaCalendarAlt />
                            <span>Tham gia: {new Date(customer.joinDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="customer-actions">
                        <button 
                          className="btn-view"
                          onClick={() => handleViewCustomer(customer)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditCustomer(customer)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          title="Xóa"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Vehicles Management Tab - Quản lý xe */}
        {activeTab === 'vehicles' && (
          <div className="vehicles-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm xe (Model, VIN, Biển số)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="toolbar-actions">
                <button className="add-btn" onClick={handleAddVehicleClick}>
                  <FaPlus />
                  Thêm xe
                </button>
                <button className="refresh-btn" onClick={fetchVehicles}>
                  <FaEdit />
                  Làm mới
                </button>
              </div>
            </div>

            {/* Danh sách xe đã đến bảo trì */}
            <div className="all-vehicles-section">
              <div className="section-header-with-stats">
                <h3>🚗 Danh sách xe đã đến bảo trì</h3>
                <div className="quick-stats">
                  <span className="stat-item">
                    👥 {allCustomers.length} khách hàng
                  </span>
                  <span className="stat-item">
                    🚗 {vehicles.length} xe
                  </span>
                </div>
              </div>
              
              {loading && (
                <div className="loading-message">
                  <p>⏳ Đang tải dữ liệu xe...</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p>❌ Lỗi: {error}</p>
                  <button onClick={fetchVehicles} className="btn-retry">🔄 Thử lại</button>
                </div>
              )}

              {!loading && !error && vehicles.length === 0 && (
                <div className="empty-message">
                  <p>📭 Chưa có xe nào trong hệ thống</p>
                </div>
              )}

              {!loading && !error && vehicles.length > 0 && (
                <div className="vehicles-table">
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Thông tin xe</th>
                        <th>VIN</th>
                        <th>Biển số</th>
                        <th>Năm SX</th>
                        <th>Màu sắc</th>
                        <th>Lịch sử bảo trì</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles
                        .filter(vehicle => 
                          searchQuery === '' || 
                          vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicle.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicle.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vehicle.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((vehicleData, index) => {
                          // API trả về: {vehicle, owner} hoặc chỉ vehicle với owner nested
                          const vehicle = vehicleData.vehicle || vehicleData;
                          const owner = vehicleData.owner || vehicle.owner;
                          
                          return (
                            <tr key={vehicle.id}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="vehicle-info">
                                  <strong>{vehicle.model}</strong>
                                  {owner && <p className="owner-name">👤 {owner.fullName || owner.name || owner.username}</p>}
                                </div>
                              </td>
                              <td><code>{vehicle.vin}</code></td>
                              <td><span className="badge">{vehicle.licensePlate}</span></td>
                              <td>{vehicle.year}</td>
                              <td>{vehicle.color}</td>
                              <td>
                                <span className="no-history">Chưa có API lịch sử</span>
                              </td>
                              <td>
                                <button 
                                  className="btn-sm btn-view" 
                                  title="Xem chi tiết"
                                  onClick={() => handleViewVehicle(vehicleData)}
                                >
                                  <FaCar /> Xem
                                </button>
                                <button 
                                  className="btn-sm btn-edit" 
                                  title="Chỉnh sửa"
                                  onClick={() => handleEditVehicle(vehicle)}
                                >
                                  <FaEdit /> Sửa
                                </button>
                                <button 
                                  className="btn-sm btn-delete" 
                                  title="Xóa"
                                  onClick={() => handleDeleteVehicle(vehicle.id)}
                                >
                                  <FaTimes /> Xóa
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <div className="total-count">
                    <strong>Tổng số xe: {vehicles.filter(v => 
                      searchQuery === '' || 
                      v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments & Services Tab */}
        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm lịch hẹn..."
                />
              </div>
              <button className="add-btn">
                <FaPlus />
                Thêm lịch hẹn
              </button>
            </div>

            <div className="appointments-stats">
              <div className="stat-card pending">
                <FaClock />
                <div>
                  <h4>{appointments.filter(a => a.status?.toLowerCase() === 'pending').length}</h4>
                  <p>Chờ xác nhận</p>
                </div>
              </div>
              <div className="stat-card confirmed">
                <FaCheckCircle />
                <div>
                  <h4>{appointments.filter(a => {
                    const s = a.status?.toLowerCase();
                    return s === 'accepted' || s === 'confirmed';
                  }).length}</h4>
                  <p>Đã xác nhận</p>
                </div>
              </div>
              <div className="stat-card in-progress">
                <FaTools />
                <div>
                  <h4>{appointments.filter(a => {
                    const s = a.status?.toLowerCase();
                    return s === 'in_progress' || s === 'in-progress' || s === 'inprogress';
                  }).length}</h4>
                  <p>Đang thực hiện</p>
                </div>
              </div>
              <div className="stat-card completed">
                <FaCheckCircle />
                <div>
                  <h4>{appointments.filter(a => {
                    const s = a.status?.toLowerCase();
                    return s === 'completed' || s === 'done';
                  }).length}</h4>
                  <p>Hoàn thành</p>
                </div>
              </div>
            </div>

            {loadingAppointments && (
              <div className="loading-message">
                <p>⏳ Đang tải dữ liệu lịch hẹn từ API...</p>
              </div>
            )}

            {!loadingAppointments && appointmentsError && (
              <div className="error-message">
                <p>❌ Lỗi: {appointmentsError}</p>
                <button onClick={fetchAppointments} className="btn-retry">
                  🔄 Thử lại
                </button>
              </div>
            )}

            {!loadingAppointments && !appointmentsError && appointments.length === 0 && (
              <div className="empty-message">
                <p>📭 Chưa có lịch hẹn nào trong hệ thống</p>
              </div>
            )}

            {!loadingAppointments && !appointmentsError && appointments.length > 0 && (
              <div className="appointments-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Khách hàng</th>
                      <th>Xe</th>
                      <th>Dịch vụ</th>
                      <th>Ngày giờ</th>
                      <th>Kỹ thuật viên</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => {
                      // Map AppointmentAllFieldsDto from API
                      // API fields: appointmentId, customerId, vehicleId, centerId, appoimentDate (typo in API), 
                      // status, createAt, fullName, email, phone, serviceType
                      const appointmentId = apt.appointmentId || apt.id;
                      const customerName = apt.fullName || apt.customerName || 'N/A';
                      const customerEmail = apt.email || '';
                      const customerPhone = apt.phone || '';
                      
                      // For vehicle info, we need to fetch separately or use vehicleId
                      const vehicleInfo = apt.vehicleId ? `Xe #${apt.vehicleId}` : 'N/A';
                      
                      const serviceType = apt.serviceType || apt.service || 'Bảo dưỡng';
                      
                      // Handle API typo: "appoimentDate" instead of "appointmentDate"
                      const appointmentDate = apt.appoimentDate || apt.appointmentDate;
                      const formattedDate = appointmentDate
                        ? new Date(appointmentDate).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A';
                      
                      const technicians = 'Chưa phân công'; // API doesn't return technicians in this endpoint
                      
                      return (
                        <tr key={appointmentId}>
                          <td>#{appointmentId}</td>
                          <td>
                            <div>
                              <div><strong>{customerName}</strong></div>
                              {customerPhone && <div style={{fontSize: '0.85em', color: '#666'}}>📞 {customerPhone}</div>}
                            </div>
                          </td>
                          <td>{vehicleInfo}</td>
                          <td>{serviceType}</td>
                          <td>{formattedDate}</td>
                          <td>{technicians}</td>
                          <td>
                            <span className={`status-badge ${getStatusColor(apt.status)}`}>
                              {getStatusText(apt.status)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons-small">
                              <button className="btn-edit" title="Chỉnh sửa"><FaEdit /></button>
                              <button className="btn-assign" title="Phân công"><FaUserTie /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Maintenance Process Tab */}
        {activeTab === 'maintenance' && (
          <div className="maintenance-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo số phiếu..."
                />
              </div>
            </div>

            {maintenanceList.length === 0 ? (
              <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center'}}>
                <FaTools size={60} style={{color: '#ccc', marginBottom: '20px'}} />
                <h3>Chưa có API quy trình bảo dưỡng</h3>
                <p>Backend chưa cung cấp endpoint cho tab này</p>
              </div>
            ) : (
              <>
                <div className="maintenance-stats">
                  <div className="stat-card waiting">
                    <FaClock />
                    <div>
                      <h4>{maintenanceList.filter(m => m.status === 'waiting').length}</h4>
                      <p>Đang chờ</p>
                    </div>
                  </div>
                  <div className="stat-card in-progress">
                    <FaTools />
                    <div>
                      <h4>{maintenanceList.filter(m => m.status === 'in-progress').length}</h4>
                      <p>Đang làm</p>
                    </div>
                  </div>
                  <div className="stat-card completed">
                    <FaCheckCircle />
                    <div>
                      <h4>{maintenanceList.filter(m => m.status === 'completed').length}</h4>
                      <p>Hoàn tất</p>
                    </div>
                  </div>
                </div>

                <div className="maintenance-cards">
                  {maintenanceList.map(item => (
                    <div key={item.id} className="maintenance-card">
                      <div className="maintenance-header">
                        <div>
                          <h3>{item.ticketNumber}</h3>
                          <p>{item.customerName} - {item.carInfo}</p>
                        </div>
                        <span className={`status-badge ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      
                      <div className="maintenance-info">
                        <div className="info-item">
                          <FaUser />
                          <span>KT viên: {item.technician}</span>
                        </div>
                        <div className="info-item">
                          <FaClock />
                          <span>Thời gian: {item.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="checklist-summary">
                        <h4>Checklist tiến độ</h4>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{
                              width: `${(item.checklist.filter(c => c.status === 'completed').length / item.checklist.length) * 100}%`
                            }}
                          />
                        </div>
                        <p>
                          {item.checklist.filter(c => c.status === 'completed').length} / {item.checklist.length} hoàn thành
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Parts Inventory Tab */}
        {activeTab === 'parts' && (
          <div className="parts-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm phụ tùng..."
                />
              </div>
              <button className="add-btn">
                <FaPlus />
                Thêm phụ tùng
              </button>
            </div>

            {loadingParts ? (
              <div className="loading-message">
                <p>⏳ Đang tải dữ liệu phụ tùng từ API...</p>
              </div>
            ) : partsList.length === 0 ? (
              <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center'}}>
                <FaWarehouse size={60} style={{color: '#ccc', marginBottom: '20px'}} />
                <h3>Chưa có phụ tùng nào trong kho</h3>
                <p>Bấm "Thêm phụ tùng" để thêm phụ tùng mới</p>
              </div>
            ) : (
              <>
                <div className="parts-stats">
                  <div className="stat-card">
                    <FaWarehouse />
                    <div>
                      <h4>{partsList.length}</h4>
                      <p>Tổng phụ tùng</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <FaRobot />
                    <div>
                      <h4>AI Gợi ý</h4>
                      <p>Đề xuất tối ưu tồn kho</p>
                    </div>
                  </div>
                </div>

                <div className="parts-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã phụ tùng</th>
                        <th>Tên</th>
                        <th>Danh mục</th>
                        <th>Tồn kho</th>
                        <th>Tồn tối thiểu</th>
                        <th>AI Đề xuất</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partsList.map(part => {
                        const stock = part.quantityInStock || part.stock || 0;
                        const minStock = part.minimumStock || part.minStock || 10;
                        const status = stock === 0 ? 'out-stock' : stock < minStock ? 'low-stock' : 'in-stock';
                        
                        return (
                          <tr key={part.id || part.partId}>
                            <td>{part.id || part.partId}</td>
                            <td>{part.name || part.partName || 'N/A'}</td>
                            <td>{part.category || part.categoryName || 'Chưa phân loại'}</td>
                            <td><strong>{stock}</strong></td>
                            <td>{minStock}</td>
                            <td>
                              {part.aiRecommendation ? (
                                <div className="ai-recommendation">
                                  <FaRobot />
                                  <div>
                                    <strong>{part.aiRecommendation.suggestedMinStock}</strong>
                                    <p>{part.aiRecommendation.reason}</p>
                                  </div>
                                </div>
                              ) : (
                                <span style={{color: '#999'}}>Chưa có đề xuất</span>
                              )}
                            </td>
                            <td>
                              <span className={`stock-badge ${status}`}>
                                {status === 'in-stock' ? 'Còn hàng' : 
                                 status === 'low-stock' ? 'Sắp hết' : 'Hết hàng'}
                              </span>
                            </td>
                            <td>
                              <button className="btn-edit" title="Chỉnh sửa"><FaEdit /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <div className="staff-section">
            <div className="section-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                />
              </div>
              <button className="add-btn">
                <FaPlus />
                Thêm nhân viên
              </button>
            </div>

            {staffList.length === 0 ? (
              <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center'}}>
                <FaUsers size={60} style={{color: '#ccc', marginBottom: '20px'}} />
                <h3>Chưa có API quản lý nhân sự</h3>
                <p>Backend chưa cung cấp endpoint cho tab này</p>
              </div>
            ) : (
              <div className="staff-grid">
                {staffList.map(staff => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-header">
                    <div className="staff-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h3>{staff.name}</h3>
                      <p>{staff.role}</p>
                    </div>
                  </div>

                  <div className="staff-info">
                    <div className="info-row">
                      <FaEnvelope />
                      <span>{staff.email}</span>
                    </div>
                    <div className="info-row">
                      <FaPhone />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="info-row">
                      <FaCalendarWeek />
                      <span>{staff.shift}</span>
                    </div>
                  </div>

                  <div className="performance-section">
                    <h4>Hiệu suất</h4>
                    <div className="performance-stats">
                      <div className="perf-item">
                        <span className="label">Công việc hoàn thành</span>
                        <span className="value">{staff.performance.completedJobs}</span>
                      </div>
                      <div className="perf-item">
                        <span className="label">Thời gian TB</span>
                        <span className="value">{staff.performance.avgTime}</span>
                      </div>
                      <div className="perf-item">
                        <span className="label">Đánh giá</span>
                        <span className="value">⭐ {staff.performance.rating}</span>
                      </div>
                      <div className="perf-item">
                        <span className="label">Giờ làm tuần này</span>
                        <span className="value">{staff.workingHours.thisWeek}h</span>
                      </div>
                    </div>
                  </div>

                  <div className="certificates-section">
                    <h4>Chứng chỉ</h4>
                    <div className="certificates-list">
                      {staff.certificates.map((cert, index) => (
                        <div key={index} className="certificate-item">
                          <FaCertificate />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="staff-actions">
                    <button className="btn-edit"><FaEdit /> Chỉnh sửa</button>
                    <button className="btn-schedule"><FaCalendarAlt /> Phân công</button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Finance & Reports Tab */}
        {activeTab === 'finance' && (
          <div className="finance-section">
            {financialData.serviceStats.length === 0 ? (
              <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center'}}>
                <FaMoneyBillWave size={60} style={{color: '#ccc', marginBottom: '20px'}} />
                <h3>Chưa có API tài chính & báo cáo</h3>
                <p>Backend chưa cung cấp endpoint cho tab này</p>
              </div>
            ) : (
              <>
                <div className="finance-stats">
              <div className="stat-card revenue">
                <FaMoneyBillWave />
                <div>
                  <h3>{formatCurrency(financialData.revenue.thisMonth)}</h3>
                  <p>Doanh thu tháng này</p>
                </div>
              </div>
              <div className="stat-card expense">
                <FaReceipt />
                <div>
                  <h3>{formatCurrency(financialData.expenses.thisMonth)}</h3>
                  <p>Chi phí tháng này</p>
                </div>
              </div>
              <div className="stat-card profit">
                <FaChartLine />
                <div>
                  <h3>{formatCurrency(financialData.profit.thisMonth)}</h3>
                  <p>Lợi nhuận tháng này</p>
                </div>
              </div>
            </div>

            <div className="finance-content">
              <div className="revenue-chart-card">
                <h3>Doanh thu theo dịch vụ</h3>
                <div className="service-revenue-list">
                  {financialData.serviceStats.map((service, index) => (
                    <div key={index} className="service-revenue-item">
                      <div className="service-info">
                        <strong>{service.service}</strong>
                        <span>{service.count} lượt</span>
                      </div>
                      <div className="revenue-amount">
                        {formatCurrency(service.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="payment-methods-card">
                <h3>Phương thức thanh toán</h3>
                <div className="payment-stats">
                  <div className="payment-item">
                    <FaCreditCard />
                    <div>
                      <strong>Online</strong>
                      <p>{financialData.paymentMethods.online}%</p>
                    </div>
                  </div>
                  <div className="payment-item">
                    <FaMoneyBillWave />
                    <div>
                      <strong>Offline</strong>
                      <p>{financialData.paymentMethods.offline}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="chat-section">
            {chatCustomers.length === 0 ? (
              <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center'}}>
                <FaComments size={60} style={{color: '#ccc', marginBottom: '20px'}} />
                <h3>Chưa có API chat</h3>
                <p>Backend chưa cung cấp endpoint cho tab này</p>
              </div>
            ) : (
              <div className="chat-layout">
              <div className="chat-list">
                <h3>Tin nhắn</h3>
                <div className="chat-items">
                  {chatCustomers.map(customer => (
                    <div 
                      key={customer.id}
                      className={`chat-item ${activeChatCustomer?.id === customer.id ? 'active' : ''}`}
                      onClick={() => setActiveChatCustomer(customer)}
                    >
                      <div className="chat-avatar">
                        <FaUser />
                      </div>
                      <div className="chat-preview">
                        <h4>{customer.name}</h4>
                        <p>{customer.lastMessage}</p>
                      </div>
                      <span className="chat-time">{customer.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chat-window">
                {activeChatCustomer ? (
                  <>
                    <div className="chat-header">
                      <div className="chat-avatar">
                        <FaUser />
                      </div>
                      <div>
                        <h3>{activeChatCustomer.name}</h3>
                        <span className="online-status">Đang hoạt động</span>
                      </div>
                    </div>

                    <div className="chat-messages">
                      {chatMessages.map(message => (
                        <div 
                          key={message.id}
                          className={`message ${message.sender === 'manager' ? 'sent' : 'received'}`}
                        >
                          <div className="message-bubble">
                            <p>{message.text}</p>
                            <span className="message-time">{message.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form className="chat-input" onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button type="submit">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="empty-state">
                    <FaComments size={60} />
                    <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Quản lý xe (Thêm/Sửa/Xem) */}
      {showVehicleModal && (
        <div className="modal-overlay" onClick={() => setShowVehicleModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'add' && '➕ Thêm xe mới'}
                {modalMode === 'edit' && '✏️ Chỉnh sửa xe'}
                {modalMode === 'view' && '👁️ Thông tin xe'}
              </h2>
              <button className="modal-close" onClick={() => setShowVehicleModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSaveVehicle} className="vehicle-form">
              {modalMode === 'add' && (
                <div className="form-group">
                  <label>Chọn khách hàng <span className="required">*</span></label>
                  <select
                    value={vehicleFormData.customerId}
                    onChange={(e) => setVehicleFormData({...vehicleFormData, customerId: e.target.value})}
                    required
                    disabled={modalMode === 'view' || loadingCustomers}
                  >
                    <option value="">
                      {loadingCustomers ? '⏳ Đang tải...' : '-- Chọn khách hàng --'}
                    </option>
                    {allCustomers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.fullName || customer.name || customer.username} ({customer.email})
                      </option>
                    ))}
                  </select>
                  {allCustomers.length === 0 && !loadingCustomers && (
                    <small style={{color: '#f44336', marginTop: '5px', display: 'block'}}>
                      ⚠️ Chưa có khách hàng nào trong hệ thống
                    </small>
                  )}
                </div>
              )}

              {modalMode === 'view' && selectedVehicle?.owner && (
                <div className="info-display">
                  <strong>👤 Chủ xe:</strong> {selectedVehicle.owner.fullName || selectedVehicle.owner.name || selectedVehicle.owner.username}
                  <br />
                  <strong>📧 Email:</strong> {selectedVehicle.owner.email}
                </div>
              )}

              <div className="form-group">
                <label>VIN <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="VD: WBA3B5C50DF123456"
                  value={vehicleFormData.vin}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, vin: e.target.value})}
                  required
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Model xe <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="VD: Tesla Model 3"
                  value={vehicleFormData.model}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, model: e.target.value})}
                  required
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Năm sản xuất</label>
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    value={vehicleFormData.year}
                    onChange={(e) => setVehicleFormData({...vehicleFormData, year: parseInt(e.target.value)})}
                    disabled={modalMode === 'view'}
                  />
                </div>

                <div className="form-group">
                  <label>Màu sắc</label>
                  <input
                    type="text"
                    placeholder="VD: Đỏ, Trắng..."
                    value={vehicleFormData.color}
                    onChange={(e) => setVehicleFormData({...vehicleFormData, color: e.target.value})}
                    disabled={modalMode === 'view'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Biển số <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="VD: 29A-12345"
                  value={vehicleFormData.licensePlate}
                  onChange={(e) => setVehicleFormData({...vehicleFormData, licensePlate: e.target.value})}
                  required
                  disabled={modalMode === 'view'}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowVehicleModal(false)}
                >
                  {modalMode === 'view' ? 'Đóng' : 'Hủy'}
                </button>
                {modalMode !== 'view' && (
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={savingVehicle}
                  >
                    {savingVehicle ? '⏳ Đang lưu...' : (modalMode === 'add' ? '✅ Thêm xe' : '💾 Lưu thay đổi')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🧑 Customer Modal */}
      {showCustomerModal && (
        <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {customerModalMode === 'add' && '➕ Thêm khách hàng mới'}
                {customerModalMode === 'edit' && '✏️ Chỉnh sửa khách hàng'}
                {customerModalMode === 'view' && '👁️ Chi tiết khách hàng'}
              </h2>
              <button className="close-btn" onClick={() => setShowCustomerModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveCustomer(); }}>
              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  value={customerFormData.name}
                  onChange={(e) => setCustomerFormData({...customerFormData, name: e.target.value})}
                  disabled={customerModalMode === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Tên đăng nhập <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="VD: nguyenvana"
                  value={customerFormData.username}
                  onChange={(e) => setCustomerFormData({...customerFormData, username: e.target.value})}
                  required
                  disabled={customerModalMode === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  placeholder="VD: nguyenvana@email.com"
                  value={customerFormData.email}
                  onChange={(e) => setCustomerFormData({...customerFormData, email: e.target.value})}
                  required
                  disabled={customerModalMode === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="VD: 0901234567"
                  value={customerFormData.phone}
                  onChange={(e) => setCustomerFormData({...customerFormData, phone: e.target.value})}
                  disabled={customerModalMode === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <textarea
                  placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                  value={customerFormData.address}
                  onChange={(e) => setCustomerFormData({...customerFormData, address: e.target.value})}
                  rows="3"
                  disabled={customerModalMode === 'view'}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowCustomerModal(false)}
                >
                  {customerModalMode === 'view' ? 'Đóng' : 'Hủy'}
                </button>
                {customerModalMode !== 'view' && (
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={savingCustomer}
                  >
                    {savingCustomer ? '⏳ Đang lưu...' : (customerModalMode === 'add' ? '✅ Thêm khách hàng' : '💾 Lưu thay đổi')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;

