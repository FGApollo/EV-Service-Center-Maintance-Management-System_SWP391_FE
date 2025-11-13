import React, { useEffect, useState } from 'react';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie, FaUserCog, FaWrench, FaUser } from 'react-icons/fa';
import { useUsers } from '../../hooks/useUsers';
import { UserModal } from './UserModal';
import { AccordionSection } from './Accordion';
import './Users.css';

export const UsersTab = () => {
  const { users, loading, error, fetchUsers, addEmployee, updateUser, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users by search query
  const filteredBySearch = users.filter(user => {
    const name = (user.fullName || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || user.phoneNumber || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      name.includes(query) ||
      email.includes(query) ||
      phone.includes(query)
    );
  });

  // Group users by role (after search filter)
  const usersByRole = {
    MANAGER: filteredBySearch.filter(u => u.role?.toUpperCase() === 'MANAGER'),
    STAFF: filteredBySearch.filter(u => u.role?.toUpperCase() === 'STAFF'),
    TECHNICIAN: filteredBySearch.filter(u => u.role?.toUpperCase() === 'TECHNICIAN'),
    CUSTOMER: filteredBySearch.filter(u => u.role?.toUpperCase() === 'CUSTOMER')
  };

  // Role configuration
  const roleConfig = [
    {
      key: 'CUSTOMER',
      label: 'Khách hàng',
      icon: <FaUser />,
      users: usersByRole.CUSTOMER
    },
    {
      key: 'TECHNICIAN',
      label: 'Kỹ thuật viên',
      icon: <FaWrench />,
      users: usersByRole.TECHNICIAN
    },
    {
      key: 'MANAGER',
      label: 'Quản lý',
      icon: <FaUserTie />,
      users: usersByRole.MANAGER
    },
    {
      key: 'STAFF',
      label: 'Nhân viên',
      icon: <FaUserCog />,
      users: usersByRole.STAFF
    }
  ];

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

      {/* Search Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{padding: '16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px'}}>
          ❌ {error}
        </div>
      )}

      {/* Users by Role - Accordion Sections */}
      {filteredBySearch.length === 0 ? (
        <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <FaUsers size={48} style={{marginBottom: '16px', opacity: 0.3, color: '#999'}} />
          <p style={{color: '#999', fontSize: '16px'}}>Không tìm thấy người dùng nào</p>
        </div>
      ) : (
        <div className="users-accordion-container">
          {roleConfig.map((roleGroup) => (
            <AccordionSection
              key={roleGroup.key}
              title={roleGroup.label}
              icon={roleGroup.icon}
              role={roleGroup.key}
              count={roleGroup.users.length}
              defaultOpen={true}
            >
              {roleGroup.users.length === 0 ? (
                <div className="empty-role-message" style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  <p>Chưa có {roleGroup.label.toLowerCase()} nào trong hệ thống</p>
                </div>
              ) : (
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th style={{textAlign: 'center'}}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roleGroup.users.map((user, index) => {
                        const roleColors = getRoleBadgeColor(user.role);
                        return (
                          <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="user-name-cell">
                                {getRoleIcon(user.role)}
                                <strong>{user.fullName || 'N/A'}</strong>
                              </div>
                            </td>
                            <td>{user.email || 'N/A'}</td>
                            <td>{user.phone || user.phoneNumber || 'N/A'}</td>
                            <td>
                              <span className="role-badge" style={{
                                background: roleColors.bg,
                                color: roleColors.color
                              }}>
                                {user.role || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <span className="status-badge" style={{
                                background: user.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                                color: user.status === 'ACTIVE' ? '#065f46' : '#991b1b'
                              }}>
                                {user.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td style={{textAlign: 'center'}}>
                              <div className="action-buttons">
                                <button
                                  className="btn-edit"
                                  onClick={() => handleEditUser(user)}
                                  title="Chỉnh sửa"
                                >
                                  <FaEdit /> Sửa
                                </button>
                                {user.role?.toUpperCase() !== 'CUSTOMER' && (
                                  <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteUser(user)}
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
                </div>
              )}
            </AccordionSection>
          ))}
        </div>
      )}

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
