import React, { useState } from 'react';
import { FaSearch, FaUserTie } from 'react-icons/fa';
import { useStaff } from '../../hooks/useStaff';
import { StaffStats } from './StaffStats';
import { StaffTable } from './StaffTable';

/**
 * StaffList Component (Read-Only)
 * Displays staff list for current manager's center
 * No CRUD operations - view only
 */
export const StaffList = () => {
  const { staffList, loading, error, stats, fetchStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');

  // Loading state
  if (loading) {
    return (
      <div className="staff-section">
        <div className="loading-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>⏳ Đang tải danh sách nhân viên...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="staff-section">
        <div className="error-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#f44336'
        }}>
          <p>❌ Lỗi: {error}</p>
          <button 
            onClick={fetchStaff}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-section">
      {/* Toolbar: Search Only (No Add Button) */}
      <div className="section-toolbar" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div className="search-box" style={{
          flex: '1',
          minWidth: '300px',
          maxWidth: '500px',
          position: 'relative'
        }}>
          <FaSearch style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999'
          }} />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên (tên, email, SĐT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2196f3'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <StaffStats stats={stats} />

      {/* Staff Table */}
      {staffList.length === 0 ? (
        <div className="empty-message" style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginTop: '24px'
        }}>
          <FaUserTie size={60} style={{color: '#ccc', marginBottom: '20px'}} />
          <h3 style={{color: '#666', marginBottom: '10px'}}>
            Chưa có nhân viên nào
          </h3>
          <p style={{color: '#999'}}>
            Hiện tại không có nhân viên nào được gán cho trung tâm này
          </p>
        </div>
      ) : (
        <StaffTable
          staffList={staffList}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};
