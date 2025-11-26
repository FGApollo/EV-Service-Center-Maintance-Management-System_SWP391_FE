import React, { useState, useEffect } from 'react';
import { FaTools, FaCheckCircle, FaTimesCircle, FaSpinner, FaInfoCircle, FaChevronDown, FaChevronUp, FaHistory } from 'react-icons/fa';
import { getAppointments, getSuggestedParts, getAllSuggestedParts, acceptSuggestedPart, denySuggestedPart } from '../../api';
import { showSuccess, showError } from '../../utils/toast';
import './CustomerSuggestedParts.css';

/**
 * Component hiển thị các linh kiện được technician đề xuất cho customer
 * Customer có thể chấp nhận hoặc từ chối từng linh kiện
 * Component có thể được toggle show/hide
 */
const CustomerSuggestedParts = ({ isOpen: externalIsOpen, onToggle: externalOnToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [suggestedPartsByAppointment, setSuggestedPartsByAppointment] = useState({});
  const [processedPartsByAppointment, setProcessedPartsByAppointment] = useState({});
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'processed'
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [hasLoaded, setHasLoaded] = useState(false);

  // Sử dụng external state nếu có, nếu không dùng internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleToggle = externalOnToggle || (() => setInternalIsOpen(prev => !prev));

  // Load appointments và suggested parts chỉ khi mở
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Lấy danh sách appointments của customer
      const appointmentsData = await getAppointments();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      
      // Lấy suggested parts cho mỗi appointment (cho tab "Chờ phản hồi")
      const partsMap = {};
      for (const appointment of appointmentsData || []) {
        try {
          const appointmentId = appointment.appointmentId || appointment.id;
          if (appointmentId) {
            const parts = await getSuggestedParts(appointmentId);
            if (Array.isArray(parts) && parts.length > 0) {
              // Log để debug structure
              console.log(`📦 [CustomerSuggestedParts] Parts for appointment ${appointmentId}:`, parts);
              if (parts[0]) {
                console.log(`📦 [CustomerSuggestedParts] Sample part keys:`, Object.keys(parts[0]));
                console.log(`📦 [CustomerSuggestedParts] Sample part:`, parts[0]);
              }
              
              // Chỉ lấy các parts chưa được xử lý (cho tab "Chờ phản hồi")
              const pendingParts = parts.filter(part => {
                const status = (part.status || '').toLowerCase();
                return status !== 'accepted' && 
                       status !== 'cancelled' && 
                       status !== 'denied' && 
                       status !== 'rejected';
              });
              
              if (pendingParts.length > 0) {
                partsMap[appointmentId] = {
                  appointment: appointment,
                  parts: pendingParts
                };
              }
            }
          }
        } catch (err) {
          console.error(`❌ Lỗi khi lấy suggested parts cho appointment ${appointment.appointmentId}:`, err);
          // Tiếp tục với appointment khác
        }
      }
      
      setSuggestedPartsByAppointment(partsMap);
      
      // Lấy tất cả suggested parts đã xử lý từ API /api/suggested_part/all (cho tab "Đã xử lý")
      try {
        const allProcessedParts = await getAllSuggestedParts();
        console.log(`📦 [CustomerSuggestedParts] All processed parts:`, allProcessedParts);
        
        if (Array.isArray(allProcessedParts) && allProcessedParts.length > 0) {
          // Lọc chỉ lấy các parts đã được xử lý
          const processedParts = allProcessedParts.filter(part => {
            const status = (part.status || '').toLowerCase();
            return status === 'accepted' || 
                   status === 'cancelled' || 
                   status === 'denied' || 
                   status === 'rejected';
          });
          
          // Nhóm theo appointmentId
          const processedMap = {};
          for (const part of processedParts) {
            const appointmentId = part.appointmentId || part.appointment_id;
            if (appointmentId) {
              // Tìm appointment tương ứng
              const appointment = appointmentsData.find(apt => 
                (apt.appointmentId || apt.id) === appointmentId
              );
              
              if (!processedMap[appointmentId]) {
                processedMap[appointmentId] = {
                  appointment: appointment || { 
                    appointmentId: appointmentId,
                    vehicleModel: 'N/A',
                    appointmentDate: part.appointmentDate
                  },
                  parts: []
                };
              }
              
              processedMap[appointmentId].parts.push(part);
            }
          }
          
          setProcessedPartsByAppointment(processedMap);
        } else {
          setProcessedPartsByAppointment({});
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy tất cả suggested parts đã xử lý:', err);
        // Nếu API /all không hoạt động, fallback về cách cũ
        setProcessedPartsByAppointment({});
      }
      
      setHasLoaded(true);
    } catch (err) {
      console.error('❌ Lỗi khi tải dữ liệu:', err);
      showError('Không thể tải danh sách linh kiện đề xuất');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (suggestedPartId, appointmentId, partId, partName) => {
    // Nếu không có suggestedPartId, thử dùng partId (có thể backend dùng partId làm ID)
    const idToUse = suggestedPartId || partId;
    
    if (!idToUse) {
      console.error('❌ [Accept] Không có ID để gọi API');
      showError('Không tìm thấy ID của linh kiện đề xuất. Vui lòng tải lại trang.');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn chấp nhận thay thế linh kiện "${partName}"?`)) {
      return;
    }

    try {
      setProcessingIds(prev => new Set(prev).add(idToUse));
      
      console.log(`✅ [Accept] Đang chấp nhận với ID: ${idToUse} (suggestedPartId: ${suggestedPartId}, partId: ${partId})`);
      const response = await acceptSuggestedPart(idToUse);
      console.log('✅ [Accept] Response:', response);
      
      // Kiểm tra response có chứa id không (có thể backend trả về full object)
      if (response && response.id) {
        console.log('✅ [Accept] Found ID in response:', response.id);
      }
      
      showSuccess('Đã chấp nhận thay thế linh kiện thành công!');
      
      // Tự động chuyển sang tab "Đã xử lý" để xem lại
      setActiveTab('processed');
      
      // Reload data sau 500ms để đảm bảo backend đã cập nhật
      setTimeout(async () => {
        setHasLoaded(false);
        await loadData();
      }, 500);
    } catch (err) {
      console.error('❌ Lỗi khi chấp nhận:', err);
      console.error('❌ Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Không thể chấp nhận linh kiện. Vui lòng thử lại.';
      showError(errorMessage);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(idToUse);
        return newSet;
      });
    }
  };

  const handleDeny = async (suggestedPartId, appointmentId, partId, partName) => {
    // Nếu không có suggestedPartId, thử dùng partId (có thể backend dùng partId làm ID)
    const idToUse = suggestedPartId || partId;
    
    if (!idToUse) {
      console.error('❌ [Deny] Không có ID để gọi API');
      showError('Không tìm thấy ID của linh kiện đề xuất. Vui lòng tải lại trang.');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn từ chối thay thế linh kiện "${partName}"?`)) {
      return;
    }

    try {
      setProcessingIds(prev => new Set(prev).add(idToUse));
      
      console.log(`❌ [Deny] Đang từ chối với ID: ${idToUse} (suggestedPartId: ${suggestedPartId}, partId: ${partId})`);
      const response = await denySuggestedPart(idToUse);
      console.log('✅ [Deny] Response:', response);
      
      // Kiểm tra response có chứa id không (có thể backend trả về full object)
      if (response && response.id) {
        console.log('✅ [Deny] Found ID in response:', response.id);
      }
      
      showSuccess('Đã từ chối thay thế linh kiện thành công!');
      
      // Tự động chuyển sang tab "Đã xử lý" để xem lại
      setActiveTab('processed');
      
      // Reload data sau 500ms để đảm bảo backend đã cập nhật
      setTimeout(async () => {
        setHasLoaded(false);
        await loadData();
      }, 500);
    } catch (err) {
      console.error('❌ Lỗi khi từ chối:', err);
      console.error('❌ Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Không thể từ chối linh kiện. Vui lòng thử lại.';
      showError(errorMessage);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(idToUse);
        return newSet;
      });
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

  // Tính tổng số suggested parts
  const totalParts = Object.values(suggestedPartsByAppointment).reduce(
    (sum, item) => sum + (item.parts?.length || 0),
    0
  );
  
  // Tính tổng số processed parts
  const totalProcessedParts = Object.values(processedPartsByAppointment).reduce(
    (sum, item) => sum + (item.parts?.length || 0),
    0
  );

  // Nếu không mở, chỉ hiển thị nút toggle
  if (!isOpen) {
    return (
      <div className="customer-suggested-parts-toggle-container">
        <button 
          className="toggle-suggested-parts-button"
          onClick={handleToggle}
        >
          <FaTools />
          <span>Xem linh kiện cần thay thế</span>
          {totalParts > 0 && (
            <span className="parts-badge">{totalParts}</span>
          )}
          <FaChevronDown className="chevron-icon" />
        </button>
      </div>
    );
  }

  return (
    <div className="customer-suggested-parts-container">
      {/* Only show header if not forced open (i.e., when used as toggle component) */}
      {externalIsOpen === undefined && (
        <div className="suggested-parts-header">
          <div className="header-top">
            <h3>
              <FaTools />
              Linh kiện cần thay thế {totalParts > 0 && `(${totalParts})`}
            </h3>
            <button 
              className="close-suggested-parts-button"
              onClick={handleToggle}
              title="Đóng"
            >
              <FaChevronUp />
            </button>
          </div>
          <p className="suggested-parts-description">
            Kỹ thuật viên đã đề xuất các linh kiện cần thay thế cho xe của bạn. 
            Vui lòng xem xét và phản hồi.
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="suggested-parts-tabs">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <FaTools />
          Chờ phản hồi
          {totalParts > 0 && <span className="tab-badge">{totalParts}</span>}
        </button>
        <button
          className={`tab-button ${activeTab === 'processed' ? 'active' : ''}`}
          onClick={() => setActiveTab('processed')}
        >
          <FaHistory />
          Đã xử lý
          {totalProcessedParts > 0 && <span className="tab-badge">{totalProcessedParts}</span>}
        </button>
      </div>

      {loading ? (
        <div className="suggested-parts-loading">
          <FaSpinner className="spinner" />
          <p>Đang tải danh sách linh kiện đề xuất...</p>
        </div>
      ) : activeTab === 'pending' ? (
        totalParts === 0 ? (
          <div className="suggested-parts-empty">
            <FaInfoCircle />
            <p>Hiện tại không có linh kiện nào cần phản hồi</p>
          </div>
        ) : (
          <div className="suggested-parts-list">
            {Object.entries(suggestedPartsByAppointment).map(([appointmentId, data]) => {
          const { appointment, parts } = data;
          
          return (
            <div key={appointmentId} className="suggested-parts-appointment-group">
              <div className="appointment-header">
                <div className="appointment-info">
                  <h4>Phiếu dịch vụ #{appointmentId}</h4>
                  <div className="appointment-details">
                    <span>Xe: {appointment.vehicleModel || 'N/A'}</span>
                    <span>Ngày: {formatDate(appointment.appointmentDate)}</span>
                  </div>
                </div>
              </div>

              <div className="suggested-parts-items">
                {parts.map((part, index) => {
                  // ID của part (linh kiện) - để hiển thị
                  const partId = part.partId || part.part_id;
                  const partName = part.part_name || `Linh kiện #${partId}`;
                  
                  // ID của suggested part record (dùng để gọi accept/deny API)
                  // Theo API response, field này có thể là suggestPart_Id (với underscore)
                  const suggestedPartId = part.id || 
                                         part.suggestPart_Id ||  // Field từ API response
                                         part.suggestPartId ||
                                         part.suggestedPartId || 
                                         part.suggested_part_id ||
                                         part.suggestedPart_id ||
                                         part.recordId ||
                                         part.record_id ||
                                         part.suggestedPartRecordId ||
                                         null;
                  
                  // Kiểm tra trạng thái
                  const status = (part.status || '').toLowerCase();
                  const isProcessed = status === 'accepted' || 
                                     status === 'cancelled' || 
                                     status === 'denied' || 
                                     status === 'rejected';
                  // Sử dụng partId làm ID nếu không có suggestedPartId
                  const idToUse = suggestedPartId || partId;
                  const isProcessing = processingIds.has(idToUse);
                  
                  // Log để debug - chỉ log lần đầu tiên để xem structure
                  if (index === 0) {
                    console.log('📦 [CustomerSuggestedParts] Sample part structure:', part);
                    console.log('📦 [CustomerSuggestedParts] All keys:', Object.keys(part));
                    console.log('📦 [CustomerSuggestedParts] Extracted suggestedPartId:', suggestedPartId);
                    console.log('📦 [CustomerSuggestedParts] PartId:', partId);
                    console.log('📦 [CustomerSuggestedParts] AppointmentId:', appointmentId);
                    console.log('📦 [CustomerSuggestedParts] ID to use:', idToUse);
                  }
                  
                  return (
                    <div key={idToUse || `part-${partId}-${index}`} className="suggested-part-card">
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

                      <div className="part-actions">
                        <button
                          className="btn-accept"
                          onClick={() => handleAccept(suggestedPartId, appointmentId, partId, partName)}
                          disabled={!partId || isProcessed || isProcessing}
                          title={!partId ? 'Không tìm thấy ID của linh kiện' : isProcessed ? 'Linh kiện đã được xử lý' : ''}
                        >
                          {isProcessing ? (
                            <>
                              <FaSpinner className="spinner" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <FaCheckCircle />
                              Đồng ý
                            </>
                          )}
                        </button>
                        <button
                          className="btn-deny"
                          onClick={() => handleDeny(suggestedPartId, appointmentId, partId, partName)}
                          disabled={!partId || isProcessed || isProcessing}
                          title={!partId ? 'Không tìm thấy ID của linh kiện' : isProcessed ? 'Linh kiện đã được xử lý' : ''}
                        >
                          {isProcessing ? (
                            <>
                              <FaSpinner className="spinner" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <FaTimesCircle />
                              Từ chối
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
          </div>
        )
      ) : (
        totalProcessedParts === 0 ? (
          <div className="suggested-parts-empty">
            <FaHistory />
            <p>Chưa có linh kiện nào đã được xử lý</p>
          </div>
        ) : (
          <div className="suggested-parts-list">
            {Object.entries(processedPartsByAppointment).map(([appointmentId, data]) => {
              const { appointment, parts } = data;
              
              return (
                <div key={appointmentId} className="suggested-parts-appointment-group">
                  <div className="appointment-header">
                    <div className="appointment-info">
                      <h4>Phiếu dịch vụ #{appointmentId}</h4>
                      <div className="appointment-details">
                        <span>Xe: {appointment.vehicleModel || 'N/A'}</span>
                        <span>Ngày: {formatDate(appointment.appointmentDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="suggested-parts-items">
                    {parts.map((part, index) => {
                      const partId = part.partId || part.part_id;
                      const partName = part.part_name || `Linh kiện #${partId}`;
                      const status = (part.status || '').toLowerCase();
                      
                      return (
                        <div key={`processed-${partId}-${index}`} className="suggested-part-card processed">
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
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default CustomerSuggestedParts;

