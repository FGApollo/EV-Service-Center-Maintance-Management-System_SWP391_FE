import React from 'react';
import { FaUserTie, FaEdit, FaTimes } from 'react-icons/fa';

/**
 * StaffTable Component
 * Displays staff list in table format with actions
 */
export const StaffTable = ({ 
  staffList, 
  searchQuery, 
  onEdit, 
  onDelete 
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
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff, index) => (
            <tr key={staff.id}>
              <td>{index + 1}</td>
              
              <td>
                <div className="staff-name" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaUserTie style={{
                    color: staff.role === 'TECHNICIAN' ? '#4caf50' : '#2196f3'
                  }} />
                  <strong>{staff.fullName || staff.name || 'N/A'}</strong>
                </div>
              </td>
              
              <td>{staff.email || 'N/A'}</td>
              
              <td>{staff.phone || 'N/A'}</td>
              
              <td>
                <span 
                  className={`role-badge ${staff.role?.toLowerCase()}`}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: '500',
                    backgroundColor: staff.role === 'TECHNICIAN' ? '#e8f5e9' : '#e3f2fd',
                    color: staff.role === 'TECHNICIAN' ? '#2e7d32' : '#1565c0'
                  }}
                >
                  {staff.role === 'TECHNICIAN' ? '🔧 Kỹ thuật viên' : '👔 Nhân viên'}
                </span>
              </td>
              
              <td>
                <span 
                  className={`status-badge ${staff.status?.toLowerCase() || 'active'}`}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    fontWeight: '500',
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32'
                  }}
                >
                  {staff.status || 'ACTIVE'}
                </span>
              </td>
              
              <td>
                {staff.create_at 
                  ? new Date(staff.create_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })
                  : 'N/A'
                }
              </td>
              
              <td>
                <div className="action-buttons-small" style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  <button 
                    className="btn-edit" 
                    title="Chỉnh sửa"
                    onClick={() => onEdit(staff)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn-delete" 
                    title="Xóa"
                    onClick={() => onDelete(staff)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
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
