import React from "react";

const branches = [
  {
    id: "01",
    name: "Chi Nhánh Quận 1",
    address: "123 Lê Lợi, Quận 1, HCM",
    phone: "024-3456-7890",
    hours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=123+Lê+Lợi+Quận+1+Hồ+Chí+Minh",
  },
  {
    id: "02",
    name: "Chi Nhánh Thủ Đức",
    address: "456 Võ Văn Ngân, Thủ Đức, HCM",
    phone: "028-0876-5432",
    hours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=456+Võ+Văn+Ngân+Thủ+Đức+Hồ+Chí+Minh",
  },
];

const CompactBranchCard = ({
  id,
  name,
  address,
  phone,
  hours,
  image,
  mapLink,
}) => (
  <div className="compact-branch-card">
    <div className="compact-badge">
      <span className="compact-number">{id}</span>
    </div>

    <div
      className="compact-branch-image"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="compact-overlay"></div>
    </div>

    <div className="compact-content">
      <h4>{name}</h4>

      <div className="compact-info">
        <div className="compact-info-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
          </svg>
          <span>{address}</span>
        </div>

        <div className="compact-info-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
          </svg>
          <span>{phone}</span>
        </div>

        <div className="compact-info-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
          </svg>
          <span>{hours}</span>
        </div>
      </div>

      <a
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="compact-map-link"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
        </svg>
        <span>Xem trên Google Maps</span>
      </a>
    </div>
  </div>
);

const ProfessionalMap = () => (
  <div className="professional-map-container">
    <div className="map-header">
      <div className="map-title">
        <svg className="map-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
        </svg>
        <h3>Vị Trí Chi Nhánh</h3>
      </div>
      <p className="map-subtitle">Hồ Chí Minh, Việt Nam</p>
    </div>

    <div className="custom-map">
      <div className="map-background">
        <div className="map-grid"></div>

        <div className="location-marker marker-1" data-branch="1">
          <div className="marker-pulse"></div>
          <div className="marker-pin">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
            </svg>
          </div>
          <div className="marker-label">
            <span className="label-number">01</span>
            <span className="label-text">Quận 1</span>
          </div>
        </div>

        <div className="location-marker marker-2" data-branch="2">
          <div className="marker-pulse"></div>
          <div className="marker-pin">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
            </svg>
          </div>
          <div className="marker-label">
            <span className="label-number">02</span>
            <span className="label-text">Thủ Đức</span>
          </div>
        </div>

        <svg className="connection-line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <line
            x1="35"
            y1="45"
            x2="65"
            y2="60"
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        </svg>

        <div className="map-decoration deco-1"></div>
        <div className="map-decoration deco-2"></div>
        <div className="map-decoration deco-3"></div>
      </div>

      <div className="map-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">8:00 - 18:00</span>
            <span className="stat-label">Giờ hoạt động</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">2 Chi nhánh</span>
            <span className="stat-label">Tại TP.HCM</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">Dịch vụ EV</span>
            <span className="stat-label">Chuyên nghiệp</span>
          </div>
        </div>
      </div>
    </div>

    <div className="map-footer">
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="map-link"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
        </svg>
        <span>Xem trên Google Maps</span>
      </a>
    </div>
  </div>
);

const BranchesSection = ({ onNavigate }) => (
  <section id="branches" className="premium-branches-section">
    <div className="section-header">
      <h2>Hệ Thống Chi Nhánh</h2>
      <p>Tìm chi nhánh gần nhất để được phục vụ tốt nhất</p>
    </div>

    <div className="branches-with-map-container">
      <div className="premium-branches-grid">
        {branches.map((branch) => (
          <CompactBranchCard key={branch.id} {...branch} />
        ))}
      </div>

      <ProfessionalMap />
    </div>

    <div className="premium-contact-cta">
      <div className="cta-content-wrapper">
        <div className="cta-text-content">
          <h3>Cần Hỗ Trợ Tư Vấn?</h3>
          <p>Liên hệ hotline để được tư vấn và đặt lịch hẹn miễn phí</p>
        </div>
        <div className="cta-actions">
          <button
            onClick={() => onNavigate && onNavigate("booking")}
            className="premium-cta-btn primary"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
            </svg>
            <span>Đặt Lịch Hẹn</span>
          </button>
          <a href="tel:1900636468" className="premium-cta-btn secondary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
            </svg>
            <span>1900 636 468</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default BranchesSection;

