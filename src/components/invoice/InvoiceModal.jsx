import React, { useState, useEffect } from 'react';
import { FaTimes, FaPrint, FaSpinner, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { getCustomerInvoice, getAllParts, createCashPayment, createPartPayment, getAppointmentStatus } from '../../api';
import { useToastContext } from '../../contexts/ToastContext';
import './InvoiceModal.css';

const InvoiceModal = ({ isOpen, onClose, appointmentId, appointmentDetail = null }) => {
  const [invoice, setInvoice] = useState(null);
  const [partsData, setPartsData] = useState([]); // Store full part details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const toast = useToastContext();

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📄 Đang tải hóa đơn cho appointment:', appointmentId);
      
      const data = await getCustomerInvoice(appointmentId);
      console.log('📄 Hóa đơn:', data);
      
      // API response structure:
      // - services: [{ id, name, description, price, durationEst }]
      // - parts: [{ partId, partName, quantity, price }] - price is unit price
      
      // Fetch part details if needed (for additional info like description)
      if (data.parts && data.parts.length > 0) {
        try {
          const allParts = await getAllParts();
          setPartsData(allParts || []);
          
          // Map parts - API already provides partName and price (unit price)
          // We just need to ensure partName is set and add description if available
          const partsMapped = data.parts.map(part => {
            const partDetail = allParts.find(p => p.id === part.partId);
            return {
              ...part,
              partName: part.partName || partDetail?.name || `Part ID: ${part.partId}`,
              partDescription: partDetail?.description || '',
              // API returns 'price' as unit price, map it to unitCost for consistency
              unitCost: parseFloat(part.price) || 0,
              quantity: part.quantity || 0
            };
          });
          
          setInvoice({
            ...data,
            parts: partsMapped
          });
        } catch (partsErr) {
          console.error('❌ Lỗi khi tải thông tin linh kiện:', partsErr);
          // Map parts without fetching additional details
          const partsMapped = (data.parts || []).map(part => ({
            ...part,
            unitCost: parseFloat(part.price) || 0,
            quantity: part.quantity || 0
          }));
          setInvoice({
            ...data,
            parts: partsMapped
          });
        }
      } else {
        setInvoice(data);
      }
    } catch (err) {
      console.error('❌ Lỗi khi tải hóa đơn:', err);
      setError(err.response?.data?.message || 'Không thể tải hóa đơn');
      toast.showError(err.response?.data?.message || 'Không thể tải hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchInvoice();
      // Fetch appointment detail to get invoiceId if not provided
      if (!appointmentDetail) {
        fetchAppointmentDetail();
      } else {
        // Extract invoiceId from appointmentDetail.invoices
        if (appointmentDetail.invoices && appointmentDetail.invoices.length > 0) {
          // Get the first invoice ID (or the one for parts)
          const partInvoice = appointmentDetail.invoices.find(inv => 
            inv.status && (inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'unpaid')
          ) || appointmentDetail.invoices[0];
          setInvoiceId(partInvoice.invoiceId);
        }
      }
    } else {
      setInvoice(null);
      setError(null);
      setInvoiceId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, appointmentId, appointmentDetail]);

  const fetchAppointmentDetail = async () => {
    try {
      const data = await getAppointmentStatus(appointmentId);
      if (data.invoices && data.invoices.length > 0) {
        // Get the first invoice ID (or the one for parts)
        const partInvoice = data.invoices.find(inv => 
          inv.status && (inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'unpaid')
        ) || data.invoices[0];
        setInvoiceId(partInvoice.invoiceId);
      }
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết appointment:', err);
    }
  };

  const handlePrint = () => {
    if (!appointmentId) {
      toast.showError('Không tìm thấy mã đơn hàng. Vui lòng thử lại.');
      return;
    }
    
    // Redirect to PDF download endpoint
    // API: GET /api/auth/invoices/{appointmentId}/download
    const downloadUrl = `/api/auth/invoices/${appointmentId}/download`;
    console.log('📄 Đang tải PDF hóa đơn từ:', downloadUrl);
    // Open in new tab to download PDF
    window.open(downloadUrl, '_blank');
  };

  const handleCashPayment = async () => {
    if (!invoiceId) {
      toast.showError('Không tìm thấy mã hóa đơn. Vui lòng thử lại.');
      return;
    }

    if (!window.confirm('Xác nhận thanh toán bằng tiền mặt?\n\nSố tiền: ' + 
      (invoice.parts.reduce((sum, p) => {
        const quantity = p.quantity || p.quantityUsed || 0;
        const unitCost = parseFloat(p.unitCost) || parseFloat(p.price) || 0;
        return sum + (quantity * unitCost);
      }, 0)).toLocaleString('vi-VN') + ' VNĐ')) {
      return;
    }

    try {
      setPaymentLoading(true);
      console.log('💵 Đang xử lý thanh toán tiền mặt cho invoice:', invoiceId);
      await createCashPayment(invoiceId);
      toast.showSuccess('Thanh toán tiền mặt thành công!');
      // Reload invoice to update status
      await fetchInvoice();
      // Close modal after successful payment
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('❌ Lỗi khi thanh toán tiền mặt:', err);
      toast.showError(err.response?.data?.message || 'Không thể thanh toán tiền mặt');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!appointmentId) {
      toast.showError('Không tìm thấy mã đơn hàng. Vui lòng thử lại.');
      return;
    }

    const amount = invoice.parts.reduce((sum, p) => {
      const quantity = p.quantity || p.quantityUsed || 0;
      const unitCost = parseFloat(p.unitCost) || parseFloat(p.price) || 0;
      return sum + (quantity * unitCost);
    }, 0);

    if (!window.confirm('Xác nhận thanh toán bằng chuyển khoản?\n\nBạn sẽ được chuyển đến trang thanh toán online.\n\nSố tiền: ' + 
      amount.toLocaleString('vi-VN') + ' VNĐ')) {
      return;
    }

    try {
      setPaymentLoading(true);
      console.log('💳 Đang tạo thanh toán chuyển khoản cho appointment:', appointmentId);
      const response = await createPartPayment(appointmentId);
      
      // API response structure: { paymentId, invoiceId, amount, method, message, paymentUrl, paymentType }
      if (response.paymentUrl) {
        console.log('🔗 Chuyển đến trang thanh toán VNPay:', response.paymentUrl);
        console.log('📊 Payment info:', {
          paymentId: response.paymentId,
          invoiceId: response.invoiceId,
          amount: response.amount,
          method: response.method,
          paymentType: response.paymentType
        });
        // Redirect to VNPay payment gateway
        window.location.href = response.paymentUrl;
      } else {
        // If no paymentUrl, show error
        console.error('❌ Không có paymentUrl trong response:', response);
        toast.showError(response.message || 'Không thể tạo liên kết thanh toán');
      }
    } catch (err) {
      console.error('❌ Lỗi khi thanh toán chuyển khoản:', err);
      toast.showError(err.response?.data?.message || 'Không thể tạo thanh toán chuyển khoản');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="invoice-modal-header">
          <h2>Hóa đơn dịch vụ</h2>
          <div className="invoice-modal-actions">
            {invoice && (
              <button className="btn-print" onClick={handlePrint}>
                <FaPrint />
                In hóa đơn
              </button>
            )}
            <button className="btn-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="invoice-modal-body">
          {loading ? (
            <div className="invoice-loading">
              <FaSpinner className="spinner" />
              <p>Đang tải hóa đơn...</p>
            </div>
          ) : error ? (
            <div className="invoice-error">
              <p>{error}</p>
            </div>
          ) : invoice ? (
            <div className="invoice-details" id="invoice-content">
              {/* Header */}
              <div className="invoice-header">
                <h1>HÓA ĐƠN DỊCH VỤ</h1>
                <div className="invoice-info">
                  <p><strong>Mã đơn:</strong> #{invoice.appointmentId || appointmentId}</p>
                  {invoice.invoiceDate && (
                    <p><strong>Ngày xuất:</strong> {new Date(invoice.invoiceDate).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="invoice-section">
                <h3>Thông tin khách hàng</h3>
                <div className="invoice-grid">
                  <div>
                    <p><strong>Tên khách hàng:</strong> {invoice.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Xe:</strong> {invoice.vehicleModel || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              {invoice.services && invoice.services.length > 0 && (
                <div className="invoice-section">
                  <h3>Dịch vụ bảo dưỡng</h3>
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Tên dịch vụ</th>
                        <th style={{ width: '40%' }}>Mô tả</th>
                        <th style={{ width: '20%' }} className="text-right">Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.services.map((service, index) => (
                        <tr key={service.id || index}>
                          <td>
                            <div className="service-name">{service.name || 'N/A'}</div>
                            {service.durationEst && (
                              <div className="service-duration">Thời gian: {service.durationEst} phút</div>
                            )}
                          </td>
                          <td>
                            <div className="service-description">
                              {service.description ? (
                                <div className="description-text">
                                  {service.description.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                  ))}
                                </div>
                              ) : (
                                '-'
                              )}
                            </div>
                          </td>
                          <td className="text-right">
                            <span className="service-price">
                              {service.price ? service.price.toLocaleString('vi-VN') : '0'} VNĐ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Parts */}
              {invoice.parts && invoice.parts.length > 0 && (
                <div className="invoice-section">
                  <h3>Linh kiện sửa chữa thêm</h3>
                  <table className="invoice-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Tên linh kiện</th>
                        <th style={{ width: '15%' }} className="text-center">Số lượng</th>
                        <th style={{ width: '20%' }} className="text-right">Đơn giá</th>
                        <th style={{ width: '25%' }} className="text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.parts.map((part, index) => {
                        // API returns: { partId, partName, quantity, price }
                        const quantity = part.quantity || part.quantityUsed || 0;
                        const unitCost = part.unitCost || parseFloat(part.price) || 0;
                        const total = quantity * unitCost;
                        return (
                          <tr key={part.partId || index}>
                            <td>
                              <div className="part-name">{part.partName || part.name || `Part ID: ${part.partId || 'N/A'}`}</div>
                            </td>
                            <td className="text-center">
                              <span className="part-quantity">{quantity}</span>
                            </td>
                            <td className="text-right">
                              <span className="part-unit-cost">
                                {unitCost > 0 ? unitCost.toLocaleString('vi-VN') : '0'} VNĐ
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="part-total-cost">
                                {total.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Summary */}
              <div className="invoice-summary">
                <div className="summary-header">
                  <h4>Tổng kết hóa đơn</h4>
                  <p className="summary-note">Phần dịch vụ đã được thanh toán trước</p>
                </div>
                
                <div className="summary-row paid-row">
                  <div className="summary-label-group">
                    <span className="summary-label">Tổng dịch vụ:</span>
                    <span className="paid-badge">Đã thanh toán</span>
                  </div>
                  <span className="summary-value paid-value">
                    {(invoice.services?.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) || 0).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                
                {invoice.parts && invoice.parts.length > 0 && (
                  <>
                    <div className="summary-row payment-due-row">
                      <div className="summary-label-group">
                        <span className="summary-label">Tổng linh kiện:</span>
                        <span className="payment-due-badge">Cần thanh toán</span>
                      </div>
                      <span className="summary-value payment-due-value">
                        {(invoice.parts.reduce((sum, p) => {
                          // API returns: { partId, partName, quantity, price }
                          const quantity = p.quantity || p.quantityUsed || 0;
                          const unitCost = parseFloat(p.unitCost) || parseFloat(p.price) || 0;
                          return sum + (quantity * unitCost);
                        }, 0)).toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                    
                    {/* Divider */}
                    <div className="summary-divider"></div>
                    
                    {/* Total amount due */}
                    <div className="summary-total-row">
                      <span className="summary-total-label">Tổng cộng hóa đơn:</span>
                      <span className="summary-total-value">
                        {(() => {
                          const servicesTotal = invoice.services?.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) || 0;
                          const partsTotal = invoice.parts?.reduce((sum, p) => {
                            const quantity = p.quantity || p.quantityUsed || 0;
                            const unitCost = parseFloat(p.unitCost) || parseFloat(p.price) || 0;
                            return sum + (quantity * unitCost);
                          }, 0) || 0;
                          return (servicesTotal + partsTotal).toLocaleString('vi-VN');
                        })()} VNĐ
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Due Section */}
              {invoice.parts && invoice.parts.length > 0 && (
                <>
                  <div className="invoice-payment-due">
                    <div className="payment-due-header">
                      <span className="payment-due-icon">💳</span>
                      <div>
                        <h3 className="payment-due-title">Số tiền cần thanh toán</h3>
                        <p className="payment-due-subtitle">Chỉ thanh toán phần linh kiện sửa chữa thêm</p>
                      </div>
                    </div>
                    <div className="payment-due-amount">
                      {(invoice.parts.reduce((sum, p) => {
                        const quantity = p.quantity || p.quantityUsed || 0;
                        const unitCost = parseFloat(p.unitCost) || parseFloat(p.price) || 0;
                        return sum + (quantity * unitCost);
                      }, 0)).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="invoice-payment-buttons">
                    <button
                      className="btn-payment btn-payment-cash"
                      onClick={handleCashPayment}
                      disabled={paymentLoading || !invoiceId}
                    >
                      {paymentLoading ? (
                        <>
                          <FaSpinner className="spinner" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <FaMoneyBillWave />
                          Thanh toán tiền mặt
                        </>
                      )}
                    </button>
                    <button
                      className="btn-payment btn-payment-transfer"
                      onClick={handleBankTransfer}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <>
                          <FaSpinner className="spinner" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <FaCreditCard />
                          Thanh toán chuyển khoản
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="invoice-footer">
                <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
              </div>
            </div>
          ) : (
            <div className="invoice-empty">
              <p>Không có dữ liệu hóa đơn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

