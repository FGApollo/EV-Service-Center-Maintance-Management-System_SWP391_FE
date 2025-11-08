import React from "react";
import ImageSlider from "../components/ImageSlider";
import "./Home.css";

function Home({ onNavigate }) {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div id="home" className="home-container">
      {/*Hero Slider*/}
      <ImageSlider />

      {/*Services Section*/}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2>Dịch Vụ Của Chúng Tôi</h2>
          <p>Chúng tôi cung cấp đầy đủ các dịch vụ bảo dưỡng và sửa chữa xe hơi chuyên nghiệp</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon blue-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
              </svg>
            </div>
            <h3>Bảo Dưỡng Định Kỳ</h3>
            <p>Thay dầu, kiểm tra phanh, lọc gió, và các dịch vụ bảo dưỡng theo lịch trình nhà sản xuất</p>
            <ul className="service-list">
              <li>✓ Thay dầu động cơ</li>
              <li>✓ Kiểm tra hệ thống phanh</li>
              <li>✓ Thay lọc gió, lọc dầu</li>
              <li>✓ Kiểm tra lốp xe</li>
            </ul>
          </div>
          
          <div className="service-card">
            <div className="service-icon blue-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
              </svg>
            </div>
            <h3>Sửa Chữa Động Cơ</h3>
            <p>Chẩn đoán và sửa chữa các vấn đề về động cơ với thiết bị hiện đại và kỹ thuật viên chuyên nghiệp</p>
            <ul className="service-list">
              <li>✓ Chẩn đoán lỗi động cơ</li>
              <li>✓ Sửa chữa hệ thống làm mát</li>
              <li>✓ Thay thế phụ tùng</li>
              <li>✓ Điều chỉnh động cơ</li>
            </ul>
          </div>
          
          <div className="service-card">
            <div className="service-icon orange-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
              </svg>
            </div>
            <h3>Hệ Thống Phanh & Lốp</h3>
            <p>Kiểm tra, bảo dưỡng và thay thế hệ thống phanh cùng các dịch vụ về lốp xe</p>
            <ul className="service-list">
              <li>✓ Thay má phanh</li>
              <li>✓ Bảo dưỡng đĩa phanh</li>
              <li>✓ Cân bằng lốp</li>
              <li>✓ Thay lốp mới</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon green-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z"/>
              </svg>
            </div>
            <h3>Hệ Thống Điện</h3>
            <p>Kiểm tra và sửa chữa hệ thống điện, bình ắc quy và các thiết bị điện tử trên xe</p>
            <ul className="service-list">
              <li>✓ Kiểm tra ắc quy</li>
              <li>✓ Sửa hệ thống đánh lửa</li>
              <li>✓ Thay bóng đèn</li>
              <li>✓ Chẩn đoán điện tử</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon blue-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10 2.04,10.5 2.14,11H3.17C3.06,10.5 3,10 3,9.5A4.5,4.5 0 0,1 7.5,5A4.5,4.5 0 0,1 12,9.5C12,10 11.94,10.5 11.83,11H12.86C12.96,10.5 13,10 13,9.5A5.5,5.5 0 0,0 7.5,4M16.5,4A5.5,5.5 0 0,0 11,9.5C11,10 11.04,10.5 11.14,11H12.17C12.06,10.5 12,10 12,9.5A4.5,4.5 0 0,1 16.5,5A4.5,4.5 0 0,1 21,9.5C21,10 20.94,10.5 20.83,11H21.86C21.96,10.5 22,10 22,9.5A5.5,5.5 0 0,0 16.5,4M12,13L16,18H13V22H11V18H8L12,13Z"/>
              </svg>
            </div>
            <h3>Điều Hòa & Làm Mát</h3>
            <p>Bảo dưỡng hệ thống điều hòa không khí và hệ thống làm mát động cơ</p>
            <ul className="service-list">
              <li>✓ Nạp gas điều hòa</li>
              <li>✓ Vệ sinh dàn lạnh</li>
              <li>✓ Thay lọc gió điều hòa</li>
              <li>✓ Sửa máy nén khí</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon red-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
              </svg>
            </div>
            <h3>Chăm Sóc Ngoại Thất</h3>
            <p>Dịch vụ rửa xe, đánh bóng và bảo vệ ngoại thất xe hơi của bạn</p>
            <ul className="service-list">
              <li>✓ Rửa xe chuyên nghiệp</li>
              <li>✓ Đánh bóng sơn xe</li>
              <li>✓ Phủ ceramic</li>
              <li>✓ Vệ sinh nội thất</li>
            </ul>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="services-cta">
          <button 
            className="cta-button primary"
            onClick={() => onNavigate('booking')}
          >
            Đặt Lịch Bảo Dưỡng Ngay
          </button>
          <p className="cta-text">Đặt lịch online - Tiện lợi và nhanh chóng</p>
        </div>
      </section>

      {/* Premium Branches Section */}
      <section id="branches" className="premium-branches-section">
        <div className="section-header">
          <h2>Hệ Thống Chi Nhánh</h2>
          <p>Tìm chi nhánh gần nhất để được phục vụ tốt nhất</p>
        </div>

        <div className="branches-with-map-container">
          <div className="premium-branches-grid">
            {/* Branch 1 - Quận 1 */}
            <div className="compact-branch-card">
              <div className="compact-badge">
                <span className="compact-number">01</span>
              </div>
              
              <div className="compact-branch-image" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)'
              }}>
                <div className="compact-overlay"></div>
              </div>
              
              <div className="compact-content">
                <h4>Chi Nhánh Quận 1</h4>
                
                <div className="compact-info">
                  <div className="compact-info-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                    </svg>
                    <span>123 Lê Lợi, Quận 1, HCM</span>
                  </div>
                  
                  <div className="compact-info-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                    </svg>
                    <span>024-3456-7890</span>
                  </div>
                  
                  <div className="compact-info-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                    </svg>
                    <span>Thứ 2 - Thứ 7: 8:00 - 18:00</span>
                  </div>
                </div>
                
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=123+Lê+Lợi+Quận+1+Hồ+Chí+Minh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="compact-map-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                  </svg>
                  <span>Xem trên Google Maps</span>
                </a>
              </div>
            </div>

            {/* Branch 2 - Thủ Đức */}
            <div className="compact-branch-card">
              <div className="compact-badge">
                <span className="compact-number">02</span>
              </div>
              
              <div className="compact-branch-image" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)'
              }}>
                <div className="compact-overlay"></div>
              </div>
              
              <div className="compact-content">
                <h4>Chi Nhánh Thủ Đức</h4>
                
                <div className="compact-info">
                  <div className="compact-info-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                    </svg>
                    <span>456 Võ Văn Ngân, Thủ Đức, HCM</span>
                  </div>
                  
                  <div className="compact-info-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                    </svg>
                    <span>028-0876-5432</span>
                  </div>
                  
                  <div className="compact-info-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                    </svg>
                    <span>Thứ 2 - Thứ 7: 8:00 - 18:00</span>
                  </div>
                </div>
                
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=456+Võ+Văn+Ngân+Thủ+Đức+Hồ+Chí+Minh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="compact-map-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                  </svg>
                  <span>Xem trên Google Maps</span>
                </a>
              </div>
              </div>
            </div>

          {/* Custom Professional Map */}
          <div className="professional-map-container">
            <div className="map-header">
              <div className="map-title">
                <svg className="map-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
                <h3>Vị Trí Chi Nhánh</h3>
              </div>
              <p className="map-subtitle">Hồ Chí Minh, Việt Nam</p>
            </div>

            <div className="custom-map">
              {/* Map Background */}
              <div className="map-background">
                <div className="map-grid"></div>
                
                {/* Location Markers */}
                <div className="location-marker marker-1" data-branch="1">
                  <div className="marker-pulse"></div>
                  <div className="marker-pin">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
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
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                    </svg>
                  </div>
                  <div className="marker-label">
                    <span className="label-number">02</span>
                    <span className="label-text">Thủ Đức</span>
                  </div>
                </div>

                {/* Connection Line */}
                <svg className="connection-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  <line x1="35" y1="45" x2="65" y2="60" stroke="url(#lineGradient)" strokeWidth="0.5" strokeDasharray="2,2"/>
                </svg>

                {/* Decorative Elements */}
                <div className="map-decoration deco-1"></div>
                <div className="map-decoration deco-2"></div>
                <div className="map-decoration deco-3"></div>
              </div>

              {/* Map Stats */}
              <div className="map-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
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
                      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
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
                      <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">Dịch vụ EV</span>
                    <span className="stat-label">Chuyên nghiệp</span>
                  </div>
                </div>
            </div>
          </div>

            {/* Map Footer */}
            <div className="map-footer">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                </svg>
                <span>Xem trên Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="premium-contact-cta">
          <div className="cta-content-wrapper">
            <div className="cta-text-content">
            <h3>Cần Hỗ Trợ Tư Vấn?</h3>
            <p>Liên hệ hotline để được tư vấn và đặt lịch hẹn miễn phí</p>
            </div>
            <div className="cta-actions">
              <button 
                onClick={() => onNavigate && onNavigate('booking')}
                className="premium-cta-btn primary"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
                </svg>
                <span>Đặt Lịch Hẹn</span>
              </button>
              <a href="tel:1900636468" className="premium-cta-btn secondary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                </svg>
                <span>1900 636 468</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
