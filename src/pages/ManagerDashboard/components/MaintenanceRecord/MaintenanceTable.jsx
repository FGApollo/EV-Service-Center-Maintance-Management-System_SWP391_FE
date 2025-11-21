import React from 'react';
import { FaTools, FaCar } from 'react-icons/fa';
import './MaintenanceTable.css';

/**
 * MaintenanceTable Component
 * Displays maintenance records in table format
 */
export const MaintenanceTable = ({ 
  records, 
  searchQuery
}) => {
  // Filter records based on search query
  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const vehicleModel = (record.appointment?.vehicle?.model || '').toLowerCase();
    const checkList = (record.checklist || '').toLowerCase();
    const remarks = (record.remarks || '').toLowerCase();
    const appointmentId = (record.appointmentId || '').toString().toLowerCase();
    
    return vehicleModel.includes(query) || 
           checkList.includes(query) || 
           remarks.includes(query) ||
           appointmentId.includes(query);
  });

  // Helper để format ngày giờ
  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'N/A';
    }
  };

  // Empty state
  if (filteredRecords.length === 0) {
    return (
      <div className="maintenance-empty-state">
        <FaTools size={60} />
        <h3>Không tìm thấy bảo dưỡng nào</h3>
        {searchQuery && (
          <p>Thử tìm kiếm với từ khóa khác</p>
        )}
      </div>
    );
  }

  return (
    <div className="maintenance-table-wrapper">
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Appointment ID</th>
            <th>Tình trạng xe</th>
            <th>Kiểm tra</th>
            <th>Ghi chú</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => {
            // Lấy start_time từ các field có thể có
            const startTime = record.start_time || record.startTime || record.start_time_stamp || record.startTimestamp;
            // Lấy end_time từ các field có thể có
            const endTime = record.end_time || record.endTime || record.end_time_stamp || record.endTimestamp;

            return (
              <tr key={record.id || `maintenance-${index}`}>
                <td>{index + 1}</td>
                
                <td>
                  <div className="appointment-cell">
                    <FaCar style={{ color: '#8b5cf6' }} />
                    <strong>#{record.appointmentId || 'N/A'}</strong>
                  </div>
                </td>
                
                <td>
                  <span className="condition-badge">
                    {record.vehicleCondition || 'N/A'}
                  </span>
                </td>
                
                <td>
                  <div className="checklist-cell">
                    {record.checklist || 'N/A'}
                  </div>
                </td>
                
                <td>
                  <div className="remarks-cell">
                    {record.remarks || 'N/A'}
                  </div>
                </td>
                
                <td>
                  <span className="time-badge start">
                    {formatDateTime(startTime)}
                  </span>
                </td>
                
                <td>
                  <span className="time-badge end">
                    {formatDateTime(endTime)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="total-count">
        <strong>Tổng số: {filteredRecords.length} bản ghi</strong>
        {searchQuery && records.length !== filteredRecords.length && (
          <span>
            (từ {records.length} bản ghi)
          </span>
        )}
      </div>
    </div>
  );
};

