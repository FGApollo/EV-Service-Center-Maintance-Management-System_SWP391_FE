import React from 'react';
import { FaBoxes, FaExclamationTriangle, FaDollarSign, FaWarehouse } from 'react-icons/fa';
import './PartsStats.css';

export const PartsStats = ({ stats }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  return (
    <div className="parts-stats-container">
      <div className="parts-stat-card total-parts">
        <div className="stat-icon">
          <FaWarehouse />
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalParts || 0}</div>
          <div className="stat-label">Tổng phụ tùng</div>
        </div>
      </div>

      <div className="parts-stat-card low-stock-parts">
        <div className="stat-icon">
          <FaExclamationTriangle />
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.lowStockParts || 0}</div>
          <div className="stat-label">Tồn kho thấp</div>
        </div>
      </div>

      <div className="parts-stat-card total-value">
        <div className="stat-icon">
          <FaDollarSign />
        </div>
        <div className="stat-content">
          <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
          <div className="stat-label">Giá trị tồn kho</div>
        </div>
      </div>

      <div className="parts-stat-card categories-count">
        <div className="stat-icon">
          <FaBoxes />
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.uniqueCategories || 0}</div>
          <div className="stat-label">Danh mục</div>
        </div>
      </div>
    </div>
  );
};

