import React, { useState } from 'react';
import './Login.css';

function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [isSignUp, setIsSignUp] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Giả lập đăng nhập thành công
    if (onLogin) {
      onLogin(true);
    }
    alert(isSignUp ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
    onNavigate('home');
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    });
  };

  return (
    <div className="login-container">

      {/* Back to Home Button */}
      <button 
        className="back-to-home-btn"
        onClick={() => onNavigate('home')}
        title="Quay về trang chủ"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
        </svg>
        <span>Trang chủ</span>
      </button>

      {/* Background Video/Image */}
      <div className="login-background">
        <div className="login-bg-overlay"></div>
      </div>

      {/* Login Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">

          {/* Logo */}
          <div className="login-logo">
            <h1>CarCare</h1>
            <p>Dịch vụ xe hơi chuyên nghiệp</p>
          </div>

          {/* Form */}
          <div className="login-form-box">
            <h2>{isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập'}</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="fullName">Họ và Tên</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Nhập họ và tên của bạn"
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    required={isSignUp}
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="form-options">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Ghi nhớ đăng nhập
                  </label>
                  
                  <a href="#forgot" className="forgot-password">
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              <button type="submit" className="login-btn">
                {isSignUp ? 'Tạo Tài Khoản' : 'Đăng Nhập'}
              </button>

             

              <div className="form-toggle">
                <p>
                  {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                  <button 
                    type="button" 
                    onClick={toggleSignUp}
                    className="toggle-btn"
                  >
                    {isSignUp ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>© 2025 CarCare. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;