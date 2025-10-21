import React, { useState } from 'react';
import './MyCar.css';

function MyCar({ onNavigate }) {
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [cars, setCars] = useState([
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: '29A-12345',
      color: 'Đỏ',
      image: null,
      lastService: '2025-09-15',
      nextService: '2025-12-15'
    },
    {
      id: 2,
      brand: 'VinFast',
      model: 'VF e34',
      year: 2024,
      licensePlate: '30B-67890',
      color: 'Trắng',
      image: null,
      lastService: '2025-10-01',
      nextService: '2026-01-01'
    }
  ]);

  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCar(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCar = (e) => {
    e.preventDefault();
    const carToAdd = {
      id: cars.length + 1,
      ...newCar,
      lastService: null,
      nextService: null
    };
    setCars([...cars, carToAdd]);
    setNewCar({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      color: '',
      image: null
    });
    setIsAddingCar(false);
    alert('Thêm xe thành công!');
  };

  const handleDeleteCar = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
      setCars(cars.filter(car => car.id !== id));
      alert('Đã xóa xe thành công!');
    }
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
        <button 
          className="add-car-btn"
          onClick={() => setIsAddingCar(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          Thêm xe
        </button>
      </div>

      {/* Car List */}
      <div className="mycar-content">
        {cars.length > 0 ? (
          <div className="car-grid">
            {cars.map(car => (
              <div key={car.id} className="car-card">
                <div className="car-image">
                  {car.image ? (
                    <img src={car.image} alt={`${car.brand} ${car.model}`} />
                  ) : (
                    <div className="car-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
                        <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="car-info">
                  <h3>{car.brand} {car.model}</h3>
                  <div className="car-details">
                    <div className="detail-item">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z"/>
                      </svg>
                      <span>{car.licensePlate}</span>
                    </div>
                    <div className="detail-item">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                      </svg>
                      <span>Năm {car.year}</span>
                    </div>
                    <div className="detail-item">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                      </svg>
                      <span>Màu {car.color}</span>
                    </div>
                  </div>

                  {car.lastService && (
                    <div className="service-info">
                      <div className="service-item">
                        <span className="service-label">Bảo dưỡng gần nhất:</span>
                        <span className="service-date">{car.lastService}</span>
                      </div>
                      <div className="service-item">
                        <span className="service-label">Bảo dưỡng tiếp theo:</span>
                        <span className="service-date next">{car.nextService}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="car-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => onNavigate('booking')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19Z"/>
                    </svg>
                    Đặt lịch
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor" width="100" height="100">
              <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
            </svg>
            <h2>Chưa có xe nào</h2>
            <p>Thêm xe của bạn để quản lý và đặt lịch bảo dưỡng</p>
            <button 
              className="add-first-car-btn"
              onClick={() => setIsAddingCar(true)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
              </svg>
              Thêm xe đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Add Car Modal */}
      {isAddingCar && (
        <div className="modal-overlay" onClick={() => setIsAddingCar(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm xe mới</h2>
              <button 
                className="close-btn"
                onClick={() => setIsAddingCar(false)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCar} className="add-car-form">
              <div className="form-group">
                <label>Hãng xe *</label>
                <input
                  type="text"
                  name="brand"
                  value={newCar.brand}
                  onChange={handleInputChange}
                  placeholder="VD: Tesla, VinFast, BMW..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Mẫu xe *</label>
                <input
                  type="text"
                  name="model"
                  value={newCar.model}
                  onChange={handleInputChange}
                  placeholder="VD: Model 3, VF e34..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Năm sản xuất *</label>
                  <input
                    type="number"
                    name="year"
                    value={newCar.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Màu xe *</label>
                  <input
                    type="text"
                    name="color"
                    value={newCar.color}
                    onChange={handleInputChange}
                    placeholder="VD: Đỏ, Trắng, Đen..."
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Biển số xe *</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={newCar.licensePlate}
                  onChange={handleInputChange}
                  placeholder="VD: 29A-12345"
                  required
                />
              </div>

              <div className="form-group">
                <label>Ảnh xe (Tùy chọn)</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="car-image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="car-image" className="file-input-label">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
                    </svg>
                    {newCar.image ? 'Đã chọn ảnh' : 'Chọn ảnh xe'}
                  </label>
                </div>
                {newCar.image && (
                  <div className="image-preview">
                    <img src={newCar.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsAddingCar(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  Thêm xe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCar;
