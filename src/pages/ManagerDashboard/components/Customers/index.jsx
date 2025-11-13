import React, { useState } from 'react';
import { FaSearch, FaPlus, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEye, FaEdit, FaTimes } from 'react-icons/fa';
import { useCustomers } from '../../hooks/useCustomers';
import { CustomerModal } from './CustomerModal';

export const CustomersTab = () => {
  const { customers, loading, error, addCustomer, editCustomer, removeCustomer } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debug log
  console.log('CustomersTab render:', { 
    customers, 
    loading, 
    error,
    customersLength: customers?.length,
    customersType: typeof customers,
    isArray: Array.isArray(customers)
  });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddCustomer = () => {
    setModalMode('add');
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleViewCustomer = (customer) => {
    alert(`Xem chi tiết khách hàng: ${customer.fullName || customer.name}`);
  };

  const handleEditCustomer = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      return;
    }

    const result = await removeCustomer(customerId);
    if (result.success) {
      alert('✅ Đã xóa khách hàng thành công');
    } else {
      alert(`❌ Lỗi: ${result.error}`);
    }
  };

  const handleSaveCustomer = async (formData) => {
    setSaving(true);
    
    try {
      let result;
      if (modalMode === 'add') {
        result = await addCustomer(formData);
      } else {
        result = await editCustomer(formData);
      }

      if (result.success) {
        alert(modalMode === 'add' ? '✅ Thêm khách hàng thành công!' : '✅ Cập nhật khách hàng thành công!');
        setShowModal(false);
      } else {
        alert(`❌ Lỗi: ${result.error || 'Không thể lưu khách hàng'}`);
      }
    } catch (err) {
      alert(`❌ Lỗi: ${err.message || 'Có lỗi xảy ra'}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    searchQuery === '' || 
    customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customers-section">
      <div className="section-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng (tên, email, SĐT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={handleAddCustomer}>
          <FaPlus />
          Thêm khách hàng
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          <p>⏳ Đang tải dữ liệu khách hàng từ API...</p>
        </div>
      )}

      {!loading && customers.length === 0 && (
        <div className="empty-message">
          <p>📭 Chưa có khách hàng nào trong hệ thống</p>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="customers-grid">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">
                  <FaUser />
                </div>
                <div>
                  <h3>{customer.fullName || customer.name || customer.username}</h3>
                  <p>ID: #{customer.id}</p>
                </div>
              </div>
              
              <div className="customer-info">
                <div className="info-row">
                  <FaEnvelope />
                  <span>{customer.email}</span>
                </div>
                <div className="info-row">
                  <FaPhone />
                  <span>{customer.phone}</span>
                </div>
                {customer.joinDate && (
                  <div className="info-row">
                    <FaCalendarAlt />
                    <span>Tham gia: {new Date(customer.joinDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>
              
              <div className="customer-actions">
                <button 
                  className="btn-view"
                  onClick={() => handleViewCustomer(customer)}
                  title="Xem chi tiết"
                >
                  <FaEye />
                </button>
                <button 
                  className="btn-edit"
                  onClick={() => handleEditCustomer(customer)}
                  title="Chỉnh sửa"
                >
                  <FaEdit />
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteCustomer(customer.id)}
                  title="Xóa"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Modal */}
      <CustomerModal
        show={showModal}
        mode={modalMode}
        customer={selectedCustomer}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCustomer}
        saving={saving}
      />
    </div>
  );
};
