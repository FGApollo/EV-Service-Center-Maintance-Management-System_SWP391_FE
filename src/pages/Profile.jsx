<<<<<<< HEAD
import React, { useState } from "react";
import "./Profile.css";
import useProfile from "../hooks/useProfile";
import usePasswordChange from "../hooks/usePasswordChange";
import useBookingHistory from "../hooks/useBookingHistory";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfilePasswordForm from "../components/profile/ProfilePasswordForm";
import ProfileHistory from "../components/profile/ProfileHistory";
=======
import React, { useState, useEffect } from 'react';
import './Profile.css';
import * as API from '../api/index.js';
>>>>>>> main

function Profile({ onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
<<<<<<< HEAD
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
  const {
    bookingHistory,
    loading: loadingHistory,
    error: historyError,
    retry: retryHistory,
  } = useBookingHistory();
=======
  const [activeTab, setActiveTab] = useState('info'); // info, password, history
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    user_id: null,
    fullName: 'Người dùng',
    email: 'user@example.com',
    phone: '0123456789',
    address: 'Chưa cập nhật',
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [bookingHistory] = useState([
    {
      id: 1,
      date: '2025-10-15',
      service: 'Bảo dưỡng định kỳ',
      status: 'Hoàn thành',
      price: '1,500,000 VNĐ'
    },
    {
      id: 2,
      date: '2025-09-20',
      service: 'Thay dầu máy',
      status: 'Hoàn thành',
      price: '500,000 VNĐ'
    },
    {
      id: 3,
      date: '2025-10-18',
      service: 'Kiểm tra tổng quát',
      status: 'Đang xử lý',
      price: '800,000 VNĐ'
    }
  ]);

  // Load profile từ API hoặc localStorage khi component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Thử load từ localStorage trước
        const stored = localStorage.getItem('user');
        console.log('📦 localStorage user:', stored);
        
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('📋 Parsed user data:', parsed);
          
          const initialData = {
            user_id: parsed.user_id || parsed.id || parsed.userId || null,
            fullName: parsed.fullName || 'Người dùng',
            email: parsed.email || 'user@example.com',
            phone: parsed.phone || '0123456789',
            address: parsed.address || 'Chưa cập nhật',
            avatar: parsed.avatar || null
          };
          
          console.log('✅ Đã set profileData với user_id:', initialData.user_id);
          setProfileData(initialData);
        } else {
          console.warn('⚠️ Không tìm thấy user trong localStorage');
        }

        // Sau đó load từ API để đảm bảo dữ liệu mới nhất
        try {
          const data = await API.getProfile();
          console.log('📡 Dữ liệu từ API getProfile:', data);
          
          // Preserve user_id từ localStorage nếu API không trả về
          const currentUserId = profileData.user_id || (stored ? JSON.parse(stored).user_id || JSON.parse(stored).id : null);
          
          const updatedData = {
            user_id: data.user_id || data.id || data.userId || currentUserId || null,
            fullName: data.fullName || 'Người dùng',
            email: data.email || 'user@example.com',
            phone: data.phone || '0123456789',
            address: data.address || 'Chưa cập nhật',
            avatar: data.avatar || null
          };
          
          console.log('✅ Cập nhật profileData từ API với user_id:', updatedData.user_id);
          setProfileData(updatedData);
          
          // Cập nhật localStorage với dữ liệu mới (preserve user_id)
          localStorage.setItem('user', JSON.stringify(updatedData));
        } catch (apiError) {
          console.warn('⚠️ Không thể load profile từ API, sử dụng dữ liệu localStorage:', apiError);
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải thông tin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    console.log('🔍 Kiểm tra profileData:', profileData);
    console.log('🆔 User ID:', profileData.user_id);
    
    if (!profileData.user_id) {
      console.error('❌ Không tìm thấy user_id trong profileData');
      console.log('📋 localStorage user:', localStorage.getItem('user'));
      alert('❌ Không tìm thấy User ID. Vui lòng đăng nhập lại!');
      return;
    }
>>>>>>> main

  const handleSubmitProfile = async (event) => {
    event.preventDefault();
    try {
<<<<<<< HEAD
      await saveProfile();
=======
      setSaving(true);
      console.log('📤 Đang gửi dữ liệu profile:', profileData);
      
      // Gọi API PUT /api/update/{id}
      const response = await API.updateUser(profileData.user_id, {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar
      });
      
      console.log('✅ Response từ backend:', response);
      
      // Cập nhật localStorage với dữ liệu mới
      const updatedData = { ...profileData, ...response };
      localStorage.setItem('user', JSON.stringify(updatedData));
      setProfileData(updatedData);
      
>>>>>>> main
      setIsEditing(false);
    } catch (error) {
      // Errors are surfaced inside the hook via alert/logging
    }
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    try {
<<<<<<< HEAD
      await submitPasswordChange();
=======
      setSaving(true);
      await API.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('✅ Đổi mật khẩu thành công!');
>>>>>>> main
    } catch (error) {
      // Errors are surfaced inside the hook via alert/logging
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <ProfileHeader onBack={() => onNavigate("home")} />
        <div className="profile-content profile-loading-container">
          <div className="profile-loading-content">
            <div className="profile-loading-spinner" />
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
            <ProfileHistory
              bookingHistory={bookingHistory}
              loading={loadingHistory}
              error={historyError}
              onRetry={retryHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

