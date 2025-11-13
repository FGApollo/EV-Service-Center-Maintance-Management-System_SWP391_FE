import React, { useState } from 'react';
import { FaSearch, FaPlus, FaWarehouse, FaEdit, FaTrash } from 'react-icons/fa';
import { useParts } from '../../hooks/useParts';
import { PartModal } from './PartModal';

/**
 * Parts Tab Component for Admin Dashboard
 * Manages all parts in the system (no center filtering)
 */
export const PartsTab = () => {
  const { parts, loading, error, fetchParts, addPart, updatePart, deletePart } = useParts();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedPart, setSelectedPart] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Handle add new part
   */
  const handleAddPart = () => {
    setModalMode('add');
    setSelectedPart(null);
    setShowModal(true);
  };

  /**
   * Handle edit part
   */
  const handleEditPart = (part) => {
    setModalMode('edit');
    setSelectedPart(part);
    setShowModal(true);
  };

  /**
   * Handle delete part
   */
  const handleDeletePart = async (part) => {
    const confirmed = window.confirm(
      `⚠️ Xác nhận xóa phụ tùng?\n\n` +
      `Tên: ${part.name}\n` +
      `Giá: ${part.unitPrice?.toLocaleString('vi-VN')} VNĐ\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (confirmed) {
      try {
        const result = await deletePart(part.id);
        if (result.success) {
          alert('✅ Xóa phụ tùng thành công!');
        } else {
          alert(`❌ Lỗi: ${result.error}`);
        }
      } catch (err) {
        alert(`❌ Lỗi: ${err.message || 'Không thể xóa phụ tùng'}`);
      }
    }
  };

  /**
   * Handle save part (add or edit)
   */
  const handleSavePart = async (formData) => {
    setSaving(true);
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await addPart(formData);
      } else {
        result = await updatePart(formData.id, formData);
      }

      if (result.success) {
        alert(modalMode === 'add' ? '✅ Thêm phụ tùng thành công!' : '✅ Cập nhật phụ tùng thành công!');
        setShowModal(false);
      } else {
        alert(`❌ Lỗi: ${result.error || 'Không thể lưu phụ tùng'}`);
      }
    } catch (err) {
      alert(`❌ Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setSaving(false);
    }
  };

  // Filter parts
  const filteredParts = parts.filter(part =>
    searchQuery === '' ||
    part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="parts-section">
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
          <p>⏳ Đang tải danh sách phụ tùng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="parts-section">
        <div className="error-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#f44336'
        }}>
          <p>❌ Lỗi: {error}</p>
          <button 
            onClick={fetchParts}
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
    <div className="parts-section">
      {/* Toolbar */}
      <div className="section-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm phụ tùng (tên, mô tả)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={handleAddPart}>
          <FaPlus />
          Thêm phụ tùng
        </button>
      </div>

      {/* Stats */}
      {parts.length > 0 && (
        <div className="parts-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <FaWarehouse size={32} />
            </div>
            <div className="stat-info">
              <h3>{parts.length}</h3>
              <p>Tổng phụ tùng trong hệ thống</p>
            </div>
          </div>
        </div>
      )}

      {/* Parts Table */}
      {filteredParts.length === 0 ? (
        <div className="empty-message" style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginTop: '24px'
        }}>
          <FaWarehouse size={60} style={{color: '#ccc', marginBottom: '20px'}} />
          <h3 style={{color: '#666', marginBottom: '10px'}}>
            {searchQuery ? 'Không tìm thấy phụ tùng' : 'Chưa có phụ tùng nào'}
          </h3>
          <p style={{color: '#999'}}>
            {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bấm "Thêm phụ tùng" để thêm phụ tùng mới'}
          </p>
        </div>
      ) : (
        <div className="parts-table">
          <table>
            <thead>
              <tr>
                <th>Mã PT</th>
                <th>Tên phụ tùng</th>
                <th>Mô tả</th>
                <th>Đơn giá</th>
                <th>Tồn tối thiểu</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part.id}>
                  <td><strong>#{part.id}</strong></td>
                  <td><strong>{part.name || 'N/A'}</strong></td>
                  <td style={{
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {part.description || '-'}
                  </td>
                  <td><strong>{part.unitPrice?.toLocaleString('vi-VN')} VNĐ</strong></td>
                  <td>{part.minStockLevel || 0}</td>
                  <td>
                    <div className="action-buttons" style={{display: 'flex', gap: '8px'}}>
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditPart(part)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeletePart(part)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{
            marginTop: '20px',
            textAlign: 'right',
            color: '#666',
            fontSize: '14px'
          }}>
            <strong>Tổng số: {filteredParts.length} phụ tùng</strong>
            {searchQuery && parts.length !== filteredParts.length && (
              <span style={{marginLeft: '10px', color: '#999'}}>
                (từ {parts.length} phụ tùng)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <PartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePart}
        part={selectedPart}
        mode={modalMode}
        saving={saving}
      />
    </div>
  );
};

