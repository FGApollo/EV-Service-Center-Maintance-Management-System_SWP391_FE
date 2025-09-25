import React from "react";
import "./Home.css";

function Home() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="home" className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Dịch Vụ Bảo Dưỡng
              <span className="title-highlight">Xe Hơi Chuyên Nghiệp</span>
            </h1>
            <p className="hero-description">
              Trung tâm bảo dưỡng và sửa chữa xe hơi hàng đầu với đội ngũ kỹ thuật viên 
              giàu kinh nghiệm và trang thiết bị hiện đại. Chúng tôi cam kết mang đến 
              dịch vụ tốt nhất cho chiếc xe của bạn.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🔧</div>
                <span>Bảo dưỡng định kỳ</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛠️</div>
                <span>Sửa chữa chuyên sâu</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <span>Chất lượng đảm bảo</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={scrollToServices}>
                Xem Dịch Vụ
              </button>
              <button className="btn-secondary" onClick={scrollToContact}>
                Liên Hệ Ngay
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Garage bảo dưỡng xe hơi chuyên nghiệp"
                className="main-image"
              />
              <div className="support-badge">
                <div className="badge-content">
                  <div className="badge-number">24/7</div>
                  <div className="badge-text">Hỗ trợ khẩn cấp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2>Dịch Vụ Của Chúng Tôi</h2>
          <p>Chúng tôi cung cấp đầy đủ các dịch vụ bảo dưỡng và sửa chữa xe hơi chuyên nghiệp</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🔧</div>
            <h3>Bảo Dưỡng Định Kỳ</h3>
            <p>Thay dầu, kiểm tra phanh, lọc gió, và các dịch vụ bảo dưỡng theo lịch trình nhà sản xuất</p>
            <ul className="service-list">
              <li>Thay dầu động cơ</li>
              <li>Kiểm tra hệ thống phanh</li>
              <li>Thay lọc gió, lọc dầu</li>
              <li>Kiểm tra lốp xe</li>
            </ul>
          </div>
          
          <div className="service-card">
            <div className="service-icon">⚙️</div>
            <h3>Sửa Chữa Động Cơ</h3>
            <p>Chẩn đoán và sửa chữa các vấn đề về động cơ với thiết bị hiện đại và kỹ thuật viên chuyên nghiệp</p>
            <ul className="service-list">
              <li>Chẩn đoán lỗi động cơ</li>
              <li>Sửa chữa hệ thống làm mát</li>
              <li>Thay thế phụ tùng</li>
              <li>Điều chỉnh động cơ</li>
            </ul>
          </div>
          
          <div className="service-card">
            <div className="service-icon">🛞</div>
            <h3>Hệ Thống Phanh & Lốp</h3>
            <p>Kiểm tra, bảo dưỡng và thay thế hệ thống phanh cùng các dịch vụ về lốp xe</p>
            <ul className="service-list">
              <li>Thay má phanh</li>
              <li>Bảo dưỡng đĩa phanh</li>
              <li>Cân bằng lốp</li>
              <li>Thay lốp mới</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">🔋</div>
            <h3>Hệ Thống Điện</h3>
            <p>Kiểm tra và sửa chữa hệ thống điện, bình ắc quy và các thiết bị điện tử trên xe</p>
            <ul className="service-list">
              <li>Kiểm tra ắc quy</li>
              <li>Sửa hệ thống đánh lửa</li>
              <li>Thay bóng đèn</li>
              <li>Chẩn đoán điện tử</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">❄️</div>
            <h3>Điều Hòa & Làm Mát</h3>
            <p>Bảo dưỡng hệ thống điều hòa không khí và hệ thống làm mát động cơ</p>
            <ul className="service-list">
              <li>Nạp gas điều hòa</li>
              <li>Vệ sinh dàn lạnh</li>
              <li>Thay lọc gió điều hòa</li>
              <li>Sửa máy nén khí</li>
            </ul>
          </div>

          <div className="service-card">
            <div className="service-icon">🚗</div>
            <h3>Chăm Sóc Ngoại Thất</h3>
            <p>Dịch vụ rửa xe, đánh bóng và bảo vệ ngoại thất xe hơi của bạn</p>
            <ul className="service-list">
              <li>Rửa xe chuyên nghiệp</li>
              <li>Đánh bóng sơn xe</li>
              <li>Phủ ceramic</li>
              <li>Vệ sinh nội thất</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Liên Hệ Với Chúng Tôi</h2>
            <p>Đặt lịch hẹn hoặc tư vấn miễn phí ngay hôm nay</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Địa chỉ</h4>
                  <p>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Điện thoại</h4>
                  <p>0123 456 789 - 0987 654 321</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <h4>Giờ làm việc</h4>
                  <p>Thứ 2 - Chủ nhật: 7:00 - 19:00</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Đặt Lịch Hẹn</h3>
            <form>
              <input type="text" placeholder="Họ và tên" required />
              <input type="tel" placeholder="Số điện thoại" required />
              <input type="email" placeholder="Email" />
              <select required>
                <option value="">Chọn dịch vụ</option>
                <option value="maintenance">Bảo dưỡng định kỳ</option>
                <option value="engine">Sửa chữa động cơ</option>
                <option value="brake">Hệ thống phanh & lốp</option>
                <option value="electrical">Hệ thống điện</option>
                <option value="ac">Điều hòa & làm mát</option>
                <option value="exterior">Chăm sóc ngoại thất</option>
              </select>
              <textarea placeholder="Ghi chú thêm (tùy chọn)" rows="3"></textarea>
              <button type="submit" className="btn-primary">Gửi Yêu Cầu</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
