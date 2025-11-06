import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { 
  FaUser, FaCar, FaComments, FaSearch, FaPlus, FaHistory, FaClock, 
  FaPhone, FaEnvelope, FaCalendarAlt, FaTools, FaCheckCircle, FaTimes, 
  FaEdit, FaUsers, FaMoneyBillWave, FaChartLine, FaChartBar, FaCertificate,
  FaWarehouse, FaRobot, FaClipboardCheck, FaReceipt, FaCreditCard, 
  FaFileInvoiceDollar, FaCalendarWeek, FaUserTie, FaBriefcase
} from 'react-icons/fa';
import * as API from '../api/index.js';

function AdminDashboard({ onNavigate }) {
  console.log('AdminDashboard component loaded!', { onNavigate });
  
  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để truy cập trang này!');
      onNavigate && onNavigate('login');
    }
  }, [onNavigate]);
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
    totalRevenue: 0,
    revenueData: {},
    profitData: {},
    trendingServices: [],
    trendingServicesLastMonth: [],
    trendingParts: [],
    activeTechnicians: 0
  });
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Customers & Cars Data
  const [customers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      joinDate: '2024-01-15',
      cars: [
        {
          id: 1,
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          vin: 'WBA3B5C50DF123456',
          licensePlate: '29A-12345',
          color: 'Đỏ',
          serviceHistory: [
            { date: '2024-09-15', service: 'Bảo dưỡng định kỳ', cost: 2500000, status: 'Hoàn thành' },
            { date: '2024-07-10', service: 'Thay lốp xe', cost: 8000000, status: 'Hoàn thành' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      joinDate: '2024-02-20',
      cars: [
        {
          id: 2,
          brand: 'VinFast',
          model: 'VF e34',
          year: 2023,
          vin: 'VF8A1B2C3D4E56789',
          licensePlate: '30B-67890',
          color: 'Trắng',
          serviceHistory: [
            { date: '2024-10-01', service: 'Kiểm tra hệ thống điện', cost: 1500000, status: 'Hoàn thành' }
          ]
        }
      ]
    }
  ]);

  // useEffect: Load danh sách xe và khách hàng khi component mount
  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
    if (activeTab === 'overview') {
      fetchOverviewData();
    }
  }, [activeTab]);

  // ========== FETCH OVERVIEW DATA ==========
  const fetchOverviewData = async () => {
    try {
      setLoadingOverview(true);
      setError(null);
      console.log('🔄 Loading overview data...');

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
        API.getTop5PartsUsed().catch(err => { console.error('Error parts:', err); return []; }),
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

      // Count appointments by status
      const pending = appointmentsData.filter(a => a.status === 'PENDING').length;
      const inProgress = appointmentsData.filter(a => a.status === 'IN_PROGRESS').length;
      const completed = appointmentsData.filter(a => a.status === 'DONE').length;

      // Calculate total revenue
      const totalRevenue = Object.values(revenueData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

      setOverviewStats({
        totalCustomers: customersData.length,
        totalVehicles: vehiclesData.length,
        totalAppointments: appointmentsData.length,
        pendingAppointments: pending,
        inProgressAppointments: inProgress,
        completedAppointments: completed,
        totalRevenue: totalRevenue,
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

  // Hàm fetch danh sách khách hàng từ API
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const data = await API.getAllCustomers();
      setAllCustomers(data);
      console.log('✅ Loaded customers:', data);
    } catch (err) {
      console.error('❌ Error loading customers:', err);
      // Fallback: dùng data mẫu nếu API lỗi (không bao gồm cars)
      const customersWithoutCars = customers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        joinDate: c.joinDate
      }));
      setAllCustomers(customersWithoutCars);
      console.log('⚠️ Using mock customer data:', customersWithoutCars);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Hàm fetch danh sách xe từ API (kèm thông tin chủ xe)
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy tất cả xe đã bảo dưỡng
      const data = await API.getVehiclesMaintained();
      setVehicles(data);
      console.log('✅ Loaded vehicles with owners:', data);
    } catch (err) {
      console.error('❌ Error loading vehicles:', err);
      
      // Fallback: Lấy xe từ mock data customers
      const mockVehicles = customers.flatMap(customer => 
        customer.cars.map(car => ({
          id: car.id,
          vin: car.vin,
          model: `${car.brand} ${car.model}`,
          year: car.year,
          color: car.color,
          licensePlate: car.licensePlate,
          owner: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          },
          serviceHistory: car.serviceHistory
        }))
      );
      
      setVehicles(mockVehicles);
      console.log('⚠️ Using mock vehicle data:', mockVehicles);
      setError(null); // Không hiển thị lỗi vì đã có fallback data
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

  // Appointments Data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      phone: '0123456789',
      carInfo: 'Tesla Model 3 - 29A-12345',
      service: 'Bảo dưỡng định kỳ',
      date: '2025-10-20',
      time: '09:00',
      status: 'pending',
      technician: null,
      notes: 'Khách hàng yêu cầu kiểm tra hệ thống phanh'
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      phone: '0987654321',
      carInfo: 'VinFast VF e34 - 30B-67890',
      service: 'Thay lốp xe',
      date: '2025-10-20',
      time: '10:30',
      status: 'confirmed',
      technician: 'Phạm Văn D',
      notes: 'Thay 4 lốp mới'
    }
  ]);

  // Maintenance Data
  const [maintenanceList, setMaintenanceList] = useState([
    {
      id: 1,
      ticketNumber: 'TK-001',
      customerName: 'Nguyễn Văn A',
      carInfo: 'Tesla Model 3 - 29A-12345',
      vin: 'WBA3B5C50DF123456',
      service: 'Bảo dưỡng định kỳ',
      status: 'waiting',
      startTime: '2025-10-17 09:00',
      estimatedTime: '2 giờ',
      technician: 'Phạm Văn D',
      checklist: [
        { item: 'Kiểm tra pin', status: 'completed' },
        { item: 'Kiểm tra phanh', status: 'completed' },
        { item: 'Kiểm tra lốp xe', status: 'in-progress' },
        { item: 'Kiểm tra hệ thống điện', status: 'pending' }
      ],
      carCondition: {
        exterior: 'Tốt - Không có vết xước',
        interior: 'Sạch sẽ',
        battery: '95% - Tình trạng tốt',
        tire: 'Lốp trước: 70%, Lốp sau: 75%',
        notes: 'Xe trong tình trạng tốt'
      }
    }
  ]);

  // Parts Inventory Data
  const [partsList] = useState([
    {
      id: 'PT-001',
      name: 'Pin Lithium-ion 75kWh',
      category: 'Pin & Điện',
      brand: 'Tesla',
      stock: 5,
      minStock: 2,
      price: 250000000,
      status: 'in-stock',
      aiRecommendation: { suggestedMinStock: 3, reason: 'Dựa trên lịch sử thay thế, tần suất sử dụng cao' }
    },
    {
      id: 'PT-002',
      name: 'Phanh đĩa thông gió trước',
      category: 'Phanh',
      brand: 'Brembo',
      stock: 1,
      minStock: 3,
      price: 8500000,
      status: 'low-stock',
      aiRecommendation: { suggestedMinStock: 5, reason: 'Phụ tùng thay thế thường xuyên, cần tăng dự trữ' }
    }
  ]);

  // Staff Management Data
  const [staffList] = useState([
    {
      id: 1,
      name: 'Phạm Văn D',
      role: 'Technician',
      email: 'phamvand@service.com',
      phone: '0901234567',
      shift: 'Ca sáng (8:00-16:00)',
      performance: { completedJobs: 45, avgTime: '2.5h', rating: 4.8 },
      certificates: ['EV Technician Level 2', 'Battery Safety Certified'],
      workingHours: { thisWeek: 40, thisMonth: 160 }
    },
    {
      id: 2,
      name: 'Nguyễn Văn E',
      role: 'Technician',
      email: 'nguyenvane@service.com',
      phone: '0912345678',
      shift: 'Ca chiều (14:00-22:00)',
      performance: { completedJobs: 38, avgTime: '2.8h', rating: 4.6 },
      certificates: ['EV Technician Level 1'],
      workingHours: { thisWeek: 38, thisMonth: 152 }
    },
    {
      id: 3,
      name: 'Trần Văn G',
      role: 'Staff',
      email: 'tranvang@service.com',
      phone: '0923456789',
      shift: 'Ca sáng (8:00-16:00)',
      performance: { completedJobs: 52, avgTime: '2.2h', rating: 4.9 },
      certificates: ['Customer Service Certified'],
      workingHours: { thisWeek: 42, thisMonth: 168 }
    }
  ]);

  // Financial Data
  const [financialData] = useState({
    revenue: {
      today: 15000000,
      thisWeek: 85000000,
      thisMonth: 320000000,
      thisYear: 1250000000
    },
    expenses: {
      thisMonth: 180000000,
      thisYear: 720000000
    },
    profit: {
      thisMonth: 140000000,
      thisYear: 530000000
    },
    serviceStats: [
      { service: 'Bảo dưỡng định kỳ', count: 145, revenue: 362500000 },
      { service: 'Thay lốp xe', count: 89, revenue: 712000000 },
      { service: 'Sửa chữa động cơ', count: 67, revenue: 335000000 },
      { service: 'Kiểm tra hệ thống điện', count: 123, revenue: 184500000 }
    ],
    paymentMethods: {
      online: 65,
      offline: 35
    }
  });

  // Chat Data
  const [chatCustomers] = useState([
    { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Cảm ơn bạn!', time: '10:30', unread: 2 },
    { id: 2, name: 'Trần Thị B', lastMessage: 'Xe của tôi đã sẵn sàng chưa?', time: '09:15', unread: 0 }
  ]);
  const [activeChatCustomer, setActiveChatCustomer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Helper Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'waiting': return 'status-waiting';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'in-progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'waiting': return 'Đang chờ';
      default: return status;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && activeChatCustomer) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'admin',
        text: newMessage,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Test div - remove this later */}
      <div style={{ background: 'red', color: 'white', padding: '20px', textAlign: 'center' }}>
        Admin Dashboard đã load!
      </div>
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Quay lại
          </button>
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="admin-info">
            <div className="admin-avatar">
              <FaUser />
            </div>
            <div className="admin-details">
              <p className="admin-name">Quản trị viên</p>
              <p className="admin-role">Administrator</p>
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
                      {Object.keys(overviewStats.revenueData).length > 0 ? (
                        <div className="bar-chart">
                          {Object.entries(overviewStats.revenueData).map(([month, revenue]) => {
                            const maxRevenue = Math.max(...Object.values(overviewStats.revenueData));
                            const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                            return (
                              <div key={month} className="bar-item">
                                <div className="bar-wrapper">
                                  <div 
                                    className="bar" 
                                    style={{ height: `${height}%` }}
                                    title={formatCurrency(revenue)}
                                  ></div>
                                </div>
                                <div className="bar-label">{month}</div>
                                <div className="bar-value">{formatCurrency(revenue)}</div>
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
                      {Object.keys(overviewStats.profitData).length > 0 ? (
                        <div className="bar-chart">
                          {Object.entries(overviewStats.profitData).map(([month, profit]) => {
                            const maxProfit = Math.max(...Object.values(overviewStats.profitData));
                            const height = maxProfit > 0 ? (profit / maxProfit) * 100 : 0;
                            return (
                              <div key={month} className="bar-item">
                                <div className="bar-wrapper">
                                  <div 
                                    className="bar bar-profit" 
                                    style={{ height: `${height}%` }}
                                    title={formatCurrency(profit)}
                                  ></div>
                                </div>
                                <div className="bar-label">{month}</div>
                                <div className="bar-value">{formatCurrency(profit)}</div>
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
                              const [serviceName, count] = Array.isArray(item) ? item : [item.key, item.value];
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
                              const [serviceName, count] = Array.isArray(item) ? item : [item.key, item.value];
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
                      <h3><FaWarehouse /> Top 5 Linh kiện (Tháng trước)</h3>
                    </div>
                    <div className="card-body">
                      {overviewStats.trendingParts && Object.keys(overviewStats.trendingParts).length > 0 ? (
                        <table className="trending-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Linh kiện</th>
                              <th>Số lượng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(overviewStats.trendingParts).slice(0, 5).map(([partName, quantity], index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{partName}</td>
                                <td className="count-badge">{quantity}</td>
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
                  placeholder="Tìm kiếm khách hàng (tên, email, SĐT, VIN)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="add-btn">
                <FaPlus />
                Thêm khách hàng
              </button>
            </div>

            <div className="customers-grid">
              {customers.map(customer => (
                <div key={customer.id} className="customer-card">
                  <div className="customer-header">
                    <div className="customer-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h3>{customer.name}</h3>
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
                    <div className="info-row">
                      <FaCalendarAlt />
                      <span>Tham gia: {new Date(customer.joinDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                          
                          // Tìm lịch sử từ data mẫu (tạm thời)
                          const carDetail = customers.find(c => 
                            c.cars.some(car => car.vin === vehicle.vin || car.id === vehicle.id)
                          )?.cars.find(car => car.vin === vehicle.vin || car.id === vehicle.id);
                          
                          return (
                            <tr key={vehicle.id}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="vehicle-info">
                                  <strong>{vehicle.model}</strong>
                                  {owner && <p className="owner-name">👤 {owner.name || owner.username}</p>}
                                </div>
                              </td>
                              <td><code>{vehicle.vin}</code></td>
                              <td><span className="badge">{vehicle.licensePlate}</span></td>
                              <td>{vehicle.year}</td>
                              <td>{vehicle.color}</td>
                              <td>
                                {carDetail?.serviceHistory ? (
                                  <div className="service-history">
                                    <span className="history-count">
                                      {carDetail.serviceHistory.length} lần bảo trì
                                    </span>
                                    {carDetail.serviceHistory.length > 0 && (
                                      <button 
                                        className="btn-sm btn-history" 
                                        title="Xem lịch sử"
                                        onClick={() => alert(`Lịch sử:\n${carDetail.serviceHistory.map(h => `- ${h.date}: ${h.service} (${formatCurrency(h.cost)})`).join('\n')}`)}
                                      >
                                        <FaHistory /> Chi tiết
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="no-history">Chưa có lịch sử</span>
                                )}
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
                  <h4>{appointments.filter(a => a.status === 'pending').length}</h4>
                  <p>Chờ xác nhận</p>
                </div>
              </div>
              <div className="stat-card confirmed">
                <FaCheckCircle />
                <div>
                  <h4>{appointments.filter(a => a.status === 'confirmed').length}</h4>
                  <p>Đã xác nhận</p>
                </div>
              </div>
              <div className="stat-card in-progress">
                <FaTools />
                <div>
                  <h4>{appointments.filter(a => a.status === 'in-progress').length}</h4>
                  <p>Đang thực hiện</p>
                </div>
              </div>
              <div className="stat-card completed">
                <FaCheckCircle />
                <div>
                  <h4>{appointments.filter(a => a.status === 'completed').length}</h4>
                  <p>Hoàn thành</p>
                </div>
              </div>
            </div>

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
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>#{apt.id}</td>
                      <td>{apt.customerName}</td>
                      <td>{apt.carInfo}</td>
                      <td>{apt.service}</td>
                      <td>{apt.date} {apt.time}</td>
                      <td>{apt.technician || 'Chưa phân công'}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(apt.status)}`}>
                          {getStatusText(apt.status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-small">
                          <button className="btn-edit"><FaEdit /></button>
                          <button className="btn-assign"><FaUserTie /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  {partsList.map(part => (
                    <tr key={part.id}>
                      <td>{part.id}</td>
                      <td>{part.name}</td>
                      <td>{part.category}</td>
                      <td>{part.stock}</td>
                      <td>{part.minStock}</td>
                      <td>
                        <div className="ai-recommendation">
                          <FaRobot />
                          <div>
                            <strong>{part.aiRecommendation.suggestedMinStock}</strong>
                            <p>{part.aiRecommendation.reason}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`stock-badge ${part.status}`}>
                          {part.status === 'in-stock' ? 'Còn hàng' : 
                           part.status === 'low-stock' ? 'Sắp hết' : 'Hết hàng'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit"><FaEdit /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          </div>
        )}

        {/* Finance & Reports Tab */}
        {activeTab === 'finance' && (
          <div className="finance-section">
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
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="chat-section">
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
                          className={`message ${message.sender === 'admin' ? 'sent' : 'received'}`}
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
                        {customer.name || customer.username} ({customer.email})
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
                  <strong>👤 Chủ xe:</strong> {selectedVehicle.owner.name || selectedVehicle.owner.username}
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
    </div>
  );
}

export default AdminDashboard;

