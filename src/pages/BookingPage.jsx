import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import { createAppointment, getVehicles, getVehicleByVin } from '../api';

function BookingPage({ onNavigate, prefilledVehicle }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Info
    licensePlate: prefilledVehicle?.licensePlate || prefilledVehicle?.vin || '',
    vehicleModel: prefilledVehicle ? [prefilledVehicle.brand, prefilledVehicle.model].filter(Boolean).join(' ') : '',
    mileage: prefilledVehicle?.mileage || '',
    
    // Step 2: Service Center (Chi nhánh)
    serviceCenterId: null,  // ID chi nhánh được chọn
    
    // Step 3: Services
    selectedServices: [],
    
    // Step 4: Schedule
    selectedDate: null,
    selectedTime: '',
    
    // Step 5: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  // State cho danh sách xe và thông tin xe được chọn
  const [myVehicles, setMyVehicles] = useState([]);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState(prefilledVehicle || null);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  // Fetch danh sách xe của user khi component mount
  useEffect(() => {
    const fetchMyVehicles = async () => {
      try {
        const data = await getVehicles();
        setMyVehicles(data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách xe:', err);
      }
    };
    fetchMyVehicles();

    // Tự động điền thông tin user từ localStorage
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin user:', err);
    }
  }, []);

  // Cập nhật formData khi có thông tin xe được truyền vào
  useEffect(() => {
    if (prefilledVehicle) {
      const vehicleName = [prefilledVehicle.brand, prefilledVehicle.model]
        .filter(Boolean)
        .join(' ');
      
      setFormData(prev => ({
        ...prev,
        licensePlate: prefilledVehicle.licensePlate || prefilledVehicle.vin || '',
        vehicleModel: vehicleName,
        mileage: prefilledVehicle.mileage || ''
      }));
      setSelectedVehicleInfo(prefilledVehicle);
    }
  }, [prefilledVehicle]);

  // Tự động tìm xe khi nhập VIN
  useEffect(() => {
    const searchVehicleByVin = async () => {
      const vin = formData.licensePlate.trim();
      if (vin.length >= 3) {
        try {
          setVehicleLoading(true);
          const vehicle = await getVehicleByVin(vin);
          if (vehicle) {
            setSelectedVehicleInfo(vehicle);
            const vehicleName = [vehicle.brand, vehicle.model]
              .filter(Boolean)
              .join(' ');
            setFormData(prev => ({
              ...prev,
              vehicleModel: vehicleName,
              mileage: vehicle.mileage || prev.mileage
            }));
          }
        } catch (err) {
          // Không tìm thấy xe, reset thông tin
          if (err.response?.status === 404) {
            setSelectedVehicleInfo(null);
          }
          console.error('Lỗi khi tìm xe:', err);
        } finally {
          setVehicleLoading(false);
        }
      } else {
        setSelectedVehicleInfo(null);
      }
    };

    // Debounce để tránh gọi API quá nhiều
    const timeoutId = setTimeout(searchVehicleByVin, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.licensePlate]);

  // Handler để chọn xe từ dropdown
  const handleSelectVehicle = (vehicle) => {
    const vehicleName = [vehicle.brand, vehicle.model]
      .filter(Boolean)
      .join(' ');
    
    setFormData(prev => ({
      ...prev,
      licensePlate: vehicle.licensePlate || vehicle.vin,
      vehicleModel: vehicleName,
      mileage: vehicle.mileage || ''
    }));
    setSelectedVehicleInfo(vehicle);
    setShowVehicleDropdown(false);
  };

  const totalSteps = 5;

  const services = [
    {
      id: 1,
      name: 'Bảo dưỡng hệ thống thắng - xe EQ',
      category: 'Bảo dưỡng',
      icon: '🔧',
      price: '2,500,000 VNĐ',
      description: 'Kiểm tra và bảo dưỡng hệ thống thắng chuyên dụng cho xe điện'
    },
    {
      id: 2, 
      name: 'BẢO DƯỠNG A - Dòng xe EQ',
      category: 'Bảo dưỡng',
      icon: '⚡',
      price: '3,200,000 VNĐ',
      description: 'Bảo dưỡng toàn diện cơ bản cho xe điện EQ'
    },
    {
      id: 3,
      name: 'Bảo Dưỡng B - Dòng xe EQ',
      category: 'Bảo dưỡng',
      icon: '🔋',
      price: '4,500,000 VNĐ',
      description: 'Bảo dưỡng nâng cao với kiểm tra hệ thống pin và động cơ điện'
    },
    {
      id: 4,
      name: 'Thay cao su gạt mưa xe EQ',
      category: 'Bảo dưỡng',
      icon: '🌧️',
      price: '850,000 VNĐ',
      description: 'Thay thế gạt mưa chính hãng'
    },
    {
      id: 5,
      name: 'Công việc khác cho xe EQ',
      category: 'Các chào giá khác',
      icon: '⚙️',
      price: 'Liên hệ',
      description: 'Dịch vụ tùy chỉnh theo yêu cầu'
    }
  ];

  const serviceCenters = [
    {
      id: 1,
      name: 'Chi nhánh 1 - CarCare Quận 1',
      address: '123 Lê Lợi, Quận 1',
      city: 'Hồ Chí Minh',
      phone: '024-3456-7890',
      workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
      icon: '🏢'
    },
    {
      id: 2,
      name: 'Chi nhánh 2 - CarCare Thủ Đức',
      address: '456 Võ Văn Ngân, Thủ Đức',
      city: 'Hồ Chí Minh',
      phone: '028-9876-5432',
      workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
      icon: '🏢'
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

  const handleSubmit = async () => {
    try {
      // Chuẩn bị dữ liệu theo format API backend
      // Kết hợp date và time thành ISO string
      const appointmentDateTime = new Date(
        `${formData.selectedDate ? 
          `2025-10-${formData.selectedDate}` : 
          new Date().toISOString().split('T')[0]} ${formData.selectedTime || '09:00'}`
      ).toISOString();

      const appointmentData = {
        vehicleId: selectedVehicleInfo?.id || 0,  // ID xe từ database
        serviceCenterId: formData.serviceCenterId,  // ID trung tâm dịch vụ đã chọn
        appointmentDate: appointmentDateTime,  // ISO datetime string
        serviceTypeIds: formData.selectedServices  // Array các ID dịch vụ (numbers)
      };

      // Validation
      if (!selectedVehicleInfo?.id) {
        alert('⚠️ Vui lòng chọn xe có sẵn trong hệ thống hoặc nhập VIN/biển số hợp lệ');
        return;
      }
      if (!formData.serviceCenterId) {
        alert('⚠️ Vui lòng chọn chi nhánh dịch vụ');
        return;
      }
      if (!formData.selectedServices || formData.selectedServices.length === 0) {
        alert('⚠️ Vui lòng chọn ít nhất một dịch vụ');
        return;
      }

      console.log('Đang gửi yêu cầu đặt lịch...', appointmentData);
      
      // Gọi API tạo lịch hẹn
      const response = await createAppointment(appointmentData);
      
      console.log('Đặt lịch thành công:', response);
      alert('✅ Đặt lịch thành công! Chúng tôi sẽ xác nhận lịch hẹn của bạn trong thời gian sớm nhất.');
      onNavigate('home');
      
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      alert(`❌ Không thể đặt lịch: ${error.response?.data?.message || error.message || 'Vui lòng thử lại sau'}`);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Thông tin xe của bạn';
      case 2: return 'Chọn chi nhánh';
      case 3: return 'Chọn một hoặc nhiều dịch vụ';
      case 4: return 'Lịch hẹn';
      case 5: return 'Chi tiết cá nhân';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch(currentStep) {
      case 1: return 'Đối với một đề nghị dịch vụ rõng bước, chúng tôi cần một số thông tin về xe của bạn.';
      case 2: return 'Vui lòng chọn chi nhánh gần bạn nhất để được phục vụ tốt nhất.';
      case 3: return 'Chọn một hoặc nhiều dịch vụ.';
      case 4: return 'Kiểm tra các cuộc hẹn có sẵn và chọn một cuộc hẹn phù hợp với lịch trình của bạn';
      case 5: return 'Chúng tôi chỉ cần một số thông tin về bạn.';
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
          <div className="form-group full-width" style={{ position: 'relative' }}>
            <label>Số VIN / Biển số xe</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nhập hoặc chọn VIN/biển số xe"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value)}
              onFocus={() => setShowVehicleDropdown(true)}
              onBlur={() => setTimeout(() => setShowVehicleDropdown(false), 200)}
            />
            {vehicleLoading && (
              <span style={{ position: 'absolute', right: '10px', top: '38px', fontSize: '12px', color: '#999' }}>
                Đang tìm...
              </span>
            )}
            
            {/* Dropdown hiển thị danh sách xe của user */}
            {showVehicleDropdown && myVehicles.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ padding: '8px', fontSize: '12px', color: '#666', borderBottom: '1px solid #eee' }}>
                  Chọn từ xe của tôi:
                </div>
                {myVehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.background = 'white'}
                  >
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      {[vehicle.brand, vehicle.model].filter(Boolean).join(' ') || 'Xe'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {vehicle.licensePlate || vehicle.vin} • Năm {vehicle.year}
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Hiển thị thông tin xe chi tiết khi tìm thấy */}
      {selectedVehicleInfo && (
        <div className="form-section" style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span>
            <span>Thông tin xe</span>
          </h3>
          <div className="sidebar-item">
            <div className="sidebar-item-content">
              <h4 style={{ fontSize: '18px', marginBottom: '12px' }}>
                {[selectedVehicleInfo.brand, selectedVehicleInfo.model]
                  .filter(Boolean)
                  .join(' ') || 'Thông tin xe'}
              </h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <p style={{ margin: 0 }}>
                  <strong>Biển số:</strong> {selectedVehicleInfo.licensePlate || 'N/A'}
                </p>
                {selectedVehicleInfo.vin && (
                  <p style={{ margin: 0 }}>
                    <strong>VIN:</strong> {selectedVehicleInfo.vin}
                  </p>
                )}
                <p style={{ margin: 0 }}>
                  <strong>Năm sản xuất:</strong> {selectedVehicleInfo.year}
                </p>
                {selectedVehicleInfo.color && (
                  <p style={{ margin: 0 }}>
                    <strong>Màu sắc:</strong> {selectedVehicleInfo.color}
                  </p>
                )}
                {selectedVehicleInfo.mileage && (
                  <p style={{ margin: 0 }}>
                    <strong>Số km đã đi:</strong> {selectedVehicleInfo.mileage.toLocaleString()} km
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo khi không tìm thấy xe */}
      {formData.licensePlate && !selectedVehicleInfo && !vehicleLoading && formData.licensePlate.length >= 3 && (
        <div className="form-section" style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '15px' }}>
          <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
            ⚠️ Không tìm thấy thông tin xe với VIN/biển số này. Bạn có thể tiếp tục đặt lịch hoặc chọn xe khác.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>
          <span className="form-section-icon">📍</span>
          Chọn chi nhánh dịch vụ
        </h2>
        <div className="selection-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {serviceCenters.map(center => (
            <div 
              key={center.id}
              className={`selection-card ${formData.serviceCenterId === center.id ? 'selected' : ''}`}
              onClick={() => handleInputChange('serviceCenterId', center.id)}
              style={{ 
                padding: '24px',
                cursor: 'pointer',
                minHeight: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div className="selection-card-header" style={{ justifyContent: 'space-between' }}>
                <span className="selection-card-icon" style={{ fontSize: '32px' }}>{center.icon}</span>
                <input
                  type="radio"
                  name="serviceCenter"
                  className="selection-checkbox"
                  checked={formData.serviceCenterId === center.id}
                  onChange={() => {}}
                  style={{ width: '20px', height: '20px' }}
                />
              </div>
              <h3 style={{ fontSize: '18px', margin: '8px 0', fontWeight: '600' }}>{center.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#666' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>📍</span>
                  <span>{center.address}, {center.city}</span>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📞</span>
                  <span>{center.phone}</span>
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🕒</span>
                  <span>{center.workingHours}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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

  const renderStep5 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>Thông tin liên hệ</h2>
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
              <label>Số điện thoại</label>
              <div className="phone-input-group">
                <select className="country-code-select">
                  <option>VN (+84)</option>
                </select>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
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
          Tôi hiểu rằng Dữ liệu liên quan sau khi khách hàng và phương tiện được thu thập trong quá trình đặt chỗ sẽ được chuyển tiếp đến Xưởng dịch vụ ủy quyền. Tôi đã đọc và đồng ý với tất cả các điều khoản và điều kiện về bảo mật dữ liệu cá nhân.
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
                <h4>
                  {selectedVehicleInfo 
                    ? [selectedVehicleInfo.brand, selectedVehicleInfo.model]
                        .filter(Boolean)
                        .join(' ') || 'Thông tin xe'
                    : formData.vehicleModel || 'Thông tin xe'}
                </h4>
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

        {formData.serviceCenterId && currentStep >= 3 && (
          <div className="sidebar-section">
            <h3>Chi nhánh dịch vụ</h3>
            <div className="sidebar-item">
              <div className="sidebar-item-content">
                <h4>{serviceCenters.find(c => c.id === formData.serviceCenterId)?.name}</h4>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0 0' }}>
                  {serviceCenters.find(c => c.id === formData.serviceCenterId)?.city}
                </p>
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
              {currentStep > 4 && (
                <button 
                  className="sidebar-edit-btn"
                  onClick={() => setCurrentStep(4)}
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
              (currentStep === 2 && !formData.serviceCenterId) ||
              (currentStep === 3 && formData.selectedServices.length === 0) ||
              (currentStep === 4 && (!formData.selectedDate || !formData.selectedTime)) ||
              (currentStep === 5 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.agreeToTerms))
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
          {currentStep === 5 && renderStep5()}

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