import React, { useState } from 'react';
import { FaEye, FaSearch, FaFileInvoice, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './InvoicesTable.css';

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
    year: 'numeric'
  });
};

export const InvoicesTable = ({ invoices, onViewDetail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const invoiceId = String(invoice.invoiceId || '');
    const customerName = (invoice.customerName || '').toLowerCase();
    const serviceName = (invoice.serviceName || '').toLowerCase();
    const status = (invoice.status || 'paid').toLowerCase();
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      invoiceId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      serviceName.includes(searchLower);

    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="invoices-table-container">
      {/* Search & Filter Bar */}
      <div className="invoices-table-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, khách hàng, gói bảo dưỡng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">Tất cả</option>
            <option value="paid">Đã thanh toán</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="overdue">Quá hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="invoices-table-wrapper">
        {filteredInvoices.length === 0 ? (
          <div className="no-data">
            <FaFileInvoice className="no-data-icon" />
            <p>Không tìm thấy hóa đơn nào</p>
          </div>
        ) : (
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Mã HĐ</th>
                <th>Khách hàng</th>
                <th>Gói bảo dưỡng</th>
                <th>Ngày tạo</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => {
                const invoiceId = invoice.invoiceId || 'N/A';
                const customerName = invoice.customerName || 'N/A';
                const serviceName = invoice.serviceName || 'N/A';
                const totalAmount = invoice.totalAmount || 0;
                const createdAt = invoice.createdAt;
                const status = (invoice.status || 'paid').toLowerCase();

                return (
                  <tr key={index}>
                    <td>
                      <div className="invoice-id-cell">
                        <FaFileInvoice className="invoice-icon" />
                        <span>#{invoiceId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <strong>{customerName}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="service-cell">
                        <strong style={{color: '#667eea'}}>{serviceName}</strong>
                      </div>
                    </td>
                    <td>{formatDate(createdAt)}</td>
                    <td>
                      <strong className="amount-cell">{formatCurrency(totalAmount)}</strong>
                    </td>
                    <td>
                      <span className={`status-badge status-${status}`}>
                        {(status === 'paid' || status === 'completed') && <FaCheckCircle />}
                        {(status === 'pending' || status === 'unpaid' || status === 'overdue') && <FaExclamationCircle />}
                        {status === 'paid' || status === 'completed' ? 'Đã thanh toán' : 
                         status === 'pending' ? 'Chờ thanh toán' :
                         status === 'unpaid' ? 'Chưa thanh toán' :
                         status === 'overdue' ? 'Quá hạn' :
                         status === 'cancelled' ? 'Đã hủy' : status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => onViewDetail(invoice)}
                        title="Xem chi tiết"
                      >
                        <FaEye /> Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      {filteredInvoices.length > 0 && (
        <div className="table-footer">
          <p>Hiển thị <strong>{filteredInvoices.length}</strong> hóa đơn</p>
        </div>
      )}
    </div>
  );
};

