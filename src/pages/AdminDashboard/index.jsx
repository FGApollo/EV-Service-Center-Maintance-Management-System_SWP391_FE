import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { 
  FaChartLine, FaUsers, FaWarehouse, FaTools, FaSignOutAlt
} from 'react-icons/fa';
import { getCurrentUser } from '../../utils/centerFilter';
import { ROLES } from '../../constants/roles';

// Import components
import { OverviewTab } from './components/Overview';
import { UsersTab } from './components/Users';
import { CentersTab } from './components/Centers';

function AdminDashboard({ onNavigate }) {
  console.log('AdminDashboard component loaded!', { onNavigate });
  
  // Get current user
  const currentUser = getCurrentUser();
  const { role, fullName } = currentUser;
  
  // Check authentication & authorization
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để truy cập trang này!');
      onNavigate && onNavigate('login');
      return;
    }
    
    // Only accept ADMIN role
    if (role?.toLowerCase() !== 'admin') {
      alert('Bạn không có quyền truy cập trang này! Trang này chỉ dành cho Administrator.');
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
    { id: 'centers', label: 'Trung tâm', icon: FaWarehouse },
    { id: 'maintenance', label: 'Quy trình bảo dưỡng', icon: FaTools }
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
      case 'maintenance':
        return (
          <div style={{padding: '60px 20px', textAlign: 'center'}}>
            <FaTools size={64} style={{color: '#ccc', marginBottom: '20px'}} />
            <h3>Quy trình bảo dưỡng</h3>
            <p style={{color: '#666'}}>Chức năng đang phát triển...</p>
          </div>
        );
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🔧 Admin Dashboard - Hệ thống quản lý</h1>
          <p>Chào mừng, <strong>{fullName || 'Administrator'}</strong></p>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
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
