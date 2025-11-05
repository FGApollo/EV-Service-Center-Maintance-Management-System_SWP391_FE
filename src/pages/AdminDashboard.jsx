import React, { useState } from 'react';
import './AdminDashboard.css';
import { 
  FaUser, FaCar, FaComments, FaSearch, FaPlus, FaHistory, FaClock, 
  FaPhone, FaEnvelope, FaCalendarAlt, FaTools, FaCheckCircle, FaTimes, 
  FaEdit, FaUsers, FaMoneyBillWave, FaChartLine, FaChartBar, FaCertificate,
  FaWarehouse, FaRobot, FaClipboardCheck, FaReceipt, FaCreditCard, 
  FaFileInvoiceDollar, FaCalendarWeek, FaUserTie, FaBriefcase
} from 'react-icons/fa';

function AdminDashboard({ onNavigate }) {
  console.log('AdminDashboard component loaded!', { onNavigate });
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Overview Stats
  const [stats] = useState({
    totalCustomers: 156,
    totalCars: 203,
    pendingAppointments: 12,
    inProgressServices: 8,
    completedToday: 24,
    totalRevenue: 1250000000,
    lowStockParts: 5,
    activeTechnicians: 12
  });

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
          Khách hàng & Xe
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
            <div className="stats-grid">
              <div className="stat-card revenue">
                <div className="stat-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="stat-info">
                  <h3>{formatCurrency(stats.totalRevenue)}</h3>
                  <p>Tổng doanh thu</p>
                </div>
              </div>
              <div className="stat-card customers">
                <div className="stat-icon">
                  <FaUser />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalCustomers}</h3>
                  <p>Khách hàng</p>
                </div>
              </div>
              <div className="stat-card cars">
                <div className="stat-icon">
                  <FaCar />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalCars}</h3>
                  <p>Xe đã đăng ký</p>
                </div>
              </div>
              <div className="stat-card pending">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-info">
                  <h3>{stats.pendingAppointments}</h3>
                  <p>Lịch hẹn chờ xử lý</p>
                </div>
              </div>
              <div className="stat-card in-progress">
                <div className="stat-icon">
                  <FaTools />
                </div>
                <div className="stat-info">
                  <h3>{stats.inProgressServices}</h3>
                  <p>Đang bảo dưỡng</p>
                </div>
              </div>
              <div className="stat-card completed">
                <div className="stat-icon">
                  <FaCheckCircle />
                </div>
                <div className="stat-info">
                  <h3>{stats.completedToday}</h3>
                  <p>Hoàn thành hôm nay</p>
                </div>
              </div>
              <div className="stat-card low-stock">
                <div className="stat-icon">
                  <FaWarehouse />
                </div>
                <div className="stat-info">
                  <h3>{stats.lowStockParts}</h3>
                  <p>Phụ tùng sắp hết</p>
                </div>
              </div>
              <div className="stat-card staff">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <h3>{stats.activeTechnicians}</h3>
                  <p>Kỹ thuật viên đang làm việc</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Doanh thu theo tháng</h3>
                <div className="chart-placeholder">
                  <FaChartBar size={60} />
                  <p>Biểu đồ doanh thu</p>
                </div>
              </div>
              <div className="chart-card">
                <h3>Dịch vụ phổ biến</h3>
                <div className="service-list">
                  {financialData.serviceStats.slice(0, 5).map((service, index) => (
                    <div key={index} className="service-item">
                      <span>{service.service}</span>
                      <span className="service-count">{service.count} lượt</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

                  <div className="customer-cars">
                    <h4>Xe đã đăng ký ({customer.cars.length})</h4>
                    {customer.cars.map(car => (
                      <div key={car.id} className="car-item">
                        <div className="car-icon">
                          <FaCar />
                        </div>
                        <div className="car-details">
                          <strong>{car.brand} {car.model} ({car.year})</strong>
                          <p>Biển số: {car.licensePlate}</p>
                          <p>VIN: {car.vin}</p>
                          <p>Lịch sử: {car.serviceHistory.length} dịch vụ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
    </div>
  );
}

export default AdminDashboard;

