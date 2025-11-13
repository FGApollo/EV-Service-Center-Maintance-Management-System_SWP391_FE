import { useCallback, useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api";

const initialProfile = {
  user_id: null,
  fullName: "Người dùng",
  email: "user@example.com",
  phone: "0123456789",
  address: "Chưa cập nhật",
  avatar: null,
};

const useProfile = () => {
  const [profileData, setProfileData] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfileData((prev) => ({
          ...prev,
          user_id: parsed.user_id || parsed.id || parsed.userId || prev.user_id,
          fullName: parsed.fullName || prev.fullName,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          address: parsed.address || prev.address,
          avatar: parsed.avatar || prev.avatar,
        }));
      }

      try {
        const data = await getProfile();
        const updatedData = {
          user_id:
            data.user_id ||
            data.id ||
            data.userId ||
            profileData.user_id ||
            null,
          fullName: data.fullName || initialProfile.fullName,
          email: data.email || initialProfile.email,
          phone: data.phone || initialProfile.phone,
          address: data.address || initialProfile.address,
          avatar: data.avatar || initialProfile.avatar,
        };

        setProfileData(updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData));
      } catch (apiError) {
        console.warn(
          "⚠️ Không thể load profile từ API, sử dụng dữ liệu localStorage:",
          apiError
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải thông tin profile:", error);
    } finally {
      setLoading(false);
    }
  }, [profileData.user_id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!profileData.user_id) {
      console.error("❌ Không tìm thấy user_id trong profileData");
      alert("❌ Không tìm thấy User ID. Vui lòng đăng nhập lại!");
      return;
    }

    try {
      setSaving(true);
      const response = await updateProfile(profileData.user_id, {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar,
      });

      const updated = { ...profileData, ...response };
      localStorage.setItem("user", JSON.stringify(updated));
      setProfileData(updated);
      alert("✅ Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.statusText ||
        "Có lỗi xảy ra khi cập nhật thông tin!";

      alert(
        `❌ Lỗi: ${errorMessage}\n\nStatus: ${
          error.response?.status || "Unknown"
        }`
      );
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    profileData,
    loading,
    saving,
    handleProfileChange,
    handleAvatarChange,
    saveProfile,
  };
};

export default useProfile;

