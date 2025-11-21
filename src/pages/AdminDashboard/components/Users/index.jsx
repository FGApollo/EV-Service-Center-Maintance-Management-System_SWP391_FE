import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useUsers } from '../../hooks/useUsers';
import { UserModal } from './UserModal';
import { UsersStats } from './UsersStats';
import { UsersTable } from './UsersTable';
import { showSuccess, showError } from '../../../../utils/toast';
import './Users.css';

export const UsersTab = () => {
  const { users, loading, error, fetchUsers, addEmployee, updateUser, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      showSuccess('Xóa người dùng thành công!');
    } else {
      showError(`Lỗi: ${result.error}`);
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
      showSuccess(`${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} người dùng thành công!`);
      setShowModal(false);
      setSelectedUser(null);
    } else {
      showError(`Lỗi: ${result.error}`);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="users-section">
      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-user-btn" onClick={handleAddUser}>
          <FaPlus />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
        </div>
      )}

      {/* Stats Cards */}
      {users.length > 0 && <UsersStats users={users} />}

      {/* Users Table */}
      <UsersTable
        users={users}
        searchQuery={searchQuery}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

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
