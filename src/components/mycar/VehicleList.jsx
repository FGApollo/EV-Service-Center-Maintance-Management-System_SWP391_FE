import React from "react";
import VehicleCard from "./VehicleCard";

const LoadingState = () => (
  <div className="loading-state">
    <div className="spinner"></div>
    <p>Đang tải danh sách xe...</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="error-state">
    <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
      <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>
    <h2>Có lỗi xảy ra</h2>
    <p>{message}</p>
    <button className="retry-btn" onClick={onRetry}>
      Thử lại
    </button>
  </div>
);

const EmptyState = () => (
  <div className="empty-state">
    <svg viewBox="0 0 24 24" fill="currentColor" width="100" height="100">
      <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z" />
    </svg>
    <h2>Chưa có xe nào</h2>
    <p>Liên hệ quản trị viên để thêm xe của bạn</p>
  </div>
);

const VehicleList = ({ vehicles, loading, error, onRetry, onBook }) => {
  if (loading && vehicles.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (vehicles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="car-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onBook={onBook} />
      ))}
    </div>
  );
};

export default VehicleList;

