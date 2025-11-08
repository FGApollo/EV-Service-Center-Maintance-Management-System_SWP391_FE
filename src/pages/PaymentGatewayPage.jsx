import React, { useState, useEffect } from 'react';
import './PaymentGatewayPage.css';
import { FaArrowLeft, FaCreditCard, FaMobileAlt, FaQrcode, FaGlobe, FaShieldAlt, FaEnvelope, FaInfoCircle, FaCopy, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { createPayment, getAppointmentById } from '../api';

function PaymentGatewayPage({ appointmentData, onNavigate, onPaymentComplete }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showTestCards, setShowTestCards] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  // Kiểm tra appointmentData và fetch invoiceId nếu cần
  // ✅ Lấy invoiceId từ appointmentData (backend đã tích hợp invoice vào API đặt lịch)
  useEffect(() => {
    console.log('🔍 PaymentGatewayPage mounted with appointmentData:', appointmentData);
    if (!appointmentData) {
      console.warn('⚠️ No appointmentData provided, redirecting to booking...');
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('booking');
        }
      }, 2000);
      return;
    }

    const appointmentId = appointmentData.appointmentId || appointmentData.id;
    console.log('📋 Checking invoiceId from appointmentData:', {
      directInvoiceId: appointmentData.invoiceId,
      invoicesArray: appointmentData.invoices,
      appointmentId: appointmentId
    });

    // Ưu tiên 1: Lấy từ appointmentData.invoiceId
    if (appointmentData.invoiceId) {
      console.log('✅ Found invoiceId from appointmentData.invoiceId:', appointmentData.invoiceId);
      setInvoiceId(appointmentData.invoiceId);
      return;
    }

    // Ưu tiên 2: Lấy từ invoices array
    if (appointmentData.invoices && appointmentData.invoices.length > 0) {
      const firstInvoiceId = appointmentData.invoices[0].id;
      if (firstInvoiceId) {
        console.log('✅ Found invoiceId from appointmentData.invoices[0].id:', firstInvoiceId);
        setInvoiceId(firstInvoiceId);
        return;
      }
    }

    // Ưu tiên 3: Fetch từ API appointment detail (fallback)
    console.log('🔄 No invoiceId found in appointmentData, fetching appointment detail:', appointmentId);
    fetchInvoiceFromAppointment(appointmentId);
  }, [appointmentData]);

  // Fetch invoiceId từ appointment detail
  const fetchInvoiceFromAppointment = async (appointmentId) => {
    setIsLoadingInvoice(true);
    try {
      console.log('📞 Fetching appointment detail for invoiceId...');
      const detail = await getAppointmentById(appointmentId);
      console.log('✅ Appointment detail fetched:', detail);

      // Tìm invoiceId từ detail
      let foundInvoiceId = null;

      if (detail.invoiceId) {
        foundInvoiceId = detail.invoiceId;
      } else if (detail.invoices && detail.invoices.length > 0) {
        foundInvoiceId = detail.invoices[0].id;
      } else if (detail.invoice && detail.invoice.id) {
        foundInvoiceId = detail.invoice.id;
      }

      if (foundInvoiceId) {
        console.log('✅ Found invoiceId:', foundInvoiceId);
        setInvoiceId(foundInvoiceId);
      } else {
        console.warn('⚠️ No invoiceId found in appointment detail');
        console.log('📋 Available keys:', Object.keys(detail));
      }
    } catch (error) {
      console.error('❌ Error fetching appointment detail:', error);
      // Không throw error, để user vẫn có thể thử thanh toán
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  // Tính tổng tiền từ service types
  useEffect(() => {
    if (appointmentData?.serviceTypes?.length) {
      const servicePrices = {
        1: 500000,  // Bảo dưỡng định kỳ
        2: 800000,  // Sửa chữa phanh
        3: 600000,  // Thay lốp xe
        4: 1200000, // Kiểm tra pin
        5: 300000   // Vệ sinh nội thất
      };
      
      const total = appointmentData.serviceTypes.reduce((sum, serviceId) => {
        return sum + (servicePrices[serviceId] || 0);
      }, 0);
      
      setTotalAmount(total);
    } else {
      // Fallback: Set default amount nếu không có serviceTypes
      setTotalAmount(500000);
      console.warn('⚠️ No serviceTypes found, using default amount');
    }
  }, [appointmentData]);

  // Test cards data từ VNPay sandbox
  const testCards = [
    {
      id: 1,
      bank: 'NCB',
      cardNumber: '9704198526191432198',
      cardholderName: 'NGUYEN VAN A',
      issueDate: '07/15',
      otp: '123456',
      note: 'Thành công',
      status: 'success'
    },
    {
      id: 2,
      bank: 'NCB',
      cardNumber: '9704195798459170488',
      cardholderName: 'NGUYEN VAN A',
      issueDate: '07/15',
      otp: '',
      note: 'Thẻ không đủ số dư',
      status: 'insufficient'
    },
    {
      id: 3,
      bank: 'NCB',
      cardNumber: '9704192181368742',
      cardholderName: 'NGUYEN VAN A',
      issueDate: '07/15',
      otp: '',
      note: 'Thẻ chưa kích hoạt',
      status: 'inactive'
    },
    {
      id: 4,
      bank: 'NCB',
      cardNumber: '9704193370791314',
      cardholderName: 'NGUYEN VAN A',
      issueDate: '07/15',
      otp: '',
      note: 'Thẻ bị khóa',
      status: 'locked'
    }
  ];

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Đã copy vào clipboard!');
    }).catch(() => {
      alert('❌ Không thể copy');
    });
  };

  // Format tiền VND
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format ngày giờ hẹn
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatAppointmentTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Payment methods với icons và descriptions
  const paymentMethods = [
    {
      id: 'vnpayqr',
      name: 'App Ngân hàng và Ví điện tử (VNPAYQR)',
      description: 'Thanh toán qua ứng dụng ngân hàng hoặc ví điện tử',
      icon: <FaQrcode />,
      color: '#1E40AF',
      logo: 'VNPAYQR'
    },
    {
      id: 'domestic',
      name: 'Thẻ nội địa và tài khoản ngân hàng',
      description: 'Thanh toán bằng thẻ ATM nội địa hoặc tài khoản ngân hàng',
      icon: <FaCreditCard />,
      color: '#059669',
      logo: 'ATM'
    },
    {
      id: 'international',
      name: 'Thẻ thanh toán quốc tế',
      description: 'VISA, Mastercard, JCB, UnionPay, American Express',
      icon: <FaGlobe />,
      color: '#DC2626',
      logos: ['VISA', 'MC', 'JCB', 'UP', 'AMEX']
    },
    {
      id: 'vnpayapp',
      name: 'App VNPAY',
      description: 'Thanh toán qua ứng dụng VNPAY',
      icon: <FaMobileAlt />,
      color: '#7C3AED',
      logo: 'VNPAY'
    }
  ];

  // Xử lý khi chọn phương thức thanh toán
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('⚠️ Vui lòng chọn phương thức thanh toán!');
      return;
    }

    if (!appointmentData?.id && !appointmentData?.appointmentId) {
      alert('❌ Không tìm thấy thông tin lịch hẹn!');
      return;
    }

    // Sử dụng invoiceId từ state (đã fetch hoặc từ appointmentData)
    let finalInvoiceId = invoiceId;
    
    // Fallback: Thử lấy từ appointmentData một lần nữa
    if (!finalInvoiceId) {
      finalInvoiceId = appointmentData.invoiceId || 
                      (appointmentData.invoices && appointmentData.invoices[0]?.id);
    }

    // Nếu vẫn không có, thử fetch lại
    if (!finalInvoiceId && (appointmentData.id || appointmentData.appointmentId)) {
      const appointmentId = appointmentData.id || appointmentData.appointmentId;
      console.log('🔄 No invoiceId, fetching appointment detail...');
      try {
        const detail = await getAppointmentById(appointmentId);
        finalInvoiceId = detail.invoiceId || 
                        (detail.invoices && detail.invoices[0]?.id) ||
                        (detail.invoice && detail.invoice.id);
        
        if (finalInvoiceId) {
          setInvoiceId(finalInvoiceId);
          console.log('✅ Found invoiceId after fetch:', finalInvoiceId);
        }
      } catch (error) {
        console.error('❌ Error fetching invoiceId:', error);
      }
    }
    
    if (!finalInvoiceId) {
      alert('❌ Không tìm thấy thông tin hóa đơn!\n\n' +
            'Có thể hóa đơn chưa được tạo. Vui lòng:\n' +
            '1. Đợi vài giây rồi thử lại\n' +
            '2. Liên hệ hỗ trợ để được hỗ trợ\n\n' +
            'Mã lịch hẹn: #' + (appointmentData.id || appointmentData.appointmentId || 'N/A'));
      return;
    }

    setIsProcessing(true);

    try {
      // Lấy client IP
      let clientIp = '127.0.0.1';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        clientIp = ipData.ip || '127.0.0.1';
      } catch (error) {
        console.log('⚠️ Không lấy được IP, dùng fallback');
      }

      console.log('💳 Creating payment transaction:', {
        invoiceId: finalInvoiceId,
        method: 'online',
        clientIp,
        paymentMethod: selectedMethod,
        appointmentId: appointmentData.id || appointmentData.appointmentId
      });

      // Gọi API tạo payment
      const paymentResponse = await createPayment({
        invoiceId: finalInvoiceId,
        method: 'online',
        clientIp: clientIp
      });

      console.log('✅ Payment created:', paymentResponse);
      console.log('   📋 Response fields:', {
        paymentId: paymentResponse.paymentId,
        invoiceId: paymentResponse.invoiceId,
        amount: paymentResponse.amount,
        method: paymentResponse.method,
        message: paymentResponse.message,
        hasPaymentUrl: !!paymentResponse.paymentUrl
      });

      // Nếu có paymentUrl, redirect đến VNPay gateway
      if (paymentResponse.paymentUrl) {
        console.log('🔄 Redirecting to VNPay gateway:', paymentResponse.paymentUrl);
        window.location.href = paymentResponse.paymentUrl;
        return;
      }

      // Nếu có QR code
      if (paymentResponse.qrCode) {
        // TODO: Hiển thị QR code modal
        alert('📱 Vui lòng quét QR code để thanh toán!\n\nQR Code: ' + paymentResponse.qrCode);
        return;
      }

      // Fallback: Success message
      if (paymentResponse.message) {
        alert(`✅ ${paymentResponse.message}\n\nPayment ID: ${paymentResponse.paymentId || 'N/A'}`);
      }

      // Fallback: Success
      if (paymentResponse.status === 'success' || paymentResponse.status === 'completed') {
        if (onPaymentComplete) {
          onPaymentComplete({
            appointmentId: appointmentData.id,
            amount: paymentResponse.amount || totalAmount,
            method: selectedMethod,
            paymentId: paymentResponse.paymentId,
            status: 'success'
          });
        }
      }

    } catch (error) {
      console.error('❌ Payment error:', error);
      let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán!';
      
      if (error.response?.status === 400) {
        errorMessage = '⚠️ Dữ liệu thanh toán không hợp lệ';
      } else if (error.response?.status === 403) {
        errorMessage = '🚫 Không có quyền tạo giao dịch thanh toán';
      } else if (error.response?.status === 404) {
        errorMessage = '🔍 Không tìm thấy hóa đơn';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Nếu không có appointmentData, hiển thị loading hoặc error
  if (!appointmentData) {
    return (
      <div className="payment-gateway-page">
        <div className="payment-gateway-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ color: '#475569', marginBottom: '15px' }}>Đang tải thông tin thanh toán...</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            Vui lòng đợi trong giây lát
          </p>
          <button 
            className="btn-back"
            onClick={() => onNavigate && onNavigate('booking')}
            style={{ margin: '0 auto' }}
          >
            <FaArrowLeft /> Quay lại đặt lịch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-gateway-page">
      {/* Header */}
      <div className="payment-header">
        <button className="btn-back" onClick={() => onNavigate('booking')}>
          <FaArrowLeft /> Quay lại
        </button>
        <div className="language-selector">
          <span className="flag">🇬🇧</span>
          <span>En</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="payment-gateway-container">
        {/* Bank Logos */}
        <div className="bank-logos">
          <div className="bank-logo ocb">
            <span className="bank-name">OCB</span>
            <span className="bank-subtitle">Ngân Hàng Phương Đông</span>
          </div>
          <div className="bank-logo vnpayqr">
            <span className="vnpayqr-text">CỔNG THANH TOÁN</span>
            <span className="vnpayqr-logo">VNPAYQR</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="payment-title">Chọn phương thức thanh toán</h1>

        {/* Order Summary */}
        <div className="order-summary-card">
          <div className="summary-row">
            <span>Mã đơn hàng:</span>
            <strong>#{appointmentData?.id || appointmentData?.appointmentId || 'N/A'}</strong>
          </div>
          {appointmentData?.appointmentDate && (
            <div className="summary-row">
              <span>Ngày hẹn:</span>
              <strong>{formatAppointmentDate(appointmentData.appointmentDate)}</strong>
            </div>
          )}
          {appointmentData?.appointmentDate && (
            <div className="summary-row">
              <span>Giờ hẹn:</span>
              <strong>{formatAppointmentTime(appointmentData.appointmentDate)}</strong>
            </div>
          )}
          <div className="summary-row">
            <span>Số tiền:</span>
            <strong className="amount">{formatMoney(totalAmount)}</strong>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods-list">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method-item ${selectedMethod === method.id ? 'selected' : ''}`}
              onClick={() => handleSelectMethod(method.id)}
            >
              <div className="method-content">
                <div className="method-icon" style={{ color: method.color }}>
                  {method.icon}
                </div>
                <div className="method-info">
                  <h3>{method.name}</h3>
                  <p>{method.description}</p>
                  {method.logos && (
                    <div className="card-logos">
                      {method.logos.map((logo, idx) => (
                        <span key={idx} className="card-logo">{logo}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="method-logo">
                {method.logo && (
                  <span className={`logo-badge ${method.logo.toLowerCase()}`}>
                    {method.logo}
                  </span>
                )}
                {method.id === 'vnpayqr' && (
                  <div className="qr-icon">
                    <FaQrcode />
                  </div>
                )}
                {method.id === 'vnpayapp' && (
                  <div className="vnpay-logo-large">VNPAY</div>
                )}
                {method.id === 'domestic' && (
                  <div className="bank-building-icon">🏦</div>
                )}
                {method.id === 'international' && (
                  <div className="card-icons">
                    <span className="card-icon visa">VISA</span>
                    <span className="card-icon mc">MC</span>
                    <span className="card-icon jcb">JCB</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Button */}
        <button
          className={`btn-payment ${!selectedMethod || isLoadingInvoice ? 'disabled' : ''}`}
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing || isLoadingInvoice}
        >
          {isLoadingInvoice ? (
            <>
              <span className="spinner"></span>
              Đang tải thông tin hóa đơn...
            </>
          ) : isProcessing ? (
            <>
              <span className="spinner"></span>
              Đang xử lý...
            </>
          ) : (
            `Thanh toán ${formatMoney(totalAmount)}`
          )}
        </button>

        {/* Loading Invoice Indicator */}
        {isLoadingInvoice && (
          <div style={{
            padding: '15px',
            background: '#e0f2fe',
            border: '2px solid #0ea5e9',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#0369a1',
            fontSize: '14px'
          }}>
            <span className="spinner" style={{ display: 'inline-block', marginRight: '10px' }}></span>
            Đang tải thông tin hóa đơn từ hệ thống...
          </div>
        )}

        {/* Invoice Status */}
        {!isLoadingInvoice && invoiceId && (
          <div style={{
            padding: '10px 15px',
            background: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#065f46',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            ✅ Đã tải thông tin hóa đơn (ID: {invoiceId})
          </div>
        )}

        {/* Test Cards Info Section */}
        <div className="test-cards-section">
          <button 
            className="test-cards-toggle"
            onClick={() => setShowTestCards(!showTestCards)}
          >
            <FaInfoCircle />
            <span>Thông tin thẻ test (VNPay Sandbox)</span>
            {showTestCards ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {showTestCards && (
            <div className="test-cards-content">
              <div className="test-cards-header">
                <h3>Thông tin thẻ test</h3>
                <p className="test-note">
                  💡 Sử dụng các thẻ test này để kiểm tra thanh toán trên VNPay Sandbox
                </p>
              </div>

              <div className="test-cards-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Thông tin thẻ</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCards.map((card) => (
                      <tr key={card.id} className={`test-card-row ${card.status}`}>
                        <td>{card.id}</td>
                        <td>
                          <div className="card-info">
                            <div className="card-field">
                              <span className="field-label">Ngân hàng:</span>
                              <span className="field-value">{card.bank}</span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Số thẻ:</span>
                              <span className="field-value highlight" onClick={() => copyToClipboard(card.cardNumber)}>
                                {card.cardNumber}
                                <FaCopy className="copy-icon" />
                              </span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Tên chủ thẻ:</span>
                              <span className="field-value highlight" onClick={() => copyToClipboard(card.cardholderName)}>
                                {card.cardholderName}
                                <FaCopy className="copy-icon" />
                              </span>
                            </div>
                            <div className="card-field">
                              <span className="field-label">Ngày phát hành:</span>
                              <span className="field-value">{card.issueDate}</span>
                            </div>
                            {card.otp && (
                              <div className="card-field">
                                <span className="field-label">Mật khẩu OTP:</span>
                                <span className="field-value highlight" onClick={() => copyToClipboard(card.otp)}>
                                  {card.otp}
                                  <FaCopy className="copy-icon" />
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`note-badge ${card.status}`}>
                            {card.note}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="test-cards-footer">
                <p>
                  📌 <strong>Lưu ý:</strong> Các thông tin này chỉ dùng cho môi trường test. 
                  Không sử dụng trong môi trường production.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="payment-footer">
          <div className="footer-left">
            <FaEnvelope />
            <span>hotrovnpay@vnpay.vn</span>
          </div>
          <div className="footer-right">
            <div className="security-badge">
              <FaShieldAlt />
              <span>secure GlobalSign</span>
            </div>
            <div className="security-badge pci">
              <span>PCI DSS COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentGatewayPage;

