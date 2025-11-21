import React, { useMemo } from 'react';
import { FaWarehouse, FaBoxes, FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';
import './PartsStats.css';

export const PartsStats = ({ parts }) => {
  const stats = useMemo(() => {
    const totalParts = parts.length;
    const totalValue = parts.reduce((sum, part) => sum + (part.unitPrice || 0), 0);
    const lowStock = parts.filter(p => (p.quantityInStock || 0) < (p.minStockLevel || 0)).length;
    const uniqueCategories = new Set(parts.map(p => p.category).filter(Boolean)).size;
    
    return [
      {
        icon: FaWarehouse,
        label: 'Tổng phụ tùng',
        value: totalParts,
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      },
      {
        icon: FaBoxes,
        label: 'Loại phụ tùng',
        value: uniqueCategories || totalParts,
        gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
      },
      {
        icon: FaExclamationTriangle,
        label: 'Sắp hết hàng',
        value: lowStock,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
      },
      {
        icon: FaDollarSign,
        label: 'Tổng giá trị',
        value: `${new Intl.NumberFormat('vi-VN').format(totalValue)} ₫`,
        gradient: 'linear-gradient(135deg, #10b981, #059669)'
      }
    ];
  }, [parts]);

  return (
    <div className="parts-stats-container">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="parts-stat-card">
            <div className="stat-icon" style={{ background: stat.gradient }}>
              <Icon />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

