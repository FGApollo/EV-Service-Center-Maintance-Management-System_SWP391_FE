import React, { useEffect } from 'react';
import { 
  FaUsers, FaUserTie, FaUserCog, FaWrench, 
  FaCar, FaCalendarAlt, FaClock, FaCheckCircle,
  FaMoneyBillWave, FaChartLine, FaWarehouse
} from 'react-icons/fa';
import { useOverview } from '../../hooks/useOverview';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

export const OverviewTab = () => {
  const { overviewData, loading, error, fetchOverviewData } = useOverview();

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  if (loading) {
    return (
      <div className="overview-section" style={{padding: '40px', textAlign: 'center'}}>
        <p>⏳ Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-section" style={{padding: '40px', textAlign: 'center', color: '#ef4444'}}>
        <p>❌ Lỗi: {error}</p>
        <button onClick={fetchOverviewData} style={{marginTop: '16px', padding: '8px 16px', cursor: 'pointer'}}>
          🔄 Thử lại
        </button>
      </div>
    );
  }

  const stats = [
    // Users
    { 
      icon: FaUsers, 
      label: 'Tổng người dùng', 
      value: overviewData.totalUsers, 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      icon: FaUserTie, 
      label: 'Quản lý', 
      value: overviewData.totalManagers, 
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      icon: FaUserCog, 
      label: 'Nhân viên', 
      value: overviewData.totalStaff, 
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      icon: FaWrench, 
      label: 'Kỹ thuật viên', 
      value: overviewData.totalTechnicians, 
      color: '#43e97b',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    
    // Business
    { 
      icon: FaCar, 
      label: 'Tổng số xe', 
      value: overviewData.totalVehicles, 
      color: '#fa709a',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      icon: FaCalendarAlt, 
      label: 'Tổng lịch hẹn', 
      value: overviewData.totalAppointments, 
      color: '#30cfd0',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    { 
      icon: FaClock, 
      label: 'Đang chờ', 
      value: overviewData.pendingAppointments, 
      color: '#f8b500',
      gradient: 'linear-gradient(135deg, #f8b500 0%, #fceabb 100%)'
    },
    { 
      icon: FaCheckCircle, 
      label: 'Hoàn thành', 
      value: overviewData.completedAppointments, 
      color: '#11998e',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },

    // Finance
    { 
      icon: FaMoneyBillWave, 
      label: 'Doanh thu tháng này', 
      value: formatCurrency(overviewData.revenue?.thisMonth || 0), 
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      isLarge: true
    },
    { 
      icon: FaChartLine, 
      label: 'Lợi nhuận tháng này', 
      value: formatCurrency(overviewData.profit?.thisMonth || 0), 
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      isLarge: true
    }
  ];

  return (
    <div className="overview-section">
      <div className="section-header" style={{marginBottom: '24px'}}>
        <h2>Tổng quan hệ thống</h2>
        <p style={{color: '#666', marginTop: '8px'}}>Thống kê toàn bộ hệ thống quản lý trung tâm bảo dưỡng EV</p>
      </div>

      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="stat-card" 
              style={{
                background: stat.gradient,
                color: 'white',
                padding: stat.isLarge ? '32px 24px' : '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <Icon size={stat.isLarge ? 48 : 40} style={{opacity: 0.9}} />
                <div>
                  <h3 style={{
                    margin: 0, 
                    fontSize: stat.isLarge ? '32px' : '28px', 
                    fontWeight: 'bold'
                  }}>
                    {stat.value}
                  </h3>
                  <p style={{margin: '4px 0 0', opacity: 0.9, fontSize: '14px'}}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Comparison */}
      {overviewData.revenue?.percentChange !== 0 && (
        <div className="revenue-comparison" style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{marginTop: 0, marginBottom: '16px'}}>So sánh doanh thu</h3>
          <div style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
            <div>
              <p style={{color: '#666', marginBottom: '4px'}}>Tháng trước</p>
              <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0}}>
                {formatCurrency(overviewData.revenue?.lastMonth || 0)}
              </p>
            </div>
            <div style={{fontSize: '32px', color: '#666'}}>→</div>
            <div>
              <p style={{color: '#666', marginBottom: '4px'}}>Tháng này</p>
              <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#667eea'}}>
                {formatCurrency(overviewData.revenue?.thisMonth || 0)}
              </p>
            </div>
            <div style={{
              marginLeft: 'auto',
              padding: '12px 24px',
              background: overviewData.revenue?.percentChange > 0 ? '#d1fae5' : '#fee2e2',
              color: overviewData.revenue?.percentChange > 0 ? '#065f46' : '#991b1b',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>
              {overviewData.revenue?.percentChange > 0 ? '↗' : '↘'} {Math.abs(overviewData.revenue?.percentChange || 0)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
