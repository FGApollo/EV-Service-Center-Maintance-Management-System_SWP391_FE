import React from 'react';
import { FaUserTie, FaUsers } from 'react-icons/fa';
import './StaffStats.css';

/**
 * StaffStats Component
 * Displays statistics cards for staff overview
 */
export const StaffStats = ({ stats }) => {
  return (
    <div className="staff-stats">
      <div className="stat-card technicians">
        <FaUserTie size={32} />
        <div>
          <h4>{stats.technicians}</h4>
          <p>Kỹ thuật viên</p>
        </div>
      </div>
      
      <div className="stat-card staff">
        <FaUsers size={32} />
        <div>
          <h4>{stats.staff}</h4>
          <p>Nhân viên</p>
        </div>
      </div>
      
      <div className="stat-card total">
        <FaUsers size={32} />
        <div>
          <h4>{stats.totalStaff}</h4>
          <p>Tổng nhân sự</p>
        </div>
      </div>
    </div>
  );
};
