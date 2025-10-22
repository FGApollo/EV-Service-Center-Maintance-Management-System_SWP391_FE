import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - trong thực tế sẽ lấy từ API
  const stats = {
    totalUsers: 1234,
    totalBookings: 456,
    totalRevenue: 125000000,
    activeServices: 24,
    pendingBookings: 12,
    completedBookings: 438,
    cancelledBookings: 6,
    todayBookings: 8
  };

  const recentBookings = [
    { id: 1, customerName: 'Nguyễn Văn A', service: 'Bảo dưỡng định kỳ', date: '2025-10-15', time: '09:00', status: 'pending', phone: '0909123456' },
    { id: 2, customerName: 'Trần Thị B', service: 'Sửa chữa động cơ', date: '2025-10-15', time: '10:30', status: 'confirmed', phone: '0908765432' },
    { id: 3, customerName: 'Lê Văn C', service: 'Thay lốp xe', date: '2025-10-15', time: '14:00', status: 'completed', phone: '0912345678' },
    { id: 4, customerName: 'Phạm Thị D', service: 'Điều hòa & Làm mát', date: '2025-10-16', time: '08:00', status: 'pending', phone: '0987654321' },
    { id: 5, customerName: 'Hoàng Văn E', service: 'Chăm sóc ngoại thất', date: '2025-10-16', time: '11:00', status: 'confirmed', phone: '0901234567' },
  ];

  const recentUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0909123456', joinDate: '2025-09-15', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0908765432', joinDate: '2025-09-20', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0912345678', joinDate: '2025-10-01', status: 'active' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0987654321', joinDate: '2025-10-05', status: 'inactive' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0901234567', joinDate: '2025-10-10', status: 'active' },
  ];

  const services = [
    { id: 1, name: 'Bảo dưỡng định kỳ', price: '500,000 - 1,500,000', duration: '1-2 giờ', status: 'active', bookings: 145 },
    { id: 2, name: 'Sửa chữa động cơ', price: '2,000,000 - 10,000,000', duration: '2-4 giờ', status: 'active', bookings: 87 },
    { id: 3, name: 'Hệ thống phanh & lốp', price: '800,000 - 3,000,000', duration: '1-3 giờ', status: 'active', bookings: 112 },
    { id: 4, name: 'Hệ thống điện', price: '600,000 - 2,500,000', duration: '1-2 giờ', status: 'active', bookings: 76 },
    { id: 5, name: 'Điều hòa & làm mát', price: '700,000 - 2,000,000', duration: '1-2 giờ', status: 'active', bookings: 98 },
    { id: 6, name: 'Chăm sóc ngoại thất', price: '300,000 - 1,500,000', duration: '1-3 giờ', status: 'active', bookings: 203 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xác nhận', class: 'status-pending' },
      confirmed: { text: 'Đã xác nhận', class: 'status-confirmed' },
      completed: { text: 'Hoàn thành', class: 'status-completed' },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled' },
      active: { text: 'Hoạt động', class: 'status-active' },
      inactive: { text: 'Không hoạt động', class: 'status-inactive' }
    };
    
    const statusInfo = statusMap[status] || { text: status, class: '' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <h2>Tổng Quan</h2>
        <p>Dashboard quản lý hệ thống CarCare</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Tổng người dùng</p>
          </div>
          <div className="stat-change positive">+12%</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,10H7V17H9V10M13,10H11V17H13V10M17,10H15V17H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.totalBookings.toLocaleString()}</h3>
            <p>Tổng đặt lịch</p>
          </div>
          <div className="stat-change positive">+8%</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Tổng doanh thu</p>
          </div>
          <div className="stat-change positive">+15%</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{stats.activeServices}</h3>
            <p>Dịch vụ đang hoạt động</p>
          </div>
          <div className="stat-change neutral">0%</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Thống kê đặt lịch</h3>
          <div className="booking-stats">
            <div className="booking-stat-item">
              <div className="booking-stat-label">
                <span className="dot pending"></span>
                Chờ xác nhận
              </div>
              <div className="booking-stat-value">{stats.pendingBookings}</div>
            </div>
            <div className="booking-stat-item">
              <div className="booking-stat-label">
                <span className="dot confirmed"></span>
                Đã xác nhận
              </div>
              <div className="booking-stat-value">{stats.todayBookings}</div>
            </div>
            <div className="booking-stat-item">
              <div className="booking-stat-label">
                <span className="dot completed"></span>
                Hoàn thành
              </div>
              <div className="booking-stat-value">{stats.completedBookings}</div>
            </div>
            <div className="booking-stat-item">
              <div className="booking-stat-label">
                <span className="dot cancelled"></span>
                Đã hủy
              </div>
              <div className="booking-stat-value">{stats.cancelledBookings}</div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Hoạt động gần đây</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon blue">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <div className="activity-info">
                <p><strong>Người dùng mới đăng ký:</strong> Hoàng Văn E</p>
                <span className="activity-time">5 phút trước</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon green">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,10H7V17H9V10M13,10H11V17H13V10M17,10H15V17H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                </svg>
              </div>
              <div className="activity-info">
                <p><strong>Đặt lịch mới:</strong> Lê Văn C - Thay lốp xe</p>
                <span className="activity-time">15 phút trước</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon purple">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
              </div>
              <div className="activity-info">
                <p><strong>Hoàn thành dịch vụ:</strong> Bảo dưỡng định kỳ</p>
                <span className="activity-time">30 phút trước</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon orange">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                </svg>
              </div>
              <div className="activity-info">
                <p><strong>Cập nhật dịch vụ:</strong> Điều hòa & làm mát</p>
                <span className="activity-time">1 giờ trước</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="table-card">
        <div className="table-header">
          <h3>Đặt lịch gần đây</h3>
          <button className="btn-view-all" onClick={() => setActiveTab('bookings')}>
            Xem tất cả
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.slice(0, 5).map(booking => (
                <tr key={booking.id}>
                  <td>
                    <div className="customer-info">
                      <strong>{booking.customerName}</strong>
                      <span>{booking.phone}</span>
                    </div>
                  </td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Xem chi tiết">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      </button>
                      <button className="btn-icon" title="Chỉnh sửa">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <h2>Quản Lý Đặt Lịch</h2>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Thêm lịch hẹn
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          <input type="text" placeholder="Tìm kiếm theo tên, số điện thoại..." />
        </div>
        <div className="filter-buttons">
          <select className="filter-select">
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select className="filter-select">
            <option value="all">Tất cả dịch vụ</option>
            <option value="maintenance">Bảo dưỡng định kỳ</option>
            <option value="engine">Sửa chữa động cơ</option>
            <option value="brake">Hệ thống phanh & lốp</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>#{booking.id}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{booking.customerName}</strong>
                      <span>{booking.phone}</span>
                    </div>
                  </td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Xem chi tiết">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      </button>
                      <button className="btn-icon" title="Chỉnh sửa">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                        </svg>
                      </button>
                      <button className="btn-icon delete" title="Xóa">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <h2>Quản Lý Người Dùng</h2>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Thêm người dùng
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          <input type="text" placeholder="Tìm kiếm người dùng..." />
        </div>
        <div className="filter-buttons">
          <select className="filter-select">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>#{user.id}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.joinDate}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Xem chi tiết">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      </button>
                      <button className="btn-icon" title="Chỉnh sửa">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                        </svg>
                      </button>
                      <button className="btn-icon delete" title="Xóa">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="dashboard-content">
      <div className="page-header">
        <h2>Quản Lý Dịch Vụ</h2>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Thêm dịch vụ
        </button>
      </div>

      <div className="services-grid-admin">
        {services.map(service => (
          <div key={service.id} className="service-card-admin">
            <div className="service-card-header">
              <h3>{service.name}</h3>
              {getStatusBadge(service.status)}
            </div>
            <div className="service-card-body">
              <div className="service-detail">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                </svg>
                <span>{service.price} VNĐ</span>
              </div>
              <div className="service-detail">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                </svg>
                <span>{service.duration}</span>
              </div>
              <div className="service-detail">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,10H7V17H9V10M13,10H11V17H13V10M17,10H15V17H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                </svg>
                <span>{service.bookings} lượt đặt</span>
              </div>
            </div>
            <div className="service-card-footer">
              <button className="btn-edit">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                </svg>
                Chỉnh sửa
              </button>
              <button className="btn-delete">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'bookings':
        return renderBookings();
      case 'users':
        return renderUsers();
      case 'services':
        return renderServices();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h1>CarCare</h1>
          <span>Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"/>
            </svg>
            <span>Tổng quan</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,10H7V17H9V10M13,10H11V17H13V10M17,10H15V17H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
            </svg>
            <span>Đặt lịch</span>
            {stats.pendingBookings > 0 && (
              <span className="badge">{stats.pendingBookings}</span>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
            </svg>
            <span>Người dùng</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
            <span>Dịch vụ</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
            <span>Về trang chủ</span>
          </button>
          <button className="nav-item logout">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>

        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
          </svg>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
              </svg>
            </button>
            <h2>Dashboard</h2>
          </div>
          <div className="header-right">
            <button className="header-icon-btn" title="Thông báo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <div className="admin-profile">
              <div className="profile-avatar">AD</div>
              <div className="profile-info">
                <strong>Admin</strong>
                <span>admin@carcare.com</span>
              </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;


