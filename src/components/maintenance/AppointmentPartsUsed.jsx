import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTools } from 'react-icons/fa';
import { getAppointmentPartsUsed, getAllParts } from '../../api';
import './AppointmentPartsUsed.css';

const AppointmentPartsUsed = ({ appointmentId }) => {
  const [partsUsed, setPartsUsed] = useState([]);
  const [partsData, setPartsData] = useState([]); // Store full part details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appointmentId) {
      fetchPartsUsed();
    }
  }, [appointmentId]);

  const fetchPartsUsed = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📦 [AppointmentPartsUsed] Fetching parts used for appointment:', appointmentId);
      
      // Fetch parts used data
      const partsUsedData = await getAppointmentPartsUsed(appointmentId);
      console.log('📦 [AppointmentPartsUsed] Parts used data:', partsUsedData);
      
      if (!Array.isArray(partsUsedData) || partsUsedData.length === 0) {
        setPartsUsed([]);
        setLoading(false);
        return;
      }

      setPartsUsed(partsUsedData);

      // Fetch full part details to get part names
      try {
        const allParts = await getAllParts();
        setPartsData(allParts || []);
        
        // Map parts used with part names
        const partsWithNames = partsUsedData.map(partUsed => {
          const partDetail = allParts.find(p => p.id === partUsed.partId);
          return {
            ...partUsed,
            partName: partDetail?.name || `Part ID: ${partUsed.partId}`,
            partDescription: partDetail?.description || ''
          };
        });
        
        setPartsUsed(partsWithNames);
      } catch (err) {
        console.error('❌ [AppointmentPartsUsed] Error fetching part details:', err);
        // Still show parts used even if we can't get names
      }
    } catch (err) {
      console.error('❌ [AppointmentPartsUsed] Error fetching parts used:', err);
      setError(err.response?.data?.message || 'Không thể tải linh kiện đã sử dụng');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total cost
  const totalCost = partsUsed.reduce((sum, part) => {
    return sum + ((part.unitCost || 0) * (part.quantityUsed || 0));
  }, 0);

  if (loading) {
    return (
      <div className="appointment-parts-used">
        <div className="appointment-parts-used-header">
          <h3>
            <FaTools />
            Linh kiện đã sử dụng
          </h3>
        </div>
        <div className="appointment-parts-loading">
          <FaSpinner className="spinner" />
          <p>Đang tải linh kiện đã sử dụng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-parts-used">
        <div className="appointment-parts-used-header">
          <h3>
            <FaTools />
            Linh kiện đã sử dụng
          </h3>
        </div>
        <div className="appointment-parts-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-parts-used">
      <div className="appointment-parts-used-header">
        <h3>
          <FaTools />
          Linh kiện đã sử dụng
        </h3>
      </div>

      {partsUsed.length > 0 ? (
        <div className="appointment-parts-list">
          {partsUsed.map((part, index) => (
            <div key={index} className="appointment-part-item">
              <div className="appointment-part-info">
                <div className="appointment-part-name">
                  {part.partName || `Part ID: ${part.partId}`}
                </div>
                {part.partDescription && (
                  <div className="appointment-part-description">
                    {part.partDescription}
                  </div>
                )}
                <div className="appointment-part-details">
                  <div className="appointment-part-detail-item">
                    <span className="detail-label">Số lượng:</span>
                    <span className="detail-value">{part.quantityUsed || 0}</span>
                  </div>
                  <div className="appointment-part-detail-item">
                    <span className="detail-label">Đơn giá:</span>
                    <span className="detail-value">
                      {part.unitCost ? `${part.unitCost.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                    </span>
                  </div>
                  <div className="appointment-part-detail-item">
                    <span className="detail-label">Thành tiền:</span>
                    <span className="detail-value highlight">
                      {((part.unitCost || 0) * (part.quantityUsed || 0)).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Total Cost */}
          <div className="appointment-parts-total">
            <span className="total-label">Tổng cộng:</span>
            <span className="total-value">{totalCost.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        </div>
      ) : (
        <div className="appointment-parts-empty">
          <p>Chưa có linh kiện nào được sử dụng</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentPartsUsed;

