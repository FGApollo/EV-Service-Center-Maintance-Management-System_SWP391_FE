import React, { useState } from 'react';
import { FaSearch, FaPlus, FaWarehouse, FaEdit, FaTrash } from 'react-icons/fa';
import { useParts } from '../../hooks/useParts';
import { PartModal } from './PartModal';
import { showSuccess, showError } from '../../../../utils/toast';

export const PartsTab = () => {
  const { parts, loading, addPart, updatePart, deletePart } = useParts();
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
      `Giá: ${part.unitPrice?.toLocaleString()} VNĐ\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (confirmed) {
      try {
        const result = await deletePart(part.id);
        if (result.success) {
          showSuccess('Xóa phụ tùng thành công!');
        } else {
          showError(`Lỗi: ${result.error}`);
        }
      } catch (err) {
        showError(`Lỗi: ${err.message || 'Không thể xóa phụ tùng'}`);
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
        showSuccess(modalMode === 'add' ? 'Thêm phụ tùng thành công!' : 'Cập nhật phụ tùng thành công!');
        setShowModal(false);
      } else {
        showError(`Lỗi: ${result.error || 'Không thể lưu phụ tùng'}`);
      }
    } catch (err) {
      showError(`Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredParts = parts.filter(part =>
    searchQuery === '' ||
    part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="parts-section">
      <div className="section-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm phụ tùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={handleAddPart}>
          <FaPlus />
          Thêm phụ tùng
        </button>
      </div>

      {loading ? (
        <div className="loading-message">
          <p>⏳ Đang tải dữ liệu phụ tùng từ API...</p>
        </div>
      ) : parts.length === 0 ? (
        <div className="empty-message" style={{padding: '60px 20px', textAlign: 'center'}}>
          <FaWarehouse size={60} style={{color: '#ccc', marginBottom: '20px'}} />
          <h3>Chưa có phụ tùng nào trong kho</h3>
          <p>Bấm "Thêm phụ tùng" để thêm phụ tùng mới</p>
        </div>
      ) : (
        <>
          <div className="parts-stats">
            <div className="stat-card">
              <FaWarehouse />
              <div>
                <h4>{parts.length}</h4>
                <p>Tổng phụ tùng</p>
              </div>
            </div>
          </div>

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
                {filteredParts.map(part => {
                  return (
                    <tr key={part.id}>
                      <td><strong>#{part.id}</strong></td>
                      <td>{part.name || 'N/A'}</td>
                      <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {part.description || '-'}
                      </td>
                      <td><strong>{part.unitPrice?.toLocaleString()} VNĐ</strong></td>
                      <td>{part.minStockLevel || 0}</td>
                      <td>
                        <div className="action-buttons" style={{display: 'flex', gap: '8px'}}>
                          <button 
                            className="btn-edit" 
                            onClick={() => handleEditPart(part)}
                            title="Chỉnh sửa"
                            style={{padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete" 
                            onClick={() => handleDeletePart(part)}
                            title="Xóa"
                            style={{padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for Add/Edit */}
      <PartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePart}
        part={selectedPart}
        mode={modalMode}
      />
    </div>
  );
};
