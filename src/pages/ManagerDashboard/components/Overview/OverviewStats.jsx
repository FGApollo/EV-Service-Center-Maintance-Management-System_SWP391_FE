import React from 'react';
import { 
  FaMoneyBillWave, 
  FaUser, 
  FaCar, 
  FaCalendarAlt, 
  FaClock, 
  FaTools, 
  FaTimes, 
  FaCheckCircle, 
  FaUsers 
} from 'react-icons/fa';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

export const OverviewStats = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card revenue">
        <div className="stat-icon">
          <FaMoneyBillWave />
        </div>
        <div className="stat-info">
          <h3>{formatCurrency(stats.totalRevenue)}</h3>
          <p>Tổng doanh thu</p>
          <span className="stat-trend positive">↑ Real-time</span>
        </div>
      </div>
      
      <div className="stat-card customers">
        <div className="stat-icon">
          <FaUser />
        </div>
        <div className="stat-info">
          <h3>{stats.totalCustomers}</h3>
          <p>Khách hàng</p>
          <span className="stat-detail">Tổng số đăng ký</span>
        </div>
      </div>
      
      <div className="stat-card cars">
        <div className="stat-icon">
          <FaCar />
        </div>
        <div className="stat-info">
          <h3>{stats.totalVehicles}</h3>
          <p>Xe đã bảo dưỡng</p>
          <span className="stat-detail">Đang quản lý</span>
        </div>
      </div>
      
      <div className="stat-card appointments">
        <div className="stat-icon">
          <FaCalendarAlt />
        </div>
        <div className="stat-info">
          <h3>{stats.totalAppointments}</h3>
          <p>Tổng lịch hẹn</p>
          <span className="stat-detail">Tất cả thời gian</span>
        </div>
      </div>
      
      <div className="stat-card pending">
        <div className="stat-icon">
          <FaClock />
        </div>
        <div className="stat-info">
          <h3>{stats.pendingAppointments}</h3>
          <p>Chờ xử lý</p>
          <span className="stat-detail status-pending">Cần xác nhận</span>
        </div>
      </div>
      
      <div className="stat-card in-progress">
        <div className="stat-icon">
          <FaTools />
        </div>
        <div className="stat-info">
          <h3>{stats.inProgressAppointments}</h3>
          <p>Đang bảo dưỡng</p>
          <span className="stat-detail status-progress">Đang làm việc</span>
        </div>
      </div>
      
      <div className="stat-card cancelled">
        <div className="stat-icon">
          <FaTimes />
        </div>
        <div className="stat-info">
          <h3>{stats.cancelledAppointments}</h3>
          <p>Đã hủy</p>
          <span className="stat-detail status-cancelled">Không thực hiện</span>
        </div>
      </div>
      
      <div className="stat-card completed">
        <div className="stat-icon">
          <FaCheckCircle />
        </div>
        <div className="stat-info">
          <h3>{stats.completedAppointments}</h3>
          <p>Đã hoàn thành</p>
          <span className="stat-detail status-done">Thành công</span>
        </div>
      </div>
      
      <div className="stat-card staff">
        <div className="stat-icon">
          <FaUsers />
        </div>
        <div className="stat-info">
          <h3>{stats.activeTechnicians}</h3>
          <p>Kỹ thuật viên</p>
          <span className="stat-detail">Đang hoạt động</span>
        </div>
      </div>
    </div>
  );
};
