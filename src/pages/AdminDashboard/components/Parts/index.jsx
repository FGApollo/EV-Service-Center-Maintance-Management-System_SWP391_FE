import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useParts } from '../../hooks/useParts';
import { PartsStats } from './PartsStats';
import { PartsTable } from './PartsTable';
import { PartModal } from './PartModal';
import { showSuccess, showError } from '../../../../utils/toast';
import './Parts.css';

/**
 * Parts Tab Component for Admin Dashboard
 * Manages all parts in the system
 */
export const PartsTab = () => {
  const { parts, loading, error, fetchParts, addPart, updatePart, deletePart } = useParts();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPart, setSelectedPart] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddPart = () => {
    setModalMode('add');
    setSelectedPart(null);
    setShowModal(true);
  };

  const handleEditPart = (part) => {
    setModalMode('edit');
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleDeletePart = async (part) => {
    const confirmed = window.confirm(
      `⚠️ Xác nhận xóa phụ tùng?\n\n` +
      `Tên: ${part.name}\n` +
      `Giá: ${part.unitPrice?.toLocaleString('vi-VN')} VNĐ\n\n` +
      `Hành động này không thể hoàn tác!`
    );

    if (!confirmed) return;

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
  };

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

  if (loading) {
    return (
      <div className="parts-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách phụ tùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parts-error">
        <div className="error-icon">❌</div>
        <h3>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
        <button onClick={fetchParts} className="retry-btn">
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="parts-section">
      {/* Toolbar */}
      <div className="parts-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm phụ tùng theo tên, mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-part-btn" onClick={handleAddPart}>
          <FaPlus />
          <span>Thêm phụ tùng</span>
        </button>
      </div>

      {/* Stats Cards */}
      {parts.length > 0 && <PartsStats parts={parts} />}

      {/* Parts Table */}
      <PartsTable
        parts={parts}
        searchQuery={searchQuery}
        onEdit={handleEditPart}
        onDelete={handleDeletePart}
      />

      {/* Modal */}
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
