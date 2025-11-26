import React, { useState, useEffect } from 'react';
import { FaTools, FaSpinner, FaInfoCircle, FaHistory, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getSuggestedParts } from '../../api';
import './TechnicianSuggestedParts.css';

/**
 * Component hiển thị các linh kiện được technician đề xuất và phản hồi của customer
 * Technician có thể xem customer đã accept/deny những gì
 * @param {boolean} showOnlyProcessed - Nếu true, chỉ hiển thị processed parts và ẩn tabs
 */
const TechnicianSuggestedParts = ({ appointmentId, refreshTrigger, showOnlyProcessed = false }) => {
  const [suggestedParts, setSuggestedParts] = useState([]);
  const [processedParts, setProcessedParts] = useState([]);
  const [activeTab, setActiveTab] = useState(showOnlyProcessed ? 'processed' : 'pending'); // 'pending' or 'processed'
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load suggested parts khi appointmentId thay đổi hoặc refreshTrigger thay đổi
  useEffect(() => {
    if (appointmentId) {
      loadData();
    } else {
      setSuggestedParts([]);
      setProcessedParts([]);
      setHasLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, refreshTrigger]);

  const loadData = async () => {
    if (!appointmentId) return;
    
    try {
      setLoading(true);
      console.log(`📦 [TechnicianSuggestedParts] Loading parts for appointment ${appointmentId}`);
      
      const parts = await getSuggestedParts(appointmentId);
      console.log(`📦 [TechnicianSuggestedParts] Parts received:`, parts);
      
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
      console.error('❌ [TechnicianSuggestedParts] Error loading parts:', err);
      setSuggestedParts([]);
      setProcessedParts([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'accepted') {
      return (
        <span className="status-badge accepted">
          <FaCheckCircle />
          Đã chấp nhận
        </span>
      );
    }
    if (statusLower === 'cancelled' || statusLower === 'denied' || statusLower === 'rejected') {
      return (
        <span className="status-badge cancelled">
          <FaTimesCircle />
          Đã từ chối
        </span>
      );
    }
    return (
      <span className="status-badge pending">
        <FaInfoCircle />
        Chờ phản hồi
      </span>
    );
  };

  // Nếu không có appointmentId, không hiển thị gì
  if (!appointmentId) {
    return null;
  }

  const currentParts = activeTab === 'pending' ? suggestedParts : processedParts;
  const totalPending = suggestedParts.length;
  const totalProcessed = processedParts.length;

  return (
    <div className="technician-suggested-parts-container">
      <div className="technician-suggested-parts-header">
        <h3>
          <FaTools />
          {showOnlyProcessed ? 'Phản hồi khách hàng' : 'Linh kiện đã đề xuất & Phản hồi khách hàng'}
        </h3>
        <p className="technician-suggested-parts-description">
          {showOnlyProcessed 
            ? 'Xem phản hồi của khách hàng về các linh kiện đã đề xuất'
            : 'Xem các linh kiện bạn đã đề xuất và phản hồi của khách hàng'}
        </p>
      </div>

      {/* Tab Navigation - Chỉ hiển thị nếu không phải showOnlyProcessed */}
      {!showOnlyProcessed && (
        <div className="technician-suggested-parts-tabs">
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <FaInfoCircle />
            Chờ phản hồi
            {totalPending > 0 && <span className="tab-badge">{totalPending}</span>}
          </button>
          <button
            className={`tab-button ${activeTab === 'processed' ? 'active' : ''}`}
            onClick={() => setActiveTab('processed')}
          >
            <FaHistory />
            Đã phản hồi
            {totalProcessed > 0 && <span className="tab-badge">{totalProcessed}</span>}
          </button>
        </div>
      )}

      {loading ? (
        <div className="technician-suggested-parts-loading">
          <FaSpinner className="spinner" />
          <p>Đang tải danh sách linh kiện...</p>
        </div>
      ) : currentParts.length === 0 ? (
        <div className="technician-suggested-parts-empty">
          <FaInfoCircle />
          <p>
            {showOnlyProcessed
              ? 'Chưa có linh kiện nào đã được khách hàng phản hồi'
              : activeTab === 'pending' 
                ? 'Chưa có linh kiện nào đang chờ phản hồi' 
                : 'Chưa có linh kiện nào đã được khách hàng phản hồi'}
          </p>
        </div>
      ) : (
        <div className="technician-suggested-parts-list">
          {currentParts.map((part, index) => {
            const partId = part.partId || part.part_id;
            const partName = part.part_name || `Linh kiện #${partId}`;
            const status = (part.status || '').toLowerCase();
            const isProcessed = status === 'accepted' || 
                              status === 'cancelled' || 
                              status === 'denied' || 
                              status === 'rejected';
            
            return (
              <div key={`part-${partId}-${index}`} className={`technician-suggested-part-card ${isProcessed ? 'processed' : ''}`}>
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
                      <span className="detail-label">Ghi chú của bạn:</span>
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

export default TechnicianSuggestedParts;

