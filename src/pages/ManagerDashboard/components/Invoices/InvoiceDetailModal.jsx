import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileInvoice, FaCalendar, FaUser, FaCar, FaMoneyBillWave, FaTools, FaBox, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './InvoiceDetailModal.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const InvoiceDetailModal = ({ invoice, onClose, fetchInvoiceDetail }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (invoice && fetchInvoiceDetail) {
        try {
          setLoading(true);
          const detail = await fetchInvoiceDetail(invoice.id || invoice.invoiceId);
          setDetailData(detail);
        } catch (err) {
          console.error('Error loading invoice detail:', err);
          setDetailData(invoice); // Fallback to basic invoice data
        } finally {
          setLoading(false);
        }
      } else {
        setDetailData(invoice);
        setLoading(false);
      }
    };

    loadDetail();
  }, [invoice, fetchInvoiceDetail]);

  if (!invoice) return null;

  const data = detailData || invoice;
  const invoiceId = data.invoiceId || 'N/A';
  const customerName = data.customerName || 'N/A';
  const customerPhone = data.customerPhone || '';
  const customerEmail = data.customerEmail || '';
  const vehicleModel = data.vehicleModel || 'N/A';
  const vehicleVin = data.vehicleVin || '';
  const serviceName = data.serviceName || '';
  const totalAmount = data.totalAmount || 0;
  const paidAmount = totalAmount; // Giả sử đã thanh toán đầy đủ
  const status = data.status || 'paid';
  const paymentMethod = 'N/A'; // API không trả về field này
  const createdDate = data.createdAt;
  const paidDate = data.paymentDate;
  
  // Services và Parts - API list không có, chỉ có trong detail
  // Tạm thời tạo từ serviceName
  const services = serviceName ? [{ name: serviceName, quantity: 1, price: totalAmount }] : [];
  const parts = [];
  const notes = '';

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="invoice-modal-header">
          <div className="invoice-header-left">
            <FaFileInvoice className="invoice-header-icon" />
            <div>
              <h2>Chi tiết hóa đơn</h2>
              <p className="invoice-id">Mã hóa đơn: #{invoiceId}</p>
            </div>
          </div>
          <button className="invoice-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="invoice-modal-body">
          {loading ? (
            <div className="invoice-loading">
              <div className="spinner"></div>
              <p>Đang tải chi tiết...</p>
            </div>
          ) : (
            <>
              {/* Status Badge */}
              <div className="invoice-status-section">
                <div className={`invoice-status-badge status-${status.toLowerCase()}`}>
                  {status === 'paid' || status === 'completed' ? (
                    <><FaCheckCircle /> Đã thanh toán</>
                  ) : (
                    <><FaExclamationCircle /> Chưa thanh toán</>
                  )}
                </div>
              </div>

              {/* Customer & Vehicle Info */}
              <div className="invoice-info-grid">
                <div className="invoice-info-card">
                  <FaUser className="info-icon" />
                  <div>
                    <label>Khách hàng</label>
                    <p>{customerName}</p>
                    {customerPhone && <p style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>📞 {customerPhone}</p>}
                    {customerEmail && <p style={{fontSize: '12px', color: '#6b7280', marginTop: '2px'}}>✉️ {customerEmail}</p>}
                  </div>
                </div>
                <div className="invoice-info-card">
                  <FaCar className="info-icon" />
                  <div>
                    <label>Phương tiện</label>
                    <p>{vehicleModel}</p>
                    {vehicleVin && <p style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>VIN: {vehicleVin}</p>}
                  </div>
                </div>
                <div className="invoice-info-card">
                  <FaCalendar className="info-icon" />
                  <div>
                    <label>Ngày tạo</label>
                    <p>{formatDate(createdDate)}</p>
                  </div>
                </div>
                {paidDate && (
                  <div className="invoice-info-card">
                    <FaCalendar className="info-icon" />
                    <div>
                      <label>Ngày thanh toán</label>
                      <p>{formatDate(paidDate)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              {services && services.length > 0 && (
                <div className="invoice-section">
                  <h3><FaTools /> Dịch vụ</h3>
                  <div className="invoice-items-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Tên dịch vụ</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th className="text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service, index) => {
                          const serviceName = service.name || service.serviceName || service.serviceType?.name || 'N/A';
                          const quantity = service.quantity || 1;
                          const price = service.price || service.unitPrice || 0;
                          const subtotal = quantity * price;
                          
                          return (
                            <tr key={index}>
                              <td>{serviceName}</td>
                              <td>{quantity}</td>
                              <td>{formatCurrency(price)}</td>
                              <td className="text-right">{formatCurrency(subtotal)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Parts */}
              {parts && parts.length > 0 && (
                <div className="invoice-section">
                  <h3><FaBox /> Phụ tùng</h3>
                  <div className="invoice-items-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Tên phụ tùng</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th className="text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((part, index) => {
                          const partName = part.name || part.partName || part.part?.name || 'N/A';
                          const quantity = part.quantity || part.quantityUsed || 1;
                          const price = part.price || part.unitPrice || 0;
                          const subtotal = quantity * price;
                          
                          return (
                            <tr key={index}>
                              <td>{partName}</td>
                              <td>{quantity}</td>
                              <td>{formatCurrency(price)}</td>
                              <td className="text-right">{formatCurrency(subtotal)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {notes && (
                <div className="invoice-section">
                  <h3>Ghi chú</h3>
                  <p className="invoice-notes">{notes}</p>
                </div>
              )}

              {/* Total Summary */}
              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Tổng tiền:</span>
                  <strong>{formatCurrency(totalAmount)}</strong>
                </div>
                {paidAmount > 0 && (
                  <>
                    <div className="summary-row">
                      <span>Đã thanh toán:</span>
                      <strong className="text-success">{formatCurrency(paidAmount)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Còn lại:</span>
                      <strong className="text-danger">{formatCurrency(totalAmount - paidAmount)}</strong>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="invoice-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

