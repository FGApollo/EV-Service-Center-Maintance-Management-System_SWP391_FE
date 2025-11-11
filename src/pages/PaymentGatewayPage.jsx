import React, { useEffect } from 'react';

function PaymentGatewayPage({ appointmentData, onNavigate, onPaymentComplete }) {
  useEffect(() => {
    console.warn('⚠️ PaymentGatewayPage chưa được triển khai chi tiết.');
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Thanh toán đang được xử lý</h1>
      <p>Chúng tôi đang chuẩn bị chuyển bạn tới cổng thanh toán.</p>
      <pre style={{ textAlign: 'left', margin: '1rem auto', maxWidth: '600px', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        {JSON.stringify(appointmentData, null, 2)}
      </pre>
      <button
        style={{ marginRight: '1rem' }}
        onClick={() => onNavigate && onNavigate('booking')}
      >
        Quay lại đặt lịch
      </button>
      <button
        onClick={() => onPaymentComplete && onPaymentComplete(appointmentData)}
      >
        Đánh dấu đã thanh toán
      </button>
    </div>
  );
}

export default PaymentGatewayPage;

