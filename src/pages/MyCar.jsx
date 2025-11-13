import React from "react";
import "./MyCar.css";
import useVehicles from "../hooks/useVehicles";
import VehicleList from "../components/mycar/VehicleList";

function MyCar({ onNavigate, onNavigateWithVehicle }) {
  const { vehicles, loading, error, refresh } = useVehicles();

  const handleBook = (vehicle) => {
    if (onNavigateWithVehicle) {
      onNavigateWithVehicle("booking", vehicle);
      return;
    }
    onNavigate("booking");
  };

  return (
    <div className="mycar-container">
      {/* Header */}
      <div className="mycar-header">
        <button 
          className="back-btn"
          onClick={() => onNavigate('home')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
          Quay lại
        </button>
        <h1>Xe của tôi</h1>
      </div>

      {/* Car List */}
      <div className="mycar-content">
        <VehicleList
          vehicles={vehicles}
          loading={loading}
          error={error}
          onRetry={refresh}
          onBook={handleBook}
        />
      </div>
    </div>
  );
}

export default MyCar;
