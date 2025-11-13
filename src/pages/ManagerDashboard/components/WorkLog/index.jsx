import React, { useState } from 'react';
import { FaSearch, FaClipboardList } from 'react-icons/fa';
import { useWorkLog } from '../../hooks/useWorkLog';

/**
 * WorkLog Tab Component
 * Displays work logs for staff in current center
 */
export const WorkLogTab = () => {
  const { workLogs, loading, error, fetchWorkLogs } = useWorkLog();
  const [searchQuery, setSearchQuery] = useState('');

  // Loading state
  if (loading) {
    return (
      <div className="worklog-section">
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
          <p>⏳ Đang tải danh sách WorkLog...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="worklog-section">
        <div className="error-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#f44336'
        }}>
          <p>❌ Lỗi: {error}</p>
          <button 
            onClick={fetchWorkLogs}
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

  // Filter work logs
  const filteredWorkLogs = workLogs.filter(log => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const staffName = (log.staff?.fullName || '').toLowerCase();
    const tasksDone = (log.tasksDone || '').toLowerCase();
    
    return staffName.includes(query) || tasksDone.includes(query);
  });

  return (
    <div className="worklog-section">
      {/* Toolbar: Search */}
      <div className="section-toolbar" style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px'
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
            placeholder="Tìm kiếm WorkLog (tên nhân viên, công việc)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* WorkLog Table */}
      {filteredWorkLogs.length === 0 ? (
        <div className="empty-message" style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <FaClipboardList size={60} style={{color: '#ccc', marginBottom: '20px'}} />
          <h3 style={{color: '#666'}}>Chưa có WorkLog nào</h3>
          <p style={{color: '#999'}}>Không có dữ liệu WorkLog để hiển thị</p>
        </div>
      ) : (
        <div className="worklog-table">
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Nhân viên</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Công việc</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Giờ làm việc</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkLogs.map((log, index) => (
                <tr key={log.id || `worklog-${index}-${log.appointmentId}-${log.staffIds?.[0] || 'na'}`} style={{borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'}}>
                  <td style={{padding: '12px'}}>
                    <strong>{log.staff?.fullName || 'N/A'}</strong>
                  </td>
                  <td style={{padding: '12px'}}>
                    {log.tasksDone || 'N/A'}
                  </td>
                  <td style={{padding: '12px'}}>
                    <strong>{log.hoursSpent || 0} giờ</strong>
                  </td>
                  <td style={{padding: '12px'}}>
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

          <div style={{marginTop: '20px', textAlign: 'right', color: '#666', fontSize: '14px'}}>
            <strong>Tổng số: {filteredWorkLogs.length} WorkLog</strong>
          </div>
        </div>
      )}
    </div>
  );
};

