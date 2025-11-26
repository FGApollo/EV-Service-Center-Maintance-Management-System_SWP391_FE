import React, { useState, useEffect } from 'react';
import { FaTools, FaSpinner, FaInfoCircle, FaHistory, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getSuggestedParts } from '../../api';
import './StaffSuggestedParts.css';

/**
 * Component hiển thị các linh kiện được technician đề xuất cho staff
 * Staff chỉ xem, không có quyền accept/deny (quyền của customer)
 * @param {boolean} showOnlyProcessed - Nếu true, chỉ hiển thị processed parts và ẩn tabs
 */
const StaffSuggestedParts = ({ appointmentId, showOnlyProcessed = false }) => {
  const [suggestedParts, setSuggestedParts] = useState([]);
  const [processedParts, setProcessedParts] = useState([]);
  const [activeTab, setActiveTab] = useState(showOnlyProcessed ? 'processed' : 'pending'); // 'pending' or 'processed'
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load suggested parts khi appointmentId thay đổi
  useEffect(() => {
    if (appointmentId) {
      loadData();
    } else {
      setSuggestedParts([]);
      setProcessedParts([]);
      setHasLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const loadData = async () => {
    if (!appointmentId) return;
    
    try {
      setLoading(true);
      console.log(`📦 [StaffSuggestedParts] Loading parts for appointment ${appointmentId}`);
      
      const parts = await getSuggestedParts(appointmentId);
      console.log(`📦 [StaffSuggestedParts] Parts received:`, parts);
      
      if (Array.isArray(parts) && parts.length > 0) {
        // Phân loại parts: pending và processed
        const pending = parts.filter(part => {
          const status = (part.status || '').toLowerCase();
          return status !== 'accepted' && 
                 status !== 'cancelled' && 
                 status !== 'denied' && 
                 status !== 'rejected';
        });
        
        const processed = parts.filter(part => {
          const status = (part.status || '').toLowerCase();
          return status === 'accepted' || 
                 status === 'cancelled' || 
                 status === 'denied' || 
                 status === 'rejected';
        });
        
        setSuggestedParts(pending);
        setProcessedParts(processed);
      } else {
        setSuggestedParts([]);
        setProcessedParts([]);
      }
      
      setHasLoaded(true);
    } catch (err) {
      console.error('❌ [StaffSuggestedParts] Error loading parts:', err);
      setSuggestedParts([]);
      setProcessedParts([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'accepted') {
      return <span className="status-badge accepted">Đã chấp nhận</span>;
    }
    if (statusLower === 'cancelled' || statusLower === 'denied' || statusLower === 'rejected') {
      return <span className="status-badge cancelled">Đã từ chối</span>;
    }
    return <span className="status-badge pending">Chờ phản hồi</span>;
  };

  // Nếu không có appointmentId, không hiển thị gì
  if (!appointmentId) {
    return null;
  }

  const currentParts = activeTab === 'pending' ? suggestedParts : processedParts;
  const totalPending = suggestedParts.length;
  const totalProcessed = processedParts.length;

  return (
    <div className="staff-suggested-parts-container">
      <div className="staff-suggested-parts-header">
        <h3>
          <FaTools />
          {showOnlyProcessed ? 'Phản hồi khách hàng' : 'Linh kiện đề xuất thay thế'}
        </h3>
        {showOnlyProcessed && (
          <p className="staff-suggested-parts-description">
            Xem phản hồi của khách hàng về các linh kiện đã đề xuất
          </p>
        )}
      </div>

      {/* Tab Navigation - Chỉ hiển thị nếu không phải showOnlyProcessed */}
      {!showOnlyProcessed && (
        <div className="staff-suggested-parts-tabs">
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaTools />
            Chờ phản hồi
            {totalPending > 0 && <span className="tab-badge">{totalPending}</span>}
          </button>
          <button
            className={`tab-button ${activeTab === 'processed' ? 'active' : ''}`}
            onClick={() => setActiveTab('processed')}
          >
            <FaHistory />
            Đã xử lý
            {totalProcessed > 0 && <span className="tab-badge">{totalProcessed}</span>}
          </button>
        </div>
      )}

      {loading ? (
        <div className="staff-suggested-parts-loading">
          <FaSpinner className="spinner" />
          <p>Đang tải danh sách linh kiện...</p>
        </div>
      ) : currentParts.length === 0 ? (
        <div className="staff-suggested-parts-empty">
          <FaInfoCircle />
          <p>
            {showOnlyProcessed
              ? 'Chưa có linh kiện nào đã được khách hàng phản hồi'
              : activeTab === 'pending' 
                ? 'Chưa có linh kiện nào cần phản hồi' 
                : 'Chưa có linh kiện nào đã được xử lý'}
          </p>
        </div>
      ) : (
        <div className="staff-suggested-parts-list">
          {currentParts.map((part, index) => {
            const partId = part.partId || part.part_id;
            const partName = part.part_name || `Linh kiện #${partId}`;
            const status = (part.status || '').toLowerCase();
            
            return (
              <div key={`part-${partId}-${index}`} className="staff-suggested-part-card">
                <div className="part-header">
                  <div className="part-info">
                    <h5>{partName}</h5>
                    {part.part_description && (
                      <p className="part-description">{part.part_description}</p>
                    )}
                  </div>
                  {getStatusBadge(part.status)}
                </div>

                <div className="part-details">
                  <div className="detail-row">
                    <span className="detail-label">Số lượng:</span>
                    <span className="detail-value">{part.quantity || 0}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Đơn giá:</span>
                    <span className="detail-value">
                      {part.unit_price ? `${part.unit_price.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tổng tiền:</span>
                    <span className="detail-value total-price">
                      {part.total_price ? `${part.total_price.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                    </span>
                  </div>
                  {part.technician_note && (
                    <div className="detail-row full-width">
                      <span className="detail-label">Ghi chú kỹ thuật viên:</span>
                      <span className="detail-value note">{part.technician_note}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffSuggestedParts;

