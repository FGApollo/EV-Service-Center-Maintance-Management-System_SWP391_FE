import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./BookingBranchStep.css";

const BookingBranchStep = ({ formData, handleInputChange, serviceCenters, loading, error, onRetry }) => (
  <div className="booking-step-content">
    <div className="form-section">
      <h2>
        <span className="form-section-icon">📍</span>
        Chọn chi nhánh dịch vụ
      </h2>
      
      {loading ? (
        <div className="branch-loading-state">
          <FaSpinner className="spinner" />
          <p>Đang tải danh sách chi nhánh...</p>
        </div>
      ) : error ? (
        <div className="branch-error-state">
          <p>❌ {error}</p>
          {onRetry && (
            <button className="retry-btn" onClick={onRetry}>
              Thử lại
            </button>
          )}
        </div>
      ) : !serviceCenters || serviceCenters.length === 0 ? (
        <div className="branch-empty-state">
          <p>Không có chi nhánh nào</p>
        </div>
      ) : (
        <div className="selection-grid branch-selection-grid">
          {serviceCenters.map((center) => (
            <div
              key={center.id}
              className={`selection-card branch-card ${
                formData.serviceCenterId === center.id ? "selected" : ""
              }`}
              onClick={() => handleInputChange("serviceCenterId", center.id)}
            >
              <div className="selection-card-header branch-card-header">
                <span className="selection-card-icon branch-card-icon">
                  {center.icon || "🏢"}
                </span>
                <input
                  type="radio"
                  name="serviceCenter"
                  className="selection-checkbox branch-radio"
                  checked={formData.serviceCenterId === center.id}
                  onChange={() => {}}
                />
              </div>
              <h3>
                {center.name}
              </h3>
              <div className="branch-info">
                <p className="branch-info-item">
                  <span>📍</span>
                  <span>
                    {center.address}{center.city ? `, ${center.city}` : ''}
                  </span>
                </p>
                {center.phone && (
                  <p className="branch-info-item center">
                    <span>📞</span>
                    <span>{center.phone}</span>
                  </p>
                )}
                {center.email && (
                  <p className="branch-info-item center">
                    <span>✉️</span>
                    <span>{center.email}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default BookingBranchStep;

