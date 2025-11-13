import { useState } from "react";
import { login, register } from "../api";

const initialFormState = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
};

const useAuthForm = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const toggleSignUp = () => {
    setIsSignUp((prev) => !prev);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
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

        const response = await register(newUser);
        console.log("✅ Đăng ký thành công:", response);
        alert("Đăng ký thành công! Hãy đăng nhập.");
        setIsSignUp(false);
        resetForm();
        return;
      }

      const credentials = {
        email: formData.email,
        password: formData.password,
      };

      const response = await login(credentials);
      console.log("✅ Đăng nhập thành công:", response);

      if (!response.token) {
        alert("Không nhận được token!");
        return;
      }

      const userInfo = response.user || response;
      const userData = {
        user_id: userInfo.user_id || userInfo.id || userInfo.userId,
        fullName: userInfo.fullName || "",
        email: userInfo.email || credentials.email,
        phone: userInfo.phone || "",
        address: userInfo.address || "",
        avatar: userInfo.avatar || null,
        role: userInfo.role || "customer",
        center_id: userInfo.center_id || userInfo.centerId || null,
      };

      console.log("Lưu user data vào localStorage:", userData);
      try {
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (storageError) {
        console.error("Lỗi lưu localStorage:", storageError);
      }

      alert("Đăng nhập thành công!");
      if (onLogin) {
        onLogin(userData);
      }
      onNavigate("home");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error.response?.data || error.message);
      alert("Lỗi khi gọi API, xem console để biết thêm chi tiết!");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    isSignUp,
    loading,
    handleInputChange,
    handleSubmit,
    toggleSignUp,
  };
};

export default useAuthForm;

