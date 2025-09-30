import React from "react";
import ImageSlider from "../components/ImageSlider";
import "./Home.css";

function Home({ onNavigate }) {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <div id="home" className="home-container">
      {/* Tesla-style Hero Slider */}
      <ImageSlider />

      {/* Services Section */}
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
      </section>

      {/* Branches Map Section */}
      <section id="branches" className="branches-section">
        <div className="section-header">
          <h2>Hệ Thống Chi Nhánh</h2>
          <p>Tìm chi nhánh gần nhất để được phục vụ tốt nhất</p>
        </div>

        <div className="branches-container">
          <div className="branches-sidebar">
            <div className="branch-card active">
              <div className="branch-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
              </div>
              <div className="branch-info">
                <h4>Chi Nhánh Quận 1</h4>
                <p className="branch-address">123 Đường Nguyễn Huệ, Quận 1, TP.HCM</p>
                <p className="branch-phone">📞 028 3822 1234</p>
                <p className="branch-hours">🕒 7:00 - 19:00 (Thứ 2 - CN)</p>
              </div>
            </div>

            <div className="branch-card">
              <div className="branch-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
              </div>
              <div className="branch-info">
                <h4>Chi Nhánh Thủ Đức</h4>
                <p className="branch-address">32 Đường T4A, Tây Thạnh, TP.HCM</p>
                <p className="branch-phone">📞 090 9013 317</p>
                <p className="branch-hours">🕒 7:00 - 19:00 (Thứ 2 - CN)</p>
              </div>
            </div>

            <div className="branch-card">
              <div className="branch-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
              </div>
              <div className="branch-info">
                <h4>Chi Nhánh Tân Bình</h4>
                <p className="branch-address">789 Đường Cộng Hòa, Quận Tân Bình, TP.HCM</p>
                <p className="branch-phone">📞 028 3844 9012</p>
                <p className="branch-hours">🕒 7:00 - 19:00 (Thứ 2 - CN)</p>
              </div>
            </div>

            <div className="branch-card">
              <div className="branch-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                </svg>
              </div>
              <div className="branch-info">
                <h4>Chi Nhánh Bình Thạnh</h4>
                <p className="branch-address">321 Đường Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM</p>
                <p className="branch-phone">📞 028 3899 3456</p>
                <p className="branch-hours">🕒 7:00 - 19:00 (Thứ 2 - CN)</p>
              </div>
            </div>
          </div>

          <div className="map-container">
            <div className="map-placeholder">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325135276939!2d106.69662097503163!3d10.775431760959862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bce1%3A0xdf2c0bb1c956c5b!2zTmd1eeG7hW4gSHXhu4MsIEJlbiBOZ2jDqiwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1697535000000!5m2!1svi!2s"
                width="100%" 
                height="100%" 
                style={{border: 0, borderRadius: '12px'}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ chi nhánh CarCare"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="contact-cta">
          <div className="cta-content">
            <h3>Cần Hỗ Trợ Tư Vấn?</h3>
            <p>Liên hệ hotline để được tư vấn và đặt lịch hẹn miễn phí</p>
            <div className="cta-buttons">
              <button 
                onClick={() => onNavigate && onNavigate('booking')}
                className="btn-primary booking-cta"
              >
                📅 Đặt Lịch Hẹn
              </button>
              <a href="tel:1900636468" className="btn-secondary">
                📞 Hotline: 1900 636 468
              </a>
              <a href="#services" className="btn-secondary" onClick={(e) => {
                e.preventDefault();
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Xem Dịch Vụ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
