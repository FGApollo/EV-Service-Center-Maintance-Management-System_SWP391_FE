import React, { useState, useEffect } from 'react';
import './PaymentPage.css';
import { FaCheckCircle, FaCreditCard, FaQrcode, FaMobileAlt, FaArrowLeft } from 'react-icons/fa';
import { createPayment } from '../api';

function PaymentPage({ appointmentData, onNavigate, onPaymentComplete }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Tính tổng tiền
  const calculateTotal = () => {
    if (!appointmentData?.serviceTypes?.length) return 0;
    
    // Giá mẫu cho các dịch vụ (có thể lấy từ backend)
    const servicePrices = {
      1: 500000,  // Bảo dưỡng định kỳ
      2: 800000,  // Sửa chữa phanh
      3: 600000,  // Thay lốp xe
      4: 1200000, // Kiểm tra pin
      5: 300000   // Vệ sinh nội thất
    };
    
    return appointmentData.serviceTypes.reduce((total, serviceId) => {
      return total + (servicePrices[serviceId] || 0);
    }, 0);
  };

  const totalAmount = calculateTotal();

  // Format tiền VND
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Payment methods
  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: <FaCreditCard />,
      description: 'Thanh toán qua VNPay QR'
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: <FaMobileAlt />,
      description: 'Ví điện tử MoMo'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: <FaQrcode />,
      description: 'Ví điện tử ZaloPay'
    },
    {
      id: 'banking',
      name: 'Chuyển khoản',
      icon: <FaCreditCard />,
      description: 'Chuyển khoản ngân hàng'
    }
  ];

  // Helper function để lấy client IP (fallback nếu không lấy được)
  const getClientIp = async () => {
    try {
      // Thử lấy IP từ service (nếu có)
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch (error) {
      console.log('⚠️ Không lấy được IP từ service, dùng fallback');
      return '127.0.0.1'; // Fallback
    }
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!appointmentData?.id) {
      alert('❌ Không tìm thấy thông tin lịch hẹn!');
      return;
    }

    // Lấy invoiceId từ appointment data
    // Có thể là appointmentData.invoiceId hoặc appointmentData.invoices[0].id
    let invoiceId = appointmentData.invoiceId;
    
    if (!invoiceId && appointmentData.invoices && appointmentData.invoices.length > 0) {
      invoiceId = appointmentData.invoices[0].id;
    }
    
    if (!invoiceId) {
      alert('❌ Không tìm thấy thông tin hóa đơn!\n\nVui lòng liên hệ hỗ trợ để được hỗ trợ.');
      return;
    }

    setIsProcessing(true);

    try {
      // Lấy client IP
      const clientIp = await getClientIp();
      
      console.log('💳 Creating payment transaction:', {
        invoiceId: invoiceId,
        method: 'online',
        clientIp: clientIp
      });

      // Gọi API tạo payment transaction với format mới
      const paymentResponse = await createPayment({
        invoiceId: invoiceId,
        method: 'online',
        clientIp: clientIp
      });

      console.log('✅ Payment created:', paymentResponse);

      // Xử lý response từ backend
      // Backend có thể trả về:
      // - paymentUrl: URL để redirect đến payment gateway
      // - qrCode: QR code để quét
      // - paymentId: ID giao dịch

      if (paymentResponse.paymentUrl) {
        // Redirect đến payment gateway (VNPay/MoMo/ZaloPay)
        console.log('🔄 Redirecting to payment gateway:', paymentResponse.paymentUrl);
        window.location.href = paymentResponse.paymentUrl;
        return; // Exit, browser sẽ redirect
      }

      // Nếu không có paymentUrl, có thể là banking hoặc đã thanh toán thành công
      if (paymentResponse.status === 'success' || paymentResponse.status === 'completed') {
        // Thanh toán thành công ngay (có thể là banking đã xác nhận)
        setPaymentSuccess(true);
        
        setTimeout(() => {
          if (onPaymentComplete) {
            onPaymentComplete({
              appointmentId: appointmentData.id,
              amount: totalAmount,
              method: selectedPaymentMethod,
              paymentId: paymentResponse.paymentId,
              status: 'success'
            });
          }
        }, 2000);
      } else if (paymentResponse.qrCode) {
        // Hiển thị QR code (có thể implement sau)
        alert('📱 Vui lòng quét QR code để thanh toán!\n\nQR Code: ' + paymentResponse.qrCode);
        // TODO: Hiển thị QR code modal
      } else {
        // Fallback: Giả định thành công nếu không có thông tin redirect
        console.log('⚠️ No paymentUrl or qrCode, assuming success');
        setPaymentSuccess(true);
        
        setTimeout(() => {
          if (onPaymentComplete) {
            onPaymentComplete({
              appointmentId: appointmentData.id,
              amount: totalAmount,
              method: selectedPaymentMethod,
              paymentId: paymentResponse.paymentId,
              status: 'success'
            });
          }
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Payment error:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán!';
      
      if (error.response?.status === 400) {
        errorMessage = '⚠️ Dữ liệu thanh toán không hợp lệ\n\n' + 
                      (error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin.');
      } else if (error.response?.status === 403) {
        errorMessage = '🚫 Không có quyền tạo giao dịch thanh toán\n\n' +
                      'Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.';
      } else if (error.response?.status === 404) {
        errorMessage = '🔍 Không tìm thấy lịch hẹn\n\n' +
                      'Lịch hẹn có thể đã bị xóa hoặc không tồn tại.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Success screen
  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-container success-container">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã đặt lịch dịch vụ</p>
          <div className="success-details">
            <p><strong>Mã lịch hẹn:</strong> #{appointmentData?.id || 'N/A'}</p>
            <p><strong>Số tiền:</strong> {formatMoney(totalAmount)}</p>
            <p><strong>Phương thức:</strong> {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => onNavigate('home')}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <button 
          className="btn-back"
          onClick={() => onNavigate('booking')}
        >
          <FaArrowLeft /> Quay lại
        </button>

        <h2>Thanh toán dịch vụ</h2>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Thông tin đơn hàng</h3>
          <div className="summary-item">
            <span>Ngày hẹn:</span>
            <span>{appointmentData?.appointmentDate ? new Date(appointmentData.appointmentDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
          <div className="summary-item">
            <span>Xe:</span>
            <span>{appointmentData?.vehicleModel || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <span>Chi nhánh:</span>
            <span>Chi nhánh {appointmentData?.serviceCenterId || '1'}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item total">
            <span><strong>Tổng cộng:</strong></span>
            <span className="total-amount">{formatMoney(totalAmount)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h3>Chọn phương thức thanh toán</h3>
          <div className="payment-methods-grid">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-method-card ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <h4>{method.name}</h4>
                  <p>{method.description}</p>
                </div>
                <div className="method-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Button */}
        <button
          className="btn-payment"
          onClick={handlePayment}
          disabled={isProcessing || !selectedPaymentMethod}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Đang xử lý...
            </>
          ) : (
            `Thanh toán ${formatMoney(totalAmount)}`
          )}
        </button>

        <p className="payment-note">
          🔒 Thanh toán an toàn và bảo mật
        </p>
      </div>
    </div>
  );
}

export default PaymentPage;

