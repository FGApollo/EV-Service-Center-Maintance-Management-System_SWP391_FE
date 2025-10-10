import React, { useState } from 'react';
import './BookingPage.css';

function BookingPage({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Info
    licensePlate: '',
    vehicleModel: '',
    mileage: '',
    
    // Step 2: Dealer
    selectedDealer: '',
    
    // Step 3: Services
    selectedServices: [],
    
    // Step 4: Schedule
    selectedDate: null,
    selectedTime: '',
    
    // Step 5: Personal Info
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  const totalSteps = 4;

  const services = [
    {
      id: 'maintenance-eq-regular',
      name: 'Bảo dưỡng hệ thống thắng - xe EQ',
      category: 'Bảo dưỡng',
      icon: '🔧',
      price: '2,500,000 VNĐ',
      description: 'Kiểm tra và bảo dưỡng hệ thống thắng chuyên dụng cho xe điện'
    },
    {
      id: 'maintenance-eq-a', 
      name: 'BẢO DƯỠNG A - Dòng xe EQ',
      category: 'Bảo dưỡng',
      icon: '⚡',
      price: '3,200,000 VNĐ',
      description: 'Bảo dưỡng toàn diện cơ bản cho xe điện EQ'
    },
    {
      id: 'maintenance-eq-b',
      name: 'Bảo Dưỡng B - Dòng xe EQ',
      category: 'Bảo dưỡng',
      icon: '🔋',
      price: '4,500,000 VNĐ',
      description: 'Bảo dưỡng nâng cao với kiểm tra hệ thống pin và động cơ điện'
    },
    {
      id: 'rain-sensor',
      name: 'Thay cao su gạt mưa xe EQ',
      category: 'Bảo dưỡng',
      icon: '🌧️',
      price: '850,000 VNĐ',
      description: 'Thay thế gạt mưa chính hãng'
    },
    {
      id: 'tire-work',
      name: 'Công việc khác cho xe EQ',
      category: 'Các chào giá khác',
      icon: '⚙️',
      price: 'Liên hệ',
      description: 'Dịch vụ tùy chỉnh theo yêu cầu'
    }
  ];

  const dealers = [
    {
      id: 'dealer-1',
      name: 'Công ty TNHH Vinamotor Nghệ An',
      address: 'Ngã Tư Sân Bay Vinh, Phường Vinh Phú',
      city: '460000 Nghệ An'
    }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', formData);
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    onNavigate('home');
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Thông tin xe của bạn';
      case 2: return 'Chọn một hoặc nhiều dịch vụ';
      case 3: return 'Lịch hẹn';
      case 4: return 'Chi tiết cá nhân';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch(currentStep) {
      case 1: return 'Đối với một đề nghị dịch vụ rõng bước, chúng tôi cần một số thông tin về xe của bạn.';
      case 2: return 'Chọn một hoặc nhiều dịch vụ.';
      case 3: return 'Kiểm tra các cuộc hẹn có sẵn và chọn một cuộc hẹn phù hợp với lịch trình của bạn';
      case 4: return 'Chúng tôi chỉ cần một số thông tin về bạn.';
      default: return '';
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const renderStep1 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>
          <span className="form-section-icon">🚗</span>
          Thông tin xe
        </h2>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Số VIN</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập biển số xe"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value)}
            />
          </div>  
          
          <div className="form-group full-width">
            <label>Quãng đường đi</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập số km"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
            />
            <span className="form-helper-text">Không bắt buộc</span>
          </div>
        </div>
      </div>

      {formData.licensePlate && (
        <div className="form-section">
          <div className="sidebar-item">
            <div className="sidebar-item-content">
              <h4>Mercedes-Benz Xe ô tô con Điện</h4>
              <p>{formData.licensePlate}</p>
          </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>
          <span className="form-section-icon">🔧</span>
          Bảo dưỡng
        </h2>
        <div className="selection-grid">
            {services.filter(s => s.category === 'Bảo dưỡng').map(service => (
              <div 
                key={service.id}
              className={`selection-card ${formData.selectedServices.includes(service.id) ? 'selected' : ''}`}
                onClick={() => handleServiceToggle(service.id)}
              >
              <div className="selection-card-header">
                <span className="selection-card-icon">{service.icon}</span>
                    <input
                      type="checkbox"
                  className="selection-checkbox"
                      checked={formData.selectedServices.includes(service.id)}
                  onChange={() => {}}
                />
              </div>
              <h3>{service.name}</h3>
              <div className="selection-card-price">{service.price}</div>
              <button className="selection-card-details" onClick={(e) => e.stopPropagation()}>
                Chi tiết
              </button>
              </div>
            ))}
          </div>
        </div>

      <div className="form-section">
        <h2>
          <span className="form-section-icon">💬</span>
          Các chào giá khác
        </h2>
        <div className="selection-grid">
          {services.filter(s => s.category === 'Các chào giá khác').map(service => (
              <div 
                key={service.id}
              className={`selection-card ${formData.selectedServices.includes(service.id) ? 'selected' : ''}`}
                onClick={() => handleServiceToggle(service.id)}
              >
              <div className="selection-card-header">
                <span className="selection-card-icon">{service.icon}</span>
                    <input
                      type="checkbox"
                  className="selection-checkbox"
                      checked={formData.selectedServices.includes(service.id)}
                  onChange={() => {}}
                />
              </div>
              <h3>{service.name}</h3>
              <button className="selection-card-details" onClick={(e) => e.stopPropagation()}>
                Chi tiết
              </button>
              </div>
            ))}
        </div>

        <div className="form-section" style={{ marginTop: '2rem', background: '#f9fafb' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>💡 Không chắc chắn bạn cần gì?</h3>
          <div className="form-group full-width">
            <label>Nhận trợ giúp về các dịch vụ</label>
            <textarea
              className="form-input"
              placeholder="Tin nhắn"
              rows="4"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>
          <span className="form-section-icon">📅</span>
          Cả Văn Dịch Vụ
        </h2>
        
        <div className="form-group">
          <label>Không ưa thích</label>
          <select className="form-select">
            <option>Không ưa thích</option>
          </select>
          <span className="form-helper-text">Không bắt buộc</span>
        </div>

        <div className="calendar-section">
          <div className="calendar-header">
            <h3>tháng 10 năm 2025</h3>
            <div className="calendar-nav-btns">
              <button className="calendar-nav-btn">‹</button>
              <button className="calendar-nav-btn">›</button>
            </div>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              <div className="calendar-weekday">Th 2</div>
              <div className="calendar-weekday">Th 3</div>
              <div className="calendar-weekday">Th 4</div>
              <div className="calendar-weekday">Th 5</div>
              <div className="calendar-weekday">Th 6</div>
              <div className="calendar-weekday">Th 7</div>
              <div className="calendar-weekday">CN</div>
            </div>

            <div className="calendar-days">
              {generateCalendarDays().map((day, index) => (
              <button
                  key={index}
                  className={`calendar-day ${!day ? 'disabled' : ''} ${
                    formData.selectedDate === day ? 'selected' : ''
                  } ${day && day >= new Date().getDate() ? 'available' : ''}`}
                  onClick={() => day && handleInputChange('selectedDate', day)}
                  disabled={!day || day < new Date().getDate()}
                >
                  {day || ''}
              </button>
            ))}
            </div>
          </div>
        </div>

        {formData.selectedDate && (
          <div className="time-slots-section">
            <h4>Không thời gian khả dụng</h4>
            <div className="time-slots-grid">
              {timeSlots.map(time => (
                <button
                  key={time}
                  className={`time-slot ${formData.selectedTime === time ? 'selected' : ''}`}
                  onClick={() => handleInputChange('selectedTime', time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>Làm thế nào chúng tôi có thể liên lạc với bạn?</h2>
        <div className="contact-form">
          <div className="form-grid">
            <div className="form-group">
          <label>Tên</label>
          <input
            type="text"
                className="form-input"
                placeholder="Tên"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
        </div>

            <div className="form-group">
          <label>Họ</label>
          <input
            type="text"
                className="form-input"
                placeholder="Họ"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
        </div>

            <div className="form-group full-width">
          <label>Công ty</label>
          <input
            type="text"
                className="form-input"
                placeholder="Công ty"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
          />
              <span className="form-helper-text">Không bắt buộc</span>
        </div>

            <div className="form-group full-width">
          <label>Email</label>
          <input
            type="email"
                className="form-input"
                placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

            <div className="form-group full-width">
              <label>Điện thoại</label>
              <div className="phone-input-group">
                <select className="country-code-select">
                  <option>VN (+84)</option>
            </select>
            <input
              type="tel"
                  className="form-input"
                  placeholder="Điện thoại"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="expandable-section">
        <div className="expandable-header">
          <h3>
            Địa chỉ của bạn là gì?
            <span className="expandable-required">(Không bắt buộc)</span>
          </h3>
          <div className="expandable-toggle">▼</div>
        </div>
      </div>

      <div className="expandable-section">
        <div className="expandable-header">
          <h3>
            Bật ký ý kiến cho đối tác Mercedes-Benz của bạn?
            <span className="expandable-required">(Không bắt buộc)</span>
          </h3>
          <div className="expandable-toggle">▼</div>
        </div>
      </div>

      <div className="privacy-notice">
        <h4>Quyền riêng tư của bạn là ưu tiên của chúng tôi</h4>
        <p>
          Bạn có thể tham khảo Chính sách bảo mật <a href="#">tại đây</a>.
        </p>
      </div>

      <div className="checkbox-item">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreeToTerms}
          onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
        />
        <label htmlFor="terms" className="checkbox-label">
          Tôi hiểu rằng Dữ liệu liên quan sau khi khách hàng và phương tiện được thu thập trong quá trình đặt chỗ sẽ được chuyển tiếp đến Xưởng dịch vụ ủy quyền Mercedes-Benz liên quan sau khi hoàn thành đặt chỗ. Tôi đã đọc và đồng thuận với tất cả các điều khoản và điều kiện được đề cập trong Luật và Dữ liệu Cá nhân.
        </label>
      </div>
    </div>
  );

  const renderSidebar = () => {
    const selectedServicesData = services.filter(s => 
      formData.selectedServices.includes(s.id)
    );

    return (
      <div className="booking-right-sidebar">
        <div className="progress-percentage">
          Đã hoàn thành {Math.round(getProgressPercentage())}%
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {formData.licensePlate && (
          <div className="sidebar-section">
            <h3>Xe</h3>
            <div className="sidebar-item">
              <div className="sidebar-item-content">
                <h4>Mercedes-Benz Xe ô tô con Điện</h4>
            <p>{formData.licensePlate}</p>
              </div>
              {currentStep > 1 && (
                <button 
                  className="sidebar-edit-btn"
                  onClick={() => setCurrentStep(1)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {dealers.length > 0 && currentStep >= 2 && (
          <div className="sidebar-section">
            <h3>Đại lý ủy quyền Mercedes-Benz</h3>
            <div className="sidebar-item">
              <div className="sidebar-item-content">
                <h4>{dealers[0].name}</h4>
              </div>
            </div>
          </div>
        )}

        {selectedServicesData.length > 0 && (
          <div className="sidebar-section">
            <h3>Dịch vụ</h3>
            {selectedServicesData.map(service => (
              <div key={service.id} className="sidebar-item">
                <div className="sidebar-item-content">
                  <h4>{service.name}</h4>
                </div>
                {currentStep > 2 && (
                  <button 
                    className="sidebar-edit-btn"
                    onClick={() => setCurrentStep(2)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {formData.selectedDate && formData.selectedTime && (
          <div className="sidebar-section">
            <h3>Ngày và giờ</h3>
            <div className="sidebar-item">
              <div className="sidebar-item-content">
                <h4>Thứ Sáu, {formData.selectedDate} thg 10 2025, {formData.selectedTime}</h4>
              </div>
              {currentStep > 3 && (
                <button 
                  className="sidebar-edit-btn"
                  onClick={() => setCurrentStep(3)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {formData.firstName && formData.lastName && (
          <div className="sidebar-section">
            <h3>Chi tiết cá nhân</h3>
          </div>
        )}

        {selectedServicesData.length > 0 && (
          <div className="sidebar-total">
            <h3>Tổng cộng</h3>
            <div className="sidebar-total-price">Giá theo yêu cầu</div>
            <p>Chỉ phí bổ sung có thể được áp dụng. Thành toán sẽ chỉ được thực hiện sau khi bạn chấp thuận với Đối tác Mercedes-Benz của bạn.</p>
        </div>
        )}
    </div>
  );
  };

  return (
    <div className="tesla-booking-container">
      {/* Back to Home Button */}
      <button 
        className="back-to-home-btn"
        onClick={() => onNavigate('home')}
        title="Quay về trang chủ"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
        </svg>
        <span>Đặt lịch bảo dưỡng</span>
      </button>

      {/* Top Header */}
      <div className="booking-top-header">
        <div className="booking-top-content">
          <div className="booking-breadcrumb">
            Đặt lịch bảo dưỡng › <span>{getStepTitle()}</span>
          </div>
          <button 
            className="booking-next-btn"
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={
              (currentStep === 1 && !formData.licensePlate) ||
              (currentStep === 2 && formData.selectedServices.length === 0) ||
              (currentStep === 3 && (!formData.selectedDate || !formData.selectedTime)) ||
              (currentStep === 4 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.agreeToTerms))
            }
          >
            {currentStep === totalSteps ? 'Hoàn thành' : 'Tiếp tục'}
            <span>›</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="tesla-booking-content">
        {/* Left Content */}
        <div className="booking-left-content">
          <div className="booking-step-header">
            <h1>{getStepTitle()}</h1>
            <p>{getStepSubtitle()}</p>
        </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

        {/* Navigation Buttons */}
          <div className="step-navigation">
          {currentStep > 1 && (
            <button 
                className="nav-btn nav-btn-back"
              onClick={prevStep}
            >
                ‹ Lên trên
            </button>
          )}
          </div>
        </div>

        {/* Right Sidebar */}
        {renderSidebar()}
      </div>
    </div>
  );
}

export default BookingPage;