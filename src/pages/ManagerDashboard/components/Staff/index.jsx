import React, { useState } from 'react';
import { FaSearch, FaPlus, FaUserTie } from 'react-icons/fa';
import { useStaff } from '../../hooks/useStaff';
import { StaffStats } from './StaffStats';
import { StaffTable } from './StaffTable';
import { StaffModal } from './StaffModal';

/**
 * StaffList Component (Container)
 * Main component for Staff Management tab
 */
export const StaffList = () => {
  const { staffList, loading, error, stats, addStaff, updateStaff, deleteStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Handle edit staff
   */
  const handleEdit = (staff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setShowModal(true);
  };

  /**
   * Handle delete staff
   */
  const handleDelete = async (staff) => {
    const confirmed = window.confirm(
      `⚠️ Xác nhận xóa nhân viên?\n\n` +
      `Tên: ${staff.fullName}\n` +
      `Email: ${staff.email}\n` +
      `Vai trò: ${staff.role === 'TECHNICIAN' ? 'Kỹ thuật viên' : 'Nhân viên'}\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (confirmed) {
      try {
        await deleteStaff(staff.id);
        alert('✅ Xóa nhân viên thành công!');
      } catch (err) {
        alert(`❌ Lỗi: ${err.message || 'Không thể xóa nhân viên'}`);
      }
    }
  };

  /**
   * Handle add new staff
   */
  const handleAddClick = () => {
    setModalMode('add');
    setSelectedStaff(null);
    setShowModal(true);
  };

  /**
   * Handle save staff (add or edit)
   */
  const handleSaveStaff = async (formData) => {
    setSaving(true);
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await addStaff(formData);
      } else {
        result = await updateStaff(formData.id, formData);
      }

      if (result.success) {
        alert(modalMode === 'add' ? '✅ Thêm nhân viên thành công!' : '✅ Cập nhật nhân viên thành công!');
        setShowModal(false);
      } else {
        alert(`❌ Lỗi: ${result.error || 'Không thể lưu nhân viên'}`);
      }
    } catch (err) {
      alert(`❌ Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setSaving(false);
    }
  };

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
            onClick={() => window.location.reload()}
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
      {/* Toolbar: Search + Add Button */}
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
        
        <button 
          className="add-btn"
          onClick={handleAddClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4caf50'}
        >
          <FaPlus /> Thêm nhân viên
        </button>
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
          <p style={{color: '#999', marginBottom: '20px'}}>
            Bấm "Thêm nhân viên" để thêm kỹ thuật viên hoặc nhân viên mới
          </p>
          <button 
            onClick={handleAddClick}
            style={{
              padding: '10px 24px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <FaPlus style={{marginRight: '8px'}} />
            Thêm nhân viên đầu tiên
          </button>
        </div>
      ) : (
        <StaffTable
          staffList={staffList}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Staff Modal */}
      <StaffModal
        show={showModal}
        mode={modalMode}
        staff={selectedStaff}
        onClose={() => setShowModal(false)}
        onSave={handleSaveStaff}
        saving={saving}
      />
    </div>
  );
};
