import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './UserModal.css';

export const UserModal = ({ mode, user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: 'STAFF',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        role: user.role || 'STAFF',
        password: '',
        confirmPassword: ''
      });
    }
  }, [mode, user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }

    if (mode === 'add') {
      if (!formData.password) {
        newErrors.password = 'Mật khẩu không được để trống';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Remove confirmPassword before sending
    const { confirmPassword, ...dataToSend } = formData;
    
    // Remove password if editing and password is empty
    if (mode === 'edit' && !formData.password) {
      delete dataToSend.password;
    }

    onSave(dataToSend);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
        <div className="modal-header">
          <h2>{mode === 'add' ? '➕ Thêm người dùng mới' : '✏️ Chỉnh sửa người dùng'}</h2>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Full Name */}
          <div className="form-group">
            <label>
              Họ tên <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={mode === 'edit'} // Email không được sửa
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>
              Số điện thoại <span style={{color: 'red'}}>*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="0912345678"
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Địa chỉ đầy đủ"
              rows={3}
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label>
              Vai trò <span style={{color: 'red'}}>*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STAFF">Nhân viên (Staff)</option>
              <option value="MANAGER">Quản lý (Manager)</option>
              <option value="TECHNICIAN">Kỹ thuật viên (Technician)</option>
            </select>
          </div>

          {/* Password (only for add mode) */}
          {mode === 'add' && (
            <>
              <div className="form-group">
                <label>
                  Mật khẩu <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>
                  Xác nhận mật khẩu <span style={{color: 'red'}}>*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </>
          )}

          {mode === 'edit' && (
            <div style={{padding: '12px', background: '#fef3c7', borderRadius: '8px', marginBottom: '16px'}}>
              <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
                💡 <strong>Lưu ý:</strong> Email không thể thay đổi. Để đổi mật khẩu, vui lòng sử dụng chức năng "Đổi mật khẩu" riêng.
              </p>
            </div>
          )}

          <div className="modal-footer" style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#e5e7eb',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {mode === 'add' ? '➕ Thêm' : '💾 Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
