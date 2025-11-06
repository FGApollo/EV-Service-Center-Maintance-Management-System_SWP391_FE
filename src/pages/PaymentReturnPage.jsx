import React, { useState, useEffect } from 'react';
import './PaymentReturnPage.css';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { handlePaymentReturn } from '../api';

function PaymentReturnPage({ onNavigate }) {
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Lấy query params từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    // Convert tất cả query params thành object
    urlParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log('🔄 Payment return callback:', params);

    // Gọi API xử lý payment return
    const processPaymentReturn = async () => {
      try {
        setStatus('processing');
        
        const result = await handlePaymentReturn(params);
        
        console.log('✅ Payment return processed:', result);

        if (result.status === 'success' || result.success === true) {
          setStatus('success');
          setPaymentData(result);
          
          // Auto redirect sau 3 giây
          setTimeout(() => {
            if (onNavigate) {
              onNavigate('home');
            }
          }, 3000);
        } else {
          setStatus('failed');
          setErrorMessage(result.message || 'Thanh toán không thành công');
        }
      } catch (error) {
        console.error('❌ Payment return error:', error);
        setStatus('failed');
        
        let errorMsg = 'Có lỗi xảy ra khi xử lý thanh toán!';
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        setErrorMessage(errorMsg);
      }
    };

    // Chỉ process nếu có params
    if (Object.keys(params).length > 0) {
      processPaymentReturn();
    } else {
      setStatus('failed');
      setErrorMessage('Không tìm thấy thông tin thanh toán');
    }
  }, [onNavigate]);

  // Processing state
  if (status === 'processing') {
    return (
      <div className="payment-return-page">
        <div className="payment-return-container">
          <div className="processing-icon">
            <FaSpinner className="spinning" />
          </div>
          <h2>Đang xử lý thanh toán...</h2>
          <p>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="payment-return-page">
        <div className="payment-return-container success">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã sử dụng dịch vụ</p>
          
          {paymentData && (
            <div className="payment-details">
              {paymentData.paymentId && (
                <p><strong>Mã giao dịch:</strong> {paymentData.paymentId}</p>
              )}
              {paymentData.appointmentId && (
                <p><strong>Mã lịch hẹn:</strong> #{paymentData.appointmentId}</p>
              )}
              {paymentData.amount && (
                <p><strong>Số tiền:</strong> {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(paymentData.amount)}</p>
              )}
              {paymentData.method && (
                <p><strong>Phương thức:</strong> {paymentData.method}</p>
              )}
            </div>
          )}

          <button 
            className="btn-primary"
            onClick={() => onNavigate && onNavigate('home')}
          >
            Về trang chủ
          </button>
          
          <p className="auto-redirect">Tự động chuyển về trang chủ sau 3 giây...</p>
        </div>
      </div>
    );
  }

  // Failed state
  return (
    <div className="payment-return-page">
      <div className="payment-return-container failed">
        <div className="failed-icon">
          <FaTimesCircle />
        </div>
        <h2>Thanh toán thất bại</h2>
        <p className="error-message">{errorMessage}</p>
        
        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => onNavigate && onNavigate('home')}
          >
            Về trang chủ
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentReturnPage;

