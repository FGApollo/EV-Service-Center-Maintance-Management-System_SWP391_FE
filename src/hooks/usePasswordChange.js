import { useState } from "react";
import { changePassword } from "../api";

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const usePasswordChange = (toast) => {
  const [passwordData, setPasswordData] = useState(initialPassword);
  const [saving, setSaving] = useState(false);
  
  const showMessage = (message, type = 'info') => {
    if (toast) {
      switch(type) {
        case 'success': toast.showSuccess(message); break;
        case 'error': toast.showError(message); break;
        case 'warning': toast.showWarning(message); break;
        default: toast.showInfo(message);
      }
    } else {
      alert(message);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetPasswordForm = () => {
    setPasswordData(initialPassword);
  };

  const submitPasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("Mật khẩu xác nhận không khớp!", 'error');
      return;
    }

    try {
      setSaving(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      resetPasswordForm();
      showMessage("Đổi mật khẩu thành công!", 'success');
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi xảy ra khi đổi mật khẩu!";
      showMessage(`Lỗi: ${errorMessage}`, 'error');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    passwordData,
    saving,
    handlePasswordChange,
    submitPasswordChange,
  };
};

export default usePasswordChange;

