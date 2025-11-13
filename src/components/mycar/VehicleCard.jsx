import React from "react";

const VehicleCard = ({ vehicle, onBook }) => (
  <div className="car-card">
    <div className="car-image">
      {vehicle.image ? (
        <img src={vehicle.image} alt={vehicle.model || "Vehicle"} />
      ) : (
        <div className="car-placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
            <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
          </svg>
        </div>
      )}
    </div>

    <div className="car-info">
      <h3>{vehicle.model || "Vehicle"}</h3>
      <div className="car-details">
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" />
          </svg>
          <span>{vehicle.licensePlate}</span>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          <span>Năm {vehicle.year}</span>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
          <span>Màu {vehicle.color}</span>
        </div>
      </div>

      {vehicle.lastService && (
        <div className="service-info">
          <div className="service-item">
            <span className="service-label">Bảo dưỡng gần nhất:</span>
            <span className="service-date">{vehicle.lastService}</span>
          </div>
          <div className="service-item">
            <span className="service-label">Bảo dưỡng tiếp theo:</span>
            <span className="service-date next">{vehicle.nextService}</span>
          </div>
        </div>
      )}
    </div>

    <div className="car-actions">
      <button
        className="action-btn edit"
        onClick={() => onBook(vehicle)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19Z" />
        </svg>
        Đặt lịch
      </button>
    </div>
  </div>
);

export default VehicleCard;

