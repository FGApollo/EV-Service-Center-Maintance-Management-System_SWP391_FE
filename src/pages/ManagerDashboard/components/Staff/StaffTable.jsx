import React from 'react';
import { FaUserTie } from 'react-icons/fa';

/**
 * StaffTable Component (Read-Only)
 * Displays staff list in table format without action buttons
 */
export const StaffTable = ({ 
  staffList, 
  searchQuery
}) => {
  // Filter staff based on search query
  const filteredStaff = staffList.filter(staff => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = (staff.fullName || '').toLowerCase();
    const email = (staff.email || '').toLowerCase();
    const phone = (staff.phone || '');
    
    return fullName.includes(query) || 
           email.includes(query) || 
           phone.includes(query);
  });

  // Empty state
  if (filteredStaff.length === 0) {
    return (
      <div className="empty-message" style={{
        padding: '60px 20px', 
        textAlign: 'center',
        color: '#999'
      }}>
        <FaUserTie size={60} style={{color: '#ddd', marginBottom: '20px'}} />
        <h3>Không tìm thấy nhân viên nào</h3>
        {searchQuery && (
          <p>Thử tìm kiếm với từ khóa khác</p>
        )}
      </div>
    );
  }

  return (
    <div className="staff-table">
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>STT</th>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>Họ tên</th>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>Email</th>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>Số điện thoại</th>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>Vai trò</th>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>Trạng thái</th>
            <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333'}}>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff, index) => (
            <tr key={staff.id} style={{borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'}}>
              <td style={{padding: '12px'}}>{index + 1}</td>
              
              <td style={{padding: '12px'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaUserTie style={{
                    color: staff.role?.toUpperCase() === 'TECHNICIAN' ? '#4caf50' : '#2196f3'
                  }} />
                  <strong>{staff.fullName || staff.name || 'N/A'}</strong>
                </div>
              </td>
              
              <td style={{padding: '12px'}}>{staff.email || 'N/A'}</td>
              
              <td style={{padding: '12px'}}>{staff.phone || 'N/A'}</td>
              
              <td style={{padding: '12px'}}>
                <span 
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: '500',
                    backgroundColor: staff.role?.toUpperCase() === 'TECHNICIAN' ? '#e8f5e9' : '#e3f2fd',
                    color: staff.role?.toUpperCase() === 'TECHNICIAN' ? '#2e7d32' : '#1565c0'
                  }}
                >
                  {staff.role?.toUpperCase() === 'TECHNICIAN' ? 'Kỹ thuật viên' : 'Nhân viên'}
                </span>
              </td>
              
              <td style={{padding: '12px'}}>
                <span 
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: '500',
                    backgroundColor: (staff.status?.toUpperCase() === 'ACTIVE' || !staff.status) ? '#e8f5e9' : '#ffebee',
                    color: (staff.status?.toUpperCase() === 'ACTIVE' || !staff.status) ? '#2e7d32' : '#c62828'
                  }}
                >
                  {staff.status?.toUpperCase() === 'ACTIVE' ? 'active' : (staff.status?.toLowerCase() || 'active')}
                </span>
              </td>
              
              <td style={{padding: '12px'}}>
                {staff.create_at 
                  ? new Date(staff.create_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })
                  : 'N/A'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="total-count" style={{
        marginTop: '20px',
        textAlign: 'right',
        color: '#666',
        fontSize: '14px'
      }}>
        <strong>Tổng số: {filteredStaff.length} nhân viên</strong>
        {searchQuery && staffList.length !== filteredStaff.length && (
          <span style={{marginLeft: '10px', color: '#999'}}>
            (từ {staffList.length} nhân viên)
          </span>
        )}
      </div>
    </div>
  );
};
