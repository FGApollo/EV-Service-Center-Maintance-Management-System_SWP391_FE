import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';
import { 
  FaUser, FaUserTie, FaWarehouse, FaMoneyBillWave, FaChartLine
} from 'react-icons/fa';
import { getCurrentUser, getCurrentCenterId } from '../utils/centerFilter';
import { ROLES } from '../constants/roles';

// ✅ Import Refactored Components
import { StaffList } from './ManagerDashboard/components/Staff';
import { OverviewTab } from './ManagerDashboard/components/Overview';
import { CustomersTab } from './ManagerDashboard/components/Customers';
import { PartsTab } from './ManagerDashboard/components/Parts';
import { FinanceTab } from './ManagerDashboard/components/Finance';

/**
 * MANAGER DASHBOARD - CLEAN VERSION
 * 
 * Dashboard cho Manager - quản lý trung tâm dịch vụ
 * Scope: Chỉ xem & quản lý data của 1 center cụ thể
 * 
 * Quyền hạn:
 * - Quản lý khách hàng của center
 * - Quản lý phụ tùng & tồn kho
 * - Quản lý nhân sự (staff, technician)
 * - Xem báo cáo tài chính & thống kê
 * 
 * ❌ KHÔNG BAO GỒM:
 * - Quản lý xe (removed - not manager's responsibility)
 * - Quản lý lịch hẹn (removed - not manager's responsibility)
 * - Quản lý quy trình bảo dưỡng (removed - not manager's responsibility)
 * - Chat (removed - not manager's responsibility)
 */
function ManagerDashboard({ onNavigate }) {
  console.log('ManagerDashboard component loaded!', { onNavigate });
  
  // Lấy thông tin user & center
  const currentUser = getCurrentUser();
  const { role, centerId, fullName } = currentUser;
  
  // Format display name - nếu có "Admin" trong tên thì đổi thành "Manager"
  const displayName = fullName 
    ? fullName.replace(/Admin/gi, 'Manager')
    : 'Manager User';
  
  // Kiểm tra đăng nhập & quyền truy cập
  useEffect(() => {
    let hasShownAlert = false;
    
    const token = localStorage.getItem('token');
    if (!token) {
      if (!hasShownAlert) {
        hasShownAlert = true;
        alert('Bạn cần đăng nhập để truy cập trang này!');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    // Kiểm tra role phải là MANAGER
    if (role !== ROLES.MANAGER) {
      if (!hasShownAlert) {
        hasShownAlert = true;
        alert('Bạn không có quyền truy cập trang này! Trang này chỉ dành cho Manager.');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    // Kiểm tra có centerId không
    if (!centerId) {
      if (!hasShownAlert) {
        hasShownAlert = true;
        alert('Tài khoản chưa được gán vào trung tâm nào!');
        onNavigate && onNavigate('login');
      }
      return;
    }
    
    console.log('✅ Manager authorized:', { role, centerId, fullName });
  }, [role, centerId, fullName, onNavigate]);
  
  // Đồng bộ activeTab với URL
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.slice(1);
    const parts = hash.split('/');
    const tab = parts[1] || 'overview';
    console.log('📍 Initial tab from URL:', hash, '→', tab);
    return tab;
  });
  
  // Listen to hash changes để update activeTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const parts = hash.split('/');
      const tab = parts[1] || 'overview';
      console.log('📍 Hash changed:', hash, '→', tab);
      setActiveTab(tab);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    console.log('🔄 Switching to tab:', tab);
    setActiveTab(tab);
    window.location.hash = `manager/${tab}`;
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
              <p className="manager-name">{displayName}</p>
              <p className="manager-role">Manager - Quản lý trung tâm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <FaChartLine />
          Tổng quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => handleTabChange('customers')}
        >
          <FaUser />
          Khách hàng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => handleTabChange('staff')}
        >
          <FaUserTie />
          Nhân sự
        </button>
        <button 
          className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
          onClick={() => handleTabChange('parts')}
        >
          <FaWarehouse />
          Phụ tùng
        </button>
        <button 
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => handleTabChange('finance')}
        >
          <FaMoneyBillWave />
          Tài chính & Báo cáo
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content" key={activeTab}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'staff' && <StaffList />}
        {activeTab === 'parts' && <PartsTab />}
        {activeTab === 'finance' && <FinanceTab />}
      </div>
    </div>
  );
}

export default ManagerDashboard;
