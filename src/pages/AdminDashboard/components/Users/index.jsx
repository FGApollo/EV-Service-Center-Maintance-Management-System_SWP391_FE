import React, { useEffect, useState } from 'react';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie, FaUserCog, FaWrench, FaUser } from 'react-icons/fa';
import { useUsers } from '../../hooks/useUsers';
import { UserModal } from './UserModal';

export const UsersTab = () => {
  const { users, loading, error, fetchUsers, addEmployee, updateUser, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      (user.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchRole = filterRole === 'ALL' || user.role === filterRole;
    
    return matchSearch && matchRole;
  });

  // Group users by role
  const usersByRole = {
    MANAGER: filteredUsers.filter(u => u.role === 'MANAGER'),
    STAFF: filteredUsers.filter(u => u.role === 'STAFF'),
    TECHNICIAN: filteredUsers.filter(u => u.role === 'TECHNICIAN'),
    CUSTOMER: filteredUsers.filter(u => u.role === 'CUSTOMER')
  };

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}"?`)) {
      return;
    }

    const result = await deleteUser(user.id);
    if (result.success) {
      alert('✅ Xóa người dùng thành công!');
    } else {
      alert(`❌ Lỗi: ${result.error}`);
    }
  };

  const handleSaveUser = async (userData) => {
    let result;
    if (modalMode === 'add') {
      result = await addEmployee(userData.role, userData);
    } else {
      result = await updateUser(selectedUser.id, userData);
    }

    if (result.success) {
      alert(`✅ ${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} người dùng thành công!`);
      setShowModal(false);
      setSelectedUser(null);
    } else {
      alert(`❌ Lỗi: ${result.error}`);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'MANAGER': return <FaUserTie style={{color: '#f093fb'}} />;
      case 'STAFF': return <FaUserCog style={{color: '#4facfe'}} />;
      case 'TECHNICIAN': return <FaWrench style={{color: '#43e97b'}} />;
      case 'CUSTOMER': return <FaUser style={{color: '#667eea'}} />;
      default: return <FaUser />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'MANAGER': return { bg: '#fce7f3', color: '#be185d' };
      case 'STAFF': return { bg: '#dbeafe', color: '#1e40af' };
      case 'TECHNICIAN': return { bg: '#d1fae5', color: '#065f46' };
      case 'CUSTOMER': return { bg: '#e0e7ff', color: '#3730a3' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-section" style={{padding: '40px', textAlign: 'center'}}>
        <p>⏳ Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="users-section">
      {/* Header */}
      <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2 style={{margin: 0}}>
            <FaUsers style={{marginRight: '8px', verticalAlign: 'middle'}} />
            Quản lý người dùng
          </h2>
          <p style={{color: '#666', margin: '4px 0 0'}}>
            Tổng: {users.length} người dùng
          </p>
        </div>
        <button 
          onClick={handleAddUser}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          <FaPlus /> Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar" style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
        <div style={{flex: 1, position: 'relative'}}>
          <FaSearch style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999'}} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="MANAGER">Quản lý ({usersByRole.MANAGER.length})</option>
          <option value="STAFF">Nhân viên ({usersByRole.STAFF.length})</option>
          <option value="TECHNICIAN">Kỹ thuật viên ({usersByRole.TECHNICIAN.length})</option>
          <option value="CUSTOMER">Khách hàng ({usersByRole.CUSTOMER.length})</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{padding: '16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px'}}>
          ❌ {error}
        </div>
      )}

      {/* Users Table */}
      <div className="users-table" style={{background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        {filteredUsers.length === 0 ? (
          <div style={{padding: '60px 20px', textAlign: 'center', color: '#999'}}>
            <FaUsers size={48} style={{marginBottom: '16px', opacity: 0.3}} />
            <p>Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead style={{background: '#f9fafb', borderBottom: '2px solid #e5e7eb'}}>
              <tr>
                <th style={{padding: '16px', textAlign: 'left', fontWeight: '600'}}>STT</th>
                <th style={{padding: '16px', textAlign: 'left', fontWeight: '600'}}>Họ tên</th>
                <th style={{padding: '16px', textAlign: 'left', fontWeight: '600'}}>Email</th>
                <th style={{padding: '16px', textAlign: 'left', fontWeight: '600'}}>Số điện thoại</th>
                <th style={{padding: '16px', textAlign: 'left', fontWeight: '600'}}>Vai trò</th>
                <th style={{padding: '16px', textAlign: 'left', fontWeight: '600'}}>Trạng thái</th>
                <th style={{padding: '16px', textAlign: 'center', fontWeight: '600'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const roleColors = getRoleBadgeColor(user.role);
                return (
                  <tr key={user.id} style={{borderBottom: '1px solid #f3f4f6'}}>
                    <td style={{padding: '16px'}}>{index + 1}</td>
                    <td style={{padding: '16px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {getRoleIcon(user.role)}
                        <strong>{user.fullName || 'N/A'}</strong>
                      </div>
                    </td>
                    <td style={{padding: '16px', color: '#666'}}>{user.email || 'N/A'}</td>
                    <td style={{padding: '16px', color: '#666'}}>{user.phoneNumber || 'N/A'}</td>
                    <td style={{padding: '16px'}}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: roleColors.bg,
                        color: roleColors.color
                      }}>
                        {user.role || 'N/A'}
                      </span>
                    </td>
                    <td style={{padding: '16px'}}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: user.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                        color: user.status === 'ACTIVE' ? '#065f46' : '#991b1b'
                      }}>
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{padding: '16px', textAlign: 'center'}}>
                      <div style={{display: 'flex', gap: '8px', justifyContent: 'center'}}>
                        <button
                          onClick={() => handleEditUser(user)}
                          style={{
                            padding: '8px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Chỉnh sửa"
                        >
                          <FaEdit /> Sửa
                        </button>
                        {user.role !== 'CUSTOMER' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            style={{
                              padding: '8px 12px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Xóa"
                          >
                            <FaTrash /> Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};
