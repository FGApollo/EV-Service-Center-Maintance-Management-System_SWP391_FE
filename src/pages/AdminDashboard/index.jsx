import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { showWarning } from '../../utils/toast';
import { 
  FaChartLine, FaUsers, FaWarehouse, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import { getCurrentUser } from '../../utils/centerFilter';
import { ROLES } from '../../constants/roles';

// Import components
import { OverviewTab } from './components/Overview';
import { UsersTab } from './components/Users';
import { CentersTab } from './components/Centers';
import { PartsTab } from './components/Parts';

function AdminDashboard({ onNavigate }) {
  console.log('AdminDashboard component loaded!', { onNavigate });
  
  // Get current user
  const currentUser = getCurrentUser();
  const { role, fullName } = currentUser;
  
  // Check authentication & authorization
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showWarning('Bạn cần đăng nhập để truy cập trang này!');
      onNavigate && onNavigate('login');
      return;
    }
    
    // Only accept ADMIN role
    if (role?.toLowerCase() !== 'admin') {
      showWarning('Bạn không có quyền truy cập trang này! Trang này chỉ dành cho Administrator.');
      onNavigate && onNavigate('login');
      return;
    }
    
    console.log('✅ Admin authorized:', { role, fullName });
  }, [role, fullName, onNavigate]);

  const [activeTab, setActiveTab] = useState('overview');

  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('fullName');
      localStorage.removeItem('userId');
      localStorage.removeItem('centerId');
      onNavigate && onNavigate('login');
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: FaChartLine },
    { id: 'users', label: 'Quản lý người dùng', icon: FaUsers },
    { id: 'centers', label: 'Quản lý trung tâm', icon: FaWarehouse },
    { id: 'parts', label: 'Phụ tùng & Gói bảo dưỡng', icon: FaCog }
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UsersTab />;
      case 'centers':
        return <CentersTab />;
      case 'parts':
        return <PartsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>🔧 Admin Dashboard</h1>
          <p style={{color: 'rgba(255,255,255,0.9)', margin: '4px 0 0', fontSize: '14px'}}>
            Chào mừng, <strong>{fullName || 'Administrator'}</strong>
          </p>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="back-btn">
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
