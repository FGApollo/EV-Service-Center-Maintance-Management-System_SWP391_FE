import React, { useState, useEffect, useMemo } from 'react';
import './BookingPage.css';
import { createAppointment, createPayment, getVehicles, getVehicleByVin } from '../api';

function BookingPage({ onNavigate, onNavigateToPayment, prefilledVehicle }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Info
    licensePlate: prefilledVehicle?.licensePlate || prefilledVehicle?.vin || '',
    vehicleModel: prefilledVehicle ? [prefilledVehicle.brand, prefilledVehicle.model].filter(Boolean).join(' ') : '',
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
  const [clientIp, setClientIp] = useState('127.0.0.1');
  const [expandedServices, setExpandedServices] = useState([]);
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [calendarMonth, setCalendarMonth] = useState(() => ({
    month: today.getMonth(),
    year: today.getFullYear()
  }));
  // Pre-fetch client IP for payment gateway (fallback: 127.0.0.1)
  useEffect(() => {
    let isMounted = true;

    const fetchClientIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error(`Failed to fetch client IP: ${response.status}`);
        }
        const data = await response.json();
        if (data?.ip && isMounted) {
          setClientIp(data.ip);
        }
      } catch (error) {
        console.warn('⚠️ Không thể lấy địa chỉ IP client, sử dụng mặc định 127.0.0.1', error);
      }
    };

    fetchClientIp();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxBookingDate = useMemo(() => {
    const limit = new Date(today);
    limit.setMonth(limit.getMonth() + 2);
    limit.setHours(0, 0, 0, 0);
    return limit;
  }, [today]);

  const isSameDay = (dateA, dateB) => {
    if (!dateA || !dateB) return false;
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  const isDateBefore = (dateA, dateB) => dateA.getTime() < dateB.getTime();
  const isDateAfter = (dateA, dateB) => dateA.getTime() > dateB.getTime();

  const isTimeSlotInPast = (time, date) => {
    if (!date || !time) return false;
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate.getTime() <= Date.now();
  };

  const handleDateSelection = (date) => {
    if (!date) return;
    setFormData(prev => {
      const shouldResetTime = prev.selectedTime && isTimeSlotInPast(prev.selectedTime, date);
      return {
        ...prev,
        selectedDate: date,
        selectedTime: shouldResetTime ? '' : prev.selectedTime
      };
    });
  };

  const handlePrevMonth = () => {
    setCalendarMonth(prev => {
      const prevMonthStart = new Date(prev.year, prev.month, 1);
      prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
      const prevMonthEnd = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth() + 1, 0);
      prevMonthEnd.setHours(0, 0, 0, 0);
      if (isDateBefore(prevMonthEnd, today)) {
        return prev;
      }
      return {
        month: prevMonthStart.getMonth(),
        year: prevMonthStart.getFullYear()
      };
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => {
      const nextMonthStart = new Date(prev.year, prev.month, 1);
      nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
      if (isDateAfter(nextMonthStart, maxBookingDate)) {
        return prev;
      }
      return {
        month: nextMonthStart.getMonth(),
        year: nextMonthStart.getFullYear()
      };
    });
  };

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
        vehicleModel: vehicleName
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
              vehicleModel: vehicleName
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
      vehicleModel: vehicleName
    }));
    setSelectedVehicleInfo(vehicle);
    setShowVehicleDropdown(false);
  };

  const totalSteps = 5;

  const services = [
    {
      id: 1,
      name: 'Gói Cơ bản (Basic Maintenance)',
      category: 'Bảo dưỡng',
      icon: '🛠️',
      priceText: '2.000.000 VNĐ',
      priceValue: 2000000,
      summary: 'Mục tiêu: Kiểm tra nhanh, tiết kiệm chi phí. Tần suất: 3-6 tháng/lần hoặc mỗi 5.000 km. Thời gian: 60-90 phút.',
      details: [
        'Kiểm tra tổng quát hệ thống điện, đèn, còi, phanh, lốp',
        'Kiểm tra và vệ sinh lọc gió, lọc điều hòa',
        'Kiểm tra mức pin, cổng sạc, quạt làm mát',
        'Rửa xe và vệ sinh khoang máy'
      ]
    },
    {
      id: 2,
      name: 'Gói Tiêu chuẩn (Standard Maintenance)',
      category: 'Bảo dưỡng',
      icon: '⚡',
      priceText: '3.200.000 VNĐ',
      priceValue: 3200000,
      summary: 'Mục tiêu: Cân bằng chi phí và hiệu quả, phù hợp đa số khách hàng. Tần suất: 6-12 tháng/lần hoặc mỗi 10.000 km. Thời gian: 2-3 giờ.',
      details: [
        'Toàn bộ nội dung gói cơ bản',
        'Thay dầu phanh, dung dịch làm mát',
        'Kiểm tra cân bằng bánh xe, cảm biến, hệ thống treo',
        'Cập nhật phần mềm điều khiển, kiểm tra ECU',
        'Kiểm tra chi tiết hệ thống pin, log lỗi sạc/xả'
      ]
    },
    {
      id: 3,
      name: 'Gói Cao cấp (Premium / Full Maintenance)',
      category: 'Bảo dưỡng',
      icon: '✨',
      priceText: '4.500.000 VNĐ',
      priceValue: 4500000,
      summary: 'Mục tiêu: Bảo dưỡng toàn diện cho xe hoạt động thường xuyên hoặc xe cao cấp. Tần suất: 12 tháng/lần hoặc mỗi 20.000 km. Thời gian: 4-6 giờ.',
      details: [
        'Toàn bộ nội dung gói tiêu chuẩn',
        'Thay mới dầu hộp số (nếu có), lọc gió, nước rửa kính, vệ sinh khoang động cơ',
        'Kiểm tra, hiệu chỉnh hệ thống pin (balance cell, test công suất)',
        'Kiểm tra và cân chỉnh hệ thống lái, treo, phanh ABS',
        'Chẩn đoán lỗi chi tiết bằng máy OBD-II chuyên dụng',
        'Đánh bóng thân xe, vệ sinh nội thất toàn bộ'
      ]
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

  const formatCurrency = (value) => {
    if (!value || Number.isNaN(value)) {
      return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

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

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices(prev => (
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    ));
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
      // Kiểm tra đăng nhập trước khi đặt lịch
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      console.log('🔐 Auth check:', {
        hasToken: !!token,
        token: token ? token.substring(0, 20) + '...' : null,
        user: user,
        userRole: user?.role
      });
      
      if (!token) {
        const confirmLogin = window.confirm(
          '⚠️ Bạn cần đăng nhập để đặt lịch hẹn.\n\nBạn có muốn đăng nhập ngay bây giờ không?'
        );
        if (confirmLogin) {
          onNavigate('login');
        }
        return;
      }

      // Chuẩn bị dữ liệu theo format API backend
      // Kết hợp date và time thành ISO string
      const selectedDateObj = formData.selectedDate instanceof Date
        ? new Date(formData.selectedDate)
        : new Date();
      const timeString = formData.selectedTime || '09:00';
      const [hours, minutes] = timeString.split(':').map(Number);
      selectedDateObj.setHours(hours, minutes, 0, 0);

      if (selectedDateObj.getTime() <= Date.now()) {
        alert('⚠️ Thời gian đã chọn đã qua. Vui lòng chọn thời gian khác.');
        return;
      }

      const appointmentDateTime = selectedDateObj.toISOString();
      const createdAt = new Date().toISOString();

      const selectedServiceDetails = services.filter(service =>
        formData.selectedServices.includes(service.id)
      );
      const totalSelectedPrice = selectedServiceDetails.reduce((sum, service) => (
        sum + (service.priceValue || 0)
      ), 0);

      const appointmentData = {
        vehicleId: selectedVehicleInfo?.id || 0,  // ID xe từ database
        serviceCenterId: formData.serviceCenterId,  // ID trung tâm dịch vụ đã chọn
        appointmentDate: appointmentDateTime,  // ISO datetime string
        serviceTypeIds: formData.selectedServices,  // Array các ID dịch vụ (numbers)
        createdAt  // Thời điểm tạo lịch hẹn
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

      console.log('📤 Đang gửi yêu cầu đặt lịch...');
      console.log('📋 Appointment Data:', JSON.stringify(appointmentData, null, 2));
      console.log('🔍 Validation:', {
        vehicleIdValid: !!selectedVehicleInfo?.id,
        vehicleId: selectedVehicleInfo?.id,
        serviceCenterIdValid: !!formData.serviceCenterId,
        serviceCenterId: formData.serviceCenterId,
        serviceTypeIdsValid: formData.selectedServices?.length > 0,
        serviceTypeIds: formData.selectedServices,
        appointmentDateValid: !!appointmentDateTime,
        appointmentDate: appointmentDateTime
      });
      
      // Gọi API tạo lịch hẹn
      const response = await createAppointment(appointmentData);
      
      console.log('✅ Đặt lịch thành công:', response);
      console.log('📋 Response data:', {
        appointmentId: response.appointmentId || response.id,
        invoiceId: response.invoiceId,
        invoices: response.invoices
      });
      
      // ✅ Invoice đã được tạo tự động bởi backend khi đặt lịch
      const appointmentId = response.appointmentId || response.id;
      const invoiceId = response.invoiceId || (response.invoices && response.invoices[0]?.id);
      
      // Navigate sang trang thanh toán với thông tin appointment và invoice từ response
      const paymentData = {
        id: appointmentId,
        appointmentId: appointmentId,
        appointmentDate: appointmentData.appointmentDate,
        vehicleModel: formData.vehicleModel,
        serviceCenterId: formData.serviceCenterId,
        serviceTypes: formData.selectedServices,
        createdAt,
        totalAmount: totalSelectedPrice,
        selectedServices: selectedServiceDetails,
        // ✅ Invoice info từ API response (đã tích hợp trong API đặt lịch)
        invoiceId: invoiceId,
        invoices: response.invoices || [],
        ...response
      };
      
      console.log('📤 Chuyển sang thanh toán:', paymentData);

      let paymentUrl = response.paymentUrl || response.paymentLink || response.url;

      if (!paymentUrl && invoiceId) {
        try {
          console.log('💳 Đang tạo giao dịch thanh toán cho invoice:', invoiceId);
          const paymentResponse = await createPayment({
            invoiceId,
            method: 'online',
            clientIp
          });
          console.log('✅ Payment API response:', paymentResponse);
          paymentUrl = paymentResponse.paymentUrl || paymentResponse.url || paymentResponse.redirectUrl;
        } catch (paymentError) {
          console.error('❌ Không thể tạo thanh toán tự động:', paymentError);
          alert('⚠️ Đặt lịch thành công nhưng chưa tạo được liên kết thanh toán tự động. Vui lòng thử lại trên trang thanh toán.');
        }
      }

      if (paymentUrl) {
        console.log('🔗 Redirecting to payment URL:', paymentUrl);
        window.location.href = paymentUrl;
        return;
      }
      
      if (onNavigateToPayment) {
        onNavigateToPayment(paymentData);
      } else {
        // Fallback nếu không có payment handler
        alert('✅ Đặt lịch thành công! Chúng tôi sẽ xác nhận lịch hẹn của bạn trong thời gian sớm nhất.');
        onNavigate('home');
      }
      
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Vui lòng thử lại sau';
      
      if (error.response?.status === 403) {
        // 403 Forbidden - Có thể do token hết hạn hoặc không có quyền
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const backendMessage = error.response?.data?.message || error.response?.data?.error || '';
        
        console.log('🚫 403 Forbidden - Debug info:', {
          hasToken: !!token,
          userRole: user?.role,
          backendMessage: backendMessage,
          responseData: error.response?.data
        });
        
        if (!token) {
          errorMessage = 'Bạn cần đăng nhập để đặt lịch hẹn';
          const confirmLogin = window.confirm(
            '⚠️ Bạn chưa đăng nhập.\n\nBạn có muốn đăng nhập ngay bây giờ không?'
          );
          if (confirmLogin) {
            onNavigate('login');
          }
        } else {
          // Hiển thị chi tiết error message từ backend
          const detailedMessage = backendMessage || 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền thực hiện thao tác này.';
          
          errorMessage = `🚫 Không thể đặt lịch hẹn\n\n❌ Lỗi: ${detailedMessage}\n\n💡 Có thể do:\n• Token hết hạn\n• Không có quyền (Role: ${user?.role || 'unknown'})\n• Dữ liệu không hợp lệ\n\nVui lòng đăng nhập lại.`;
          
          const confirmLogin = window.confirm(
            '⚠️ ' + errorMessage + '\n\nBạn có muốn đăng nhập lại không?'
          );
          if (confirmLogin) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            onNavigate('login');
          }
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        const confirmLogin = window.confirm(
          '⚠️ Phiên đăng nhập đã hết hạn.\n\nBạn có muốn đăng nhập lại không?'
        );
        if (confirmLogin) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          onNavigate('login');
        }
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`❌ Không thể đặt lịch: ${errorMessage}`);
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
  const calendarLabel = useMemo(() => {
    return `tháng ${calendarMonth.month + 1} năm ${calendarMonth.year}`;
  }, [calendarMonth]);

  const canGoPrevMonth = useMemo(() => {
    const prevMonthStart = new Date(calendarMonth.year, calendarMonth.month, 1);
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    const prevMonthEnd = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth() + 1, 0);
    prevMonthEnd.setHours(0, 0, 0, 0);
    return !isDateBefore(prevMonthEnd, today);
  }, [calendarMonth, today]);

  const canGoNextMonth = useMemo(() => {
    const nextDate = new Date(calendarMonth.year, calendarMonth.month, 1);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return !isDateAfter(nextDate, maxBookingDate);
  }, [calendarMonth, maxBookingDate]);

  const generateCalendarDays = () => {
    const days = [];
    const { month, year } = calendarMonth;
    
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDayOfMonth.getDay() + 6) % 7; // Monday-first
    
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      days.push({ day, date });
    }
    
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    
    return days;
  };

  const dateFormatter = useMemo(() => (
    new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  ), []);

  const formatDateLabel = (date) => {
    if (!date) return '';
    const value = dateFormatter.format(date);
    return value.charAt(0).toUpperCase() + value.slice(1);
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

  const renderStep3 = () => {
    const maintenanceServices = services.filter(s => s.category === 'Bảo dưỡng');

    return (
      <div className="booking-step-content">
        <div className="form-section">
          <h2>
            <span className="form-section-icon">🔧</span>
            Bảo dưỡng
          </h2>
          <div className="selection-grid">
            {maintenanceServices.map(service => {
              const isSelected = formData.selectedServices.includes(service.id);
              const isExpanded = expandedServices.includes(service.id);

              return (
                <div
                  key={service.id}
                  className={`selection-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <div className="selection-card-header">
                    <span className="selection-card-icon">{service.icon}</span>
                    <input
                      type="checkbox"
                      className="selection-checkbox"
                      checked={isSelected}
                      readOnly
                    />
                  </div>
                  <h3>{service.name}</h3>
                  <div className="selection-card-price">
                    {service.priceText || formatCurrency(service.priceValue)}
                  </div>
                  {service.summary && (
                    <p className="service-summary">{service.summary}</p>
                  )}
                  {service.details && isExpanded && (
                    <ul className="service-details-list">
                      {service.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="selection-card-details"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleServiceDetails(service.id);
                    }}
                  >
                    {isExpanded ? 'Ẩn chi tiết' : 'Chi tiết'}
                  </button>
                </div>
              );
            })}
          </div>
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
    );
  };

  const renderStep4 = () => (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>
          <span className="form-section-icon">📅</span>
          Cả Văn Dịch Vụ
        </h2>
        
        <div className="calendar-section">
          <div className="calendar-header">
            <h3 style={{ textTransform: 'capitalize' }}>{calendarLabel}</h3>
            <div className="calendar-nav-btns">
              <button 
                className="calendar-nav-btn"
                onClick={handlePrevMonth}
                disabled={!canGoPrevMonth}
              >
                ‹
              </button>
              <button 
                className="calendar-nav-btn"
                onClick={handleNextMonth}
                disabled={!canGoNextMonth}
              >
                ›
              </button>
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
              {generateCalendarDays().map((item, index) => {
                if (!item) {
                  return <div key={`empty-${index}`} className="calendar-day empty" />;
                }

                const { day, date } = item;
                const isBeforeToday = isDateBefore(date, today);
                const isAfterLimit = isDateAfter(date, maxBookingDate);
                const selectable = !isBeforeToday && !isAfterLimit;
                const isSelected = formData.selectedDate && isSameDay(formData.selectedDate, date);

                return (
                  <button
                    key={date.toISOString()}
                    className={`calendar-day ${selectable ? 'available' : 'disabled'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectable && handleDateSelection(date)}
                    disabled={!selectable}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {formData.selectedDate && (
          <div className="time-slots-section">
            <h4>Khung thời gian khả dụng</h4>
            <div className="time-slots-grid">
              {timeSlots.map(time => {
                const isDisabled = isTimeSlotInPast(time, formData.selectedDate);
                return (
                  <button
                    key={time}
                    className={`time-slot ${formData.selectedTime === time ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => !isDisabled && handleInputChange('selectedTime', time)}
                    disabled={isDisabled}
                  >
                    {time}
                  </button>
                );
              })}
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
    const totalPrice = selectedServicesData.reduce((sum, service) => (
      sum + (service.priceValue || 0)
    ), 0);

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
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#4b5563' }}>
                    {service.priceText || formatCurrency(service.priceValue)}
                  </p>
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
                <h4>{`${formatDateLabel(formData.selectedDate)}, ${formData.selectedTime}`}</h4>
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
            <div className="sidebar-total-price">
              {formatCurrency(totalPrice)}
            </div>
            <p>Chi phí tạm tính dựa trên các gói dịch vụ đã chọn. Các chi phí bổ sung (nếu có) sẽ được thông báo trước khi thanh toán.</p>
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