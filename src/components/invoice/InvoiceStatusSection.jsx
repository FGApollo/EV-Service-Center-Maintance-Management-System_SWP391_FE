import React from 'react';
import { FaCheckCircle, FaClock, FaFileInvoice } from 'react-icons/fa';
import './InvoiceStatusSection.css';

const InvoiceStatusSection = ({ invoices = [], appointmentId = null }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="invoice-status-section">
        <div className="invoice-status-header">
          <h3>
            <FaFileInvoice />
            Trạng thái hóa đơn
          </h3>
          {appointmentId && (
            <span className="appointment-id-badge">Đơn #{appointmentId}</span>
          )}
        </div>
        <div className="invoice-status-empty">
          <p>Chưa có hóa đơn nào cho đơn hàng này</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'paid' || statusLower === 'completed') {
      return (
        <span className="invoice-status-badge paid">
          <FaCheckCircle />
          Đã thanh toán
        </span>
      );
    }
    return (
      <span className="invoice-status-badge pending">
        <FaClock />
        Chưa thanh toán
      </span>
    );
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
    } catch (e) {
      return 'N/A';
    }
  };

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0);
  const paidAmount = invoices
    .filter(inv => {
      const status = (inv.status || '').toLowerCase();
      return status === 'paid' || status === 'completed';
    })
    .reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0);
  const unpaidAmount = totalAmount - paidAmount;

  return (
    <div className="invoice-status-section">
      <div className="invoice-status-header">
        <h3>
          <FaFileInvoice />
          Trạng thái hóa đơn
        </h3>
        {appointmentId && (
          <span className="appointment-id-badge">Đơn #{appointmentId}</span>
        )}
      </div>

      <div className="invoice-status-content">
        <div className="invoice-status-list">
          {invoices
            .sort((a, b) => {
              const idA = parseInt(a.invoiceId) || 0;
              const idB = parseInt(b.invoiceId) || 0;
              return idB - idA; // Sắp xếp giảm dần (số lớn hơn ở trên)
            })
            .map((invoice, index) => (
            <div key={invoice.invoiceId || index} className="invoice-status-item">
              <div className="invoice-status-main">
                <div className="invoice-status-info">
                  <div className="invoice-id">
                    <strong>Hóa đơn #{invoice.invoiceId || index + 1}</strong>
                  </div>
                  {invoice.serviceName && (
                    <div className="invoice-service">
                      Dịch vụ: {invoice.serviceName}
                    </div>
                  )}
                  <div className="invoice-amount">
                    Số tiền: <span className="amount-value">{parseFloat(invoice.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  {invoice.paymentDate && (
                    <div className="invoice-payment-date">
                      Ngày thanh toán: {formatDate(invoice.paymentDate)}
                    </div>
                  )}
                  {invoice.createdAt && (
                    <div className="invoice-created-date">
                      Ngày tạo: {formatDate(invoice.createdAt)}
                    </div>
                  )}
                </div>
                <div className="invoice-status-badge-container">
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="invoice-status-summary">
        <div className="summary-item">
          <span className="summary-label">Tổng số hóa đơn:</span>
          <span className="summary-value">{invoices.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tổng giá trị:</span>
          <span className="summary-value">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Đã thanh toán:</span>
          <span className="summary-value paid">{paidAmount.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        {unpaidAmount > 0 && (
          <div className="summary-item">
            <span className="summary-label">Chưa thanh toán:</span>
            <span className="summary-value unpaid">{unpaidAmount.toLocaleString('vi-VN')} VNĐ</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusSection;

