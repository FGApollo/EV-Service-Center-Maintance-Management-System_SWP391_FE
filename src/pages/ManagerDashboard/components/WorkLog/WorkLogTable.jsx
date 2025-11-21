import React from 'react';
import { FaClipboardList, FaUserTie } from 'react-icons/fa';
import './WorkLogTable.css';

/**
 * WorkLogTable Component
 * Displays work logs in table format
 */
export const WorkLogTable = ({ 
  workLogs, 
  searchQuery
}) => {
  // Filter work logs based on search query
  const filteredWorkLogs = workLogs.filter(log => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const staffName = (log.staff?.fullName || '').toLowerCase();
    const tasksDone = (log.tasksDone || '').toLowerCase();
    
    return staffName.includes(query) || tasksDone.includes(query);
  });

  // Empty state
  if (filteredWorkLogs.length === 0) {
    return (
      <div className="worklog-empty-state">
        <FaClipboardList size={60} />
        <h3>Không tìm thấy WorkLog nào</h3>
        {searchQuery && (
          <p>Thử tìm kiếm với từ khóa khác</p>
        )}
      </div>
    );
  }

  return (
    <div className="worklog-table-wrapper">
      <table className="worklog-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Nhân viên</th>
            <th>Công việc</th>
            <th>Giờ làm việc</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkLogs.map((log, index) => (
            <tr key={log.id || `worklog-${index}-${log.appointmentId}-${log.staffIds?.[0] || 'na'}`}>
              <td>{index + 1}</td>
              
              <td>
                <div className="staff-name-cell">
                  <FaUserTie style={{ color: '#3b82f6' }} />
                  <strong>{log.staff?.fullName || 'N/A'}</strong>
                </div>
              </td>
              
              <td>
                <div className="task-cell">
                  {log.tasksDone || 'N/A'}
                </div>
              </td>
              
              <td>
                <span className="hours-badge">
                  {log.hoursSpent || 0} giờ
                </span>
              </td>
              
              <td>
                {log.createdAt 
                  ? new Date(log.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })
                  : 'N/A'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="total-count">
        <strong>Tổng số: {filteredWorkLogs.length} WorkLog</strong>
        {searchQuery && workLogs.length !== filteredWorkLogs.length && (
          <span>
            (từ {workLogs.length} WorkLog)
          </span>
        )}
      </div>
    </div>
  );
};

