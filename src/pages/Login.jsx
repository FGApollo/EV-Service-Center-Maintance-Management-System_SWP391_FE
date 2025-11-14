import React from "react";
import "./Login.css";
<<<<<<< HEAD
import AuthForm from "../components/login/AuthForm";
import useAuthForm from "../hooks/useAuthForm";

function Login({ onNavigate, onLogin }) {
  const {
    formData,
    isSignUp,
    loading,
    handleInputChange,
    handleSubmit,
    toggleSignUp,
  } = useAuthForm({ onNavigate, onLogin });
=======
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
          onNavigate("home");
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
>>>>>>> main

  return (
    <div className="login-container">
      {/* Back to Home */}
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

      {/* Background */}
      <div className="login-background">
        <div className="login-bg-overlay"></div>
      </div>

      {/* Form Login */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-logo">
            <h1>CarCare</h1>
            <p>Dịch vụ xe hơi chuyên nghiệp</p>
          </div>

          <div className="login-form-box">
            <h2>{isSignUp ? "Tạo Tài Khoản" : "Đăng Nhập"}</h2>

            <AuthForm
              isSignUp={isSignUp}
              formData={formData}
              loading={loading}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onToggleMode={toggleSignUp}
            />
          </div>

          <div className="login-footer">
            <p>© 2025 CarCare.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
