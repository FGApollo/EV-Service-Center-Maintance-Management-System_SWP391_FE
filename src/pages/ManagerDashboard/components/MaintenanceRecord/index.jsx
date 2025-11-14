import React, { useState } from 'react';
import { FaSearch, FaTools } from 'react-icons/fa';
import { useMaintenanceRecord } from '../../hooks/useMaintenanceRecord';

/**
 * MaintenanceRecord Tab Component
 * Displays maintenance records for current center
 */
export const MaintenanceRecordTab = () => {
  const { records, loading, error, fetchRecords } = useMaintenanceRecord();
  const [searchQuery, setSearchQuery] = useState('');

  // Loading state
  if (loading) {
    return (
      <div className="maintenance-section">
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
          <p>⏳ Đang tải danh sách bảo dưỡng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="maintenance-section">
        <div className="error-state" style={{
          padding: '60px 20px',
          textAlign: 'center',
          color: '#f44336'
        }}>
          <p>❌ Lỗi: {error}</p>
          <button 
            onClick={fetchRecords}
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

  // Filter records
  const filteredRecords = records.filter(record => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const vehicleModel = (record.appointment?.vehicle?.model || '').toLowerCase();
    const checkList = (record.checklist || '').toLowerCase();
    const remarks = (record.remarks || '').toLowerCase();
    const appointmentId = (record.appointment_id || '').toLowerCase();
    
    return vehicleModel.includes(query) || 
           checkList.includes(query) || 
           remarks.includes(query);
           appointmentId.includes(query)
  });

  return (
    <div className="maintenance-section">
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
            placeholder="Tìm kiếm (xe, kiểm tra, ghi chú)..."
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

      {/* Maintenance Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="empty-message" style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <FaTools size={60} style={{color: '#ccc', marginBottom: '20px'}} />
          <h3 style={{color: '#666'}}>Chưa có quy trình bảo dưỡng nào</h3>
          <p style={{color: '#999'}}>Không có dữ liệu bảo dưỡng để hiển thị</p>
        </div>
      ) : (
        <div className="maintenance-table">
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd'}}>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Appointment ID</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Tình trạng xe</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Kiểm tra</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Ghi chú</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Thời gian bắt đầu</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Thời gian kết thúc</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => {
                // Helper để format ngày giờ
                const formatDateTime = (value) => {
                  if (!value) return 'N/A';
                  try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return 'N/A';
                    return date.toLocaleString('vi-VN');
                  } catch (err) {
                    return 'N/A';
                  }
                };

                // Lấy start_time từ các field có thể có
                const startTime = record.start_time || record.startTime || record.start_time_stamp || record.startTimestamp;
                // Lấy end_time từ các field có thể có
                const endTime = record.end_time || record.endTime || record.end_time_stamp || record.endTimestamp;

                return (
                  <tr key={record.id} style={{borderBottom: '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'}}>
                    <td style={{padding: '12px'}}>
                      <strong>{record.appointmentId || 'N/A'}</strong>
                    </td>
                    <td style={{padding: '12px'}}>
                      {record.vehicleCondition || 'N/A'}
                    </td>
                    <td style={{padding: '12px'}}>
                      {record.checklist || 'N/A'}
                    </td>
                    <td style={{padding: '12px'}}>
                      {record.remarks || 'N/A'}
                    </td>
                    <td style={{padding: '12px'}}>
                      {formatDateTime(startTime)}
                    </td>
                    <td style={{padding: '12px'}}>
                      {formatDateTime(endTime)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{marginTop: '20px', textAlign: 'right', color: '#666', fontSize: '14px'}}>
            <strong>Tổng số: {filteredRecords.length} bản ghi</strong>
          </div>
        </div>
      )}
    </div>
  );
};
