import React from 'react';
import { FaEdit, FaTrash, FaWarehouse } from 'react-icons/fa';
import './PartsTable.css';

export const PartsTable = ({ parts, searchQuery, onEdit, onDelete }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  // Filter parts
  const filteredParts = parts.filter(part =>
    searchQuery === '' ||
    part.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    part.id?.toString().includes(searchQuery)
  );

  // Empty state
  if (filteredParts.length === 0) {
    return (
      <div className="parts-empty-state">
        <FaWarehouse size={48} />
        <h3>Không tìm thấy phụ tùng</h3>
        {searchQuery ? (
          <p>Không có phụ tùng nào khớp với "{searchQuery}"</p>
        ) : (
          <p>Chưa có phụ tùng nào trong kho</p>
        )}
      </div>
    );
  }

  return (
    <div className="parts-table-container">
      <div className="table-wrapper">
        <table className="parts-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Tên phụ tùng</th>
              <th>Mô tả</th>
              <th>Đơn giá</th>
              <th>Tồn tối thiểu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part, index) => (
              <tr key={part.id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">
                  <span className="part-id">#{part.id}</span>
                </td>
                <td>
                  <span className="part-name">{part.name || 'N/A'}</span>
                </td>
                <td>
                  <span className="part-description">{part.description || '-'}</span>
                </td>
                <td className="text-center">
                  <span className="price-badge">{formatCurrency(part.unitPrice)} ₫</span>
                </td>
                <td className="text-center">
                  <span className="stock-badge">{part.minStockLevel || 0}</span>
                </td>
                <td className="text-center">
                  <div className="action-btns">
                    <button 
                      className="btn-action btn-edit" 
                      onClick={() => onEdit(part)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => onDelete(part)}
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
      </div>
      
      <div className="table-footer">
        <span className="result-count">
          Hiển thị <strong>{filteredParts.length}</strong> phụ tùng
          {searchQuery && parts.length !== filteredParts.length && (
            <> trong tổng số <strong>{parts.length}</strong></>
          )}
        </span>
      </div>
    </div>
  );
};

