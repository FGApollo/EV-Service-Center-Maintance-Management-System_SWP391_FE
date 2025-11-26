import React from 'react';
import { FaMoneyBillWave, FaCreditCard, FaStore } from 'react-icons/fa';
import './BookingPaymentStep.css';

const BookingPaymentStep = ({ formData, handleInputChange }) => {
  const paymentMethods = [
    {
      id: 'online',
      name: 'Thanh toán online',
      description: 'Thanh toán ngay bằng VNPay, MoMo hoặc thẻ ngân hàng',
      icon: <FaCreditCard />,
      color: '#667eea'
    },
    {
      id: 'counter',
      name: 'Thanh toán tại quầy',
      description: 'Thanh toán khi đến nhận xe tại chi nhánh',
      icon: <FaStore />,
      color: '#ed8936'
    }
  ];

  return (
    <div className="booking-step-content">
      <div className="form-section">
        <h2>Chọn phương thức thanh toán</h2>
        <p className="payment-step-description">
          Bạn có thể chọn thanh toán ngay hoặc thanh toán khi đến quầy nhận xe
        </p>
        
        <div className="payment-methods-grid">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`payment-method-card ${
                formData.paymentMethod === method.id ? 'selected' : ''
              }`}
              onClick={() => handleInputChange('paymentMethod', method.id)}
            >
              <div className="payment-method-icon" style={{ color: method.color }}>
                {method.icon}
              </div>
              <div className="payment-method-content">
                <h3 className="payment-method-name">{method.name}</h3>
                <p className="payment-method-description">{method.description}</p>
              </div>
              <div className="payment-method-radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  id={`payment-${method.id}`}
                  value={method.id}
                  checked={formData.paymentMethod === method.id}
                  onChange={() => handleInputChange('paymentMethod', method.id)}
                />
                <label htmlFor={`payment-${method.id}`}></label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentStep;

