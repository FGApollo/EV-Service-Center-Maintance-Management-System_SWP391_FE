import React, { useState } from "react";
import "./Login.css";
import { login, register } from "../api/index.js"; // ✅ Quay về named import

function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Xử lý submit form (đăng nhập / đăng ký thật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // ----- 🟩 ĐĂNG KÝ -----
        if (formData.password !== formData.confirmPassword) {
          alert("❌ Mật khẩu xác nhận không khớp!");
          setLoading(false);
          return;
        }

        const newUser = {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        };

        const res = await register(newUser);
        console.log("✅ Đăng ký thành công:", res);
        alert("Đăng ký thành công! Hãy đăng nhập.");
        setIsSignUp(false);
      } else {
        // ----- 🟦 ĐĂNG NHẬP -----
        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        const res = await login(credentials);
        console.log("✅ Đăng nhập thành công:", res);

        if (res.token) {
          // Xử lý dữ liệu user từ backend (có thể trong res.user hoặc ở top level)
          const userInfo = res.user || res;
          const userData = {
            user_id: userInfo.user_id || userInfo.id || userInfo.userId,
            fullName: userInfo.fullName || '',
            email: userInfo.email || credentials.email,
            phone: userInfo.phone || '',
            address: userInfo.address || '',
            avatar: userInfo.avatar || null,
            role: userInfo.role || 'customer'
          };
          
          console.log("💾 Lưu user data vào localStorage:", userData);
          try { localStorage.setItem('user', JSON.stringify(userData)); } catch (e) {
            console.error("Lỗi lưu localStorage:", e);
          }
          
          alert("🎉 Đăng nhập thành công!");
          if (onLogin) onLogin(userData);
          
          // Redirect theo role - Phân biệt rõ ràng Admin và Manager
          const role = userData.role?.toLowerCase();
          switch(role) {
            case 'admin':
              onNavigate("admin");
              break;
            case 'manager':
              onNavigate("manager/overview"); // ✅ Navigate đến overview tab
              break;
            case 'staff':
              onNavigate("staff");
              break;
            case 'technician':
              onNavigate("technician");
              break;
            case 'customer':
            default:
              onNavigate("home");
              break;
          }
        } else {
          alert("❌ Không nhận được token!");
        }
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error.response?.data || error.message);
      alert("Lỗi khi gọi API, xem console để biết thêm chi tiết!");
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });
  };

  return (
    <div className="login-container">
      {/* 🔙 Back to Home */}
      <button
        className="back-to-home-btn"
        onClick={() => onNavigate("home")}
        title="Quay về trang chủ"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
        <span>Trang chủ</span>
      </button>

      {/* 🌆 Background */}
      <div className="login-background">
        <div className="login-bg-overlay"></div>
      </div>

      {/* 📋 Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-logo">
            <h1>CarCare</h1>
            <p>Dịch vụ xe hơi chuyên nghiệp</p>
          </div>

          <div className="login-form-box">
            <h2>{isSignUp ? "Tạo Tài Khoản" : "Đăng Nhập"}</h2>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">Họ và Tên</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên của bạn"
                      required={isSignUp}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại của bạn"
                      required={isSignUp}
                    />
                  </div>
                </>
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
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                    required
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

              <button type="submit" className="login-btn" disabled={loading}>
                {loading
                  ? "Đang xử lý..."
                  : isSignUp
                  ? "Tạo Tài Khoản"
                  : "Đăng Nhập"}
              </button>

              <div className="form-toggle">
                <p>
                  {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                  <button
                    type="button"
                    onClick={toggleSignUp}
                    className="toggle-btn"
                  >
                    {isSignUp ? "Đăng nhập ngay" : "Đăng ký ngay"}
                  </button>
                </p>
              </div>
            </form>
          </div>

          <div className="login-footer">
            <p>© 2025 CarCare. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
