import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import './CustomerModal.css';

/**
 * CustomerModal Component
 * Modal để thêm mới hoặc chỉnh sửa khách hàng
 * 
 * Props:
 * - show: boolean - Hiển thị modal hay không
 * - mode: 'add' | 'edit' - Chế độ thêm hoặc sửa
 * - customer: object | null - Dữ liệu khách hàng (nếu mode = 'edit')
 * - onClose: function - Đóng modal
 * - onSave: function - Callback khi save (nhận formData)
 * - saving: boolean - Trạng thái đang lưu
 */
export const CustomerModal = ({ show, mode = 'add', customer, onClose, onSave, saving = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Reset form khi modal mở/đóng hoặc customer thay đổi
  useEffect(() => {
    if (show) {
      if (mode === 'edit' && customer) {
        setFormData({
          fullName: customer.fullName || customer.name || '',
          email: customer.email || '',
          phone: customer.phone || '',
          password: '' // Không hiển thị password cũ
        });
      } else {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: ''
        });
      }
      setErrors({});
    }
  }, [show, mode, customer]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập tên khách hàng';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Tên phải có ít nhất 2 ký tự';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    // Validate password (chỉ khi thêm mới hoặc muốn đổi password)
    if (mode === 'add') {
      if (!formData.password) {
        newErrors.password = 'Vui lòng nhập mật khẩu';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    } else if (mode === 'edit' && formData.password && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự (hoặc để trống nếu không đổi)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error khi user typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Chuẩn bị data để gửi
    const dataToSend = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim().replace(/\s/g, '')
    };

    // Chỉ gửi password nếu:
    // - Mode = add (bắt buộc)
    // - Mode = edit VÀ user đã nhập password mới
    if (mode === 'add' || (mode === 'edit' && formData.password)) {
      dataToSend.password = formData.password;
    }

    // Nếu edit, cần gửi kèm ID
    if (mode === 'edit' && customer) {
      dataToSend.id = customer.id;
    }

    onSave(dataToSend);
  };

  // Handle close
  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content customer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>
            <FaUser />
            {mode === 'add' ? 'Thêm khách hàng mới' : 'Chỉnh sửa khách hàng'}
          </h2>
          <button 
            className="close-btn" 
            onClick={handleClose}
            disabled={saving}
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Full Name */}
          <div className="form-group">
            <label>
              <FaUser />
              Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên khách hàng"
              className={errors.fullName ? 'error' : ''}
              disabled={saving}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              <FaEnvelope />
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={errors.email ? 'error' : ''}
              disabled={saving || mode === 'edit'} // Email không thể sửa
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            {mode === 'edit' && <span className="field-note">Email không thể thay đổi</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>
              <FaPhone />
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0xxxxxxxxx"
              className={errors.phone ? 'error' : ''}
              disabled={saving}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>
              <FaLock />
              Mật khẩu {mode === 'add' ? <span className="required">*</span> : '(Tùy chọn)'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={mode === 'add' ? 'Nhập mật khẩu' : 'Để trống nếu không đổi'}
              className={errors.password ? 'error' : ''}
              disabled={saving}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {mode === 'edit' && !errors.password && (
              <span className="field-note">Chỉ nhập nếu muốn đổi mật khẩu</span>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleClose}
              disabled={saving}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving}
            >
              {saving ? '⏳ Đang lưu...' : (mode === 'add' ? '✅ Thêm khách hàng' : '💾 Lưu thay đổi')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
