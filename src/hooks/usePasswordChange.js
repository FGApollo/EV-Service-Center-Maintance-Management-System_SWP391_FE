import { useState } from "react";
import { changePassword } from "../api";

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const usePasswordChange = () => {
  const [passwordData, setPasswordData] = useState(initialPassword);
  const [saving, setSaving] = useState(false);

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
      alert("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setSaving(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      resetPasswordForm();
      alert("✅ Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi xảy ra khi đổi mật khẩu!";
      alert(`❌ Lỗi: ${errorMessage}`);
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

