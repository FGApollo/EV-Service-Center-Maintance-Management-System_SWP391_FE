import React, { useMemo, useState } from "react";
import "./Profile.css";
import useProfile from "../hooks/useProfile";
import usePasswordChange from "../hooks/usePasswordChange";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfilePasswordForm from "../components/profile/ProfilePasswordForm";
import ProfileHistory from "../components/profile/ProfileHistory";

const bookingHistoryMock = [
  {
    id: 1,
    date: "2025-10-15",
    service: "Bảo dưỡng định kỳ",
    status: "Hoàn thành",
    price: "1,500,000 VNĐ",
  },
  {
    id: 2,
    date: "2025-09-20",
    service: "Thay dầu máy",
    status: "Hoàn thành",
    price: "500,000 VNĐ",
  },
  {
    id: 3,
    date: "2025-10-18",
    service: "Kiểm tra tổng quát",
    status: "Đang xử lý",
    price: "800,000 VNĐ",
  },
];

function Profile({ onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const {
    profileData,
    loading,
    saving: savingProfile,
    handleProfileChange,
    handleAvatarChange,
    saveProfile,
  } = useProfile();
  const {
    passwordData,
    saving: savingPassword,
    handlePasswordChange,
    submitPasswordChange,
  } = usePasswordChange();

  const bookingHistory = useMemo(() => bookingHistoryMock, []);

  const handleSubmitProfile = async (event) => {
    event.preventDefault();
    try {
      await saveProfile();
      setIsEditing(false);
    } catch (error) {
      // Errors are surfaced inside the hook via alert/logging
    }
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    try {
      await submitPasswordChange();
    } catch (error) {
      // Errors are surfaced inside the hook via alert/logging
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <ProfileHeader onBack={() => onNavigate("home")} />
        <div
          className="profile-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="spinner"
              style={{
                margin: "0 auto 20px",
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileHeader onBack={() => onNavigate("home")} />
      <div className="profile-content">
        <ProfileSidebar
          profileData={profileData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAvatarChange={handleAvatarChange}
        />

        <div className="profile-main">
          {activeTab === "info" && (
            <ProfileInfoForm
              profileData={profileData}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing((prev) => !prev)}
              onChange={handleProfileChange}
              onSubmit={handleSubmitProfile}
              saving={savingProfile}
            />
          )}

          {activeTab === "password" && (
            <ProfilePasswordForm
              passwordData={passwordData}
              onChange={handlePasswordChange}
              onSubmit={handleSubmitPassword}
              saving={savingPassword}
            />
          )}

          {activeTab === "history" && (
            <ProfileHistory bookingHistory={bookingHistory} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

