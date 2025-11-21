import React from 'react';
import { 
  FaUsers, FaUserTie, FaUserCog, FaWrench, 
  FaCar, FaCalendarAlt, FaClock, FaCheckCircle,
  FaMoneyBillWave, FaChartLine
} from 'react-icons/fa';
import './OverviewStats.css';

export const OverviewStats = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  const stats = [
    // Row 1: Users
    { 
      icon: FaUsers, 
      label: 'Tổng người dùng', 
      value: data.totalUsers || 0,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      category: 'users'
    },
    { 
      icon: FaUserTie, 
      label: 'Quản lý', 
      value: data.totalManagers || 0,
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      category: 'users'
    },
    { 
      icon: FaUserCog, 
      label: 'Nhân viên', 
      value: data.totalStaff || 0,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      category: 'users'
    },
    { 
      icon: FaWrench, 
      label: 'Kỹ thuật viên', 
      value: data.totalTechnicians || 0,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      category: 'users'
    },
    
    // Row 2: Business
    { 
      icon: FaCar, 
      label: 'Tổng số xe', 
      value: data.totalVehicles || 0,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      category: 'business'
    },
    { 
      icon: FaCalendarAlt, 
      label: 'Tổng lịch hẹn', 
      value: data.totalAppointments || 0,
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      category: 'business'
    },
    { 
      icon: FaClock, 
      label: 'Đang chờ', 
      value: data.pendingAppointments || 0,
      gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
      category: 'business'
    },
    { 
      icon: FaCheckCircle, 
      label: 'Hoàn thành', 
      value: data.completedAppointments || 0,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      category: 'business'
    },

    // Row 3: Finance (larger cards)
    { 
      icon: FaMoneyBillWave, 
      label: 'Doanh thu tháng này', 
      value: `${formatCurrency(data.revenue?.thisMonth || 0)} ₫`,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      category: 'finance',
      isLarge: true
    },
    { 
      icon: FaChartLine, 
      label: 'Lợi nhuận tháng này', 
      value: `${formatCurrency(data.profit?.thisMonth || 0)} ₫`,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      category: 'finance',
      isLarge: true
    }
  ];

  return (
    <div className="overview-stats-container">
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`overview-stat-card ${stat.category} ${stat.isLarge ? 'large' : ''}`}
            >
              <div className="stat-icon" style={{ background: stat.gradient }}>
                <Icon />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

