import React, { useState } from 'react';
import { FaFileInvoice, FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useInvoices } from '../../hooks/useInvoices';
import { InvoicesTable } from './InvoicesTable';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import './Invoices.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

export const InvoicesTab = () => {
  const { invoices, loading, error, refetch, fetchInvoiceDetail } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Calculate stats
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => {
    const status = (inv.status || 'paid').toLowerCase();
    return status === 'paid' || status === 'completed';
  }).length;
  const unpaidInvoices = invoices.filter(inv => {
    const status = (inv.status || 'paid').toLowerCase();
    return status === 'unpaid' || status === 'pending';
  }).length;
  const totalRevenue = invoices.reduce((sum, inv) => {
    const status = (inv.status || 'paid').toLowerCase();
    if (status === 'paid' || status === 'completed') {
      return sum + (inv.totalAmount || 0);
    }
    return sum;
  }, 0);

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
  };

  if (loading) {
    return (
      <div className="invoices-section">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>⏳ Đang tải danh sách hóa đơn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isTokenError = error.toLowerCase().includes('token') || error.toLowerCase().includes('hết hạn');
    
    return (
      <div className="invoices-section">
        <div className="error-message">
          <FaFileInvoice size={60} className="error-icon" />
          <h3>Lỗi tải danh sách hóa đơn</h3>
          <p>{error}</p>
          {!isTokenError && (
            <button onClick={refetch} className="retry-btn">
              🔄 Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="invoices-section">
      {/* Stats Cards */}
      <div className="invoices-stats">
        <div className="stat-card total-invoices">
          <div className="stat-icon">
            <FaFileInvoice />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalInvoices}</div>
            <div className="stat-label">Tổng hóa đơn</div>
          </div>
        </div>

        <div className="stat-card paid-invoices">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{paidInvoices}</div>
            <div className="stat-label">Đã thanh toán</div>
          </div>
        </div>

        <div className="stat-card unpaid-invoices">
          <div className="stat-icon">
            <FaExclamationCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{unpaidInvoices}</div>
            <div className="stat-label">Chưa thanh toán</div>
          </div>
        </div>

        <div className="stat-card total-revenue">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(totalRevenue)}</div>
            <div className="stat-label">Tổng doanh thu</div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <InvoicesTable 
        invoices={invoices} 
        onViewDetail={handleViewDetail}
      />

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={handleCloseModal}
          fetchInvoiceDetail={fetchInvoiceDetail}
        />
      )}
    </div>
  );
};

