import React, { useState } from 'react';
import './BookingPage.css';

function BookingPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    carBrand: '',
    carModel: '',
    licensePlate: '',
    serviceType: '',
    appointmentDate: '',
    appointmentTime: '',
    branchLocation: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const serviceTypes = [
    { value: 'oil-change', label: 'Thay dầu động cơ' },
    { value: 'brake-service', label: 'Bảo dưỡng phanh' },
    { value: 'engine-repair', label: 'Sửa chữa động cơ' },
    { value: 'electrical-system', label: 'Hệ thống điện' },
    { value: 'air-conditioning', label: 'Điều hòa & làm mát' },
    { value: 'exterior-care', label: 'Chăm sóc ngoại thất' },
    { value: 'general-maintenance', label: 'Bảo dưỡng tổng quát' }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const branches = [
    { value: 'quan1', label: 'Chi nhánh Quận 1' },
    { value: 'thuduc', label: 'Chi nhánh Thủ Đức' },
    { value: 'tanbinh', label: 'Chi nhánh Tân Bình' },
    { value: 'binhthạnh', label: 'Chi nhánh Bình Thạnh' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.carBrand.trim()) newErrors.carBrand = 'Vui lòng nhập hãng xe';
    if (!formData.carModel.trim()) newErrors.carModel = 'Vui lòng nhập dòng xe';
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'Vui lòng nhập biển số xe';
    if (!formData.serviceType) newErrors.serviceType = 'Vui lòng chọn loại dịch vụ';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Vui lòng chọn ngày hẹn';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Vui lòng chọn giờ hẹn';
    if (!formData.branchLocation) newErrors.branchLocation = 'Vui lòng chọn chi nhánh';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Validate appointment date (not in the past)
    if (formData.appointmentDate) {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Ngày hẹn không thể trong quá khứ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Booking submitted:', formData);
      alert('Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận.');
      
      // Reset form
      setFormData({
        customerName: '',
        phone: '',
        email: '',
        carBrand: '',
        carModel: '',
        licensePlate: '',
        serviceType: '',
        appointmentDate: '',
        appointmentTime: '',
        branchLocation: '',
        notes: ''
      });
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="booking-container">
      {/* Back to Home Button */}
      <button 
        className="back-to-home-btn"
        onClick={() => onNavigate('home')}
        title="Quay về trang chủ"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
        </svg>
        <span>Trang chủ</span>
      </button>

      {/* Background */}
      <div className="booking-background">
        <div className="booking-bg-overlay"></div>
      </div>

      {/* Booking Form */}
      <div className="booking-content">
        <div className="booking-wrapper">
          {/* Header */}
          <div className="booking-header">
            <h1>Đặt Lịch Hẹn</h1>
            <p>Đặt lịch bảo dưỡng xe của bạn một cách nhanh chóng và tiện lợi</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="booking-form">
            {/* Customer Information */}
            <div className="form-section">
              <h3>Thông Tin Khách Hàng</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">Họ và tên *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={errors.customerName ? 'error' : ''}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.customerName && <span className="error-message">{errors.customerName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="0901234567"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="example@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="form-section">
              <h3>Thông Tin Xe</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="carBrand">Hãng xe *</label>
                  <input
                    type="text"
                    id="carBrand"
                    name="carBrand"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    className={errors.carBrand ? 'error' : ''}
                    placeholder="Honda, Toyota, Mazda..."
                  />
                  {errors.carBrand && <span className="error-message">{errors.carBrand}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="carModel">Dòng xe *</label>
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className={errors.carModel ? 'error' : ''}
                    placeholder="City, Vios, CX-5..."
                  />
                  {errors.carModel && <span className="error-message">{errors.carModel}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="licensePlate">Biển số xe *</label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className={errors.licensePlate ? 'error' : ''}
                  placeholder="51A-12345"
                />
                {errors.licensePlate && <span className="error-message">{errors.licensePlate}</span>}
              </div>
            </div>

            {/* Service Information */}
            <div className="form-section">
              <h3>Thông Tin Dịch Vụ</h3>
              <div className="form-group">
                <label htmlFor="serviceType">Loại dịch vụ *</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className={errors.serviceType ? 'error' : ''}
                >
                  <option value="">Chọn loại dịch vụ</option>
                  {serviceTypes.map(service => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointmentDate">Ngày hẹn *</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className={errors.appointmentDate ? 'error' : ''}
                    min={getMinDate()}
                  />
                  {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="appointmentTime">Giờ hẹn *</label>
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className={errors.appointmentTime ? 'error' : ''}
                  >
                    <option value="">Chọn giờ hẹn</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="branchLocation">Chi nhánh *</label>
                <select
                  id="branchLocation"
                  name="branchLocation"
                  value={formData.branchLocation}
                  onChange={handleInputChange}
                  className={errors.branchLocation ? 'error' : ''}
                >
                  <option value="">Chọn chi nhánh</option>
                  {branches.map(branch => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
                {errors.branchLocation && <span className="error-message">{errors.branchLocation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="notes">Ghi chú thêm</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Mô tả tình trạng xe hoặc yêu cầu đặc biệt..."
                  rows={4}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                </svg>
                Đặt Lịch Hẹn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;