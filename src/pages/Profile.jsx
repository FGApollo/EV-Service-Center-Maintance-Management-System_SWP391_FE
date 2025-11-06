import React, { useState, useEffect } from 'react';
import './Profile.css';
import * as API from '../api/index.js';

function Profile({ onNavigate, user: propUser }) {
  const [isEditing, setIsEditing] = useState(false);
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

    try {
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
      
      setIsEditing(false);
      alert('✅ Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật profile:', error);
      console.error('📋 Chi tiết lỗi:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.response?.statusText
        || 'Có lỗi xảy ra khi cập nhật thông tin!';
      
      alert(`❌ Lỗi: ${errorMessage}\n\nStatus: ${error.response?.status || 'Unknown'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
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
    } catch (error) {
      console.error('❌ Lỗi khi đổi mật khẩu:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || 'Có lỗi xảy ra khi đổi mật khẩu!';
      alert(`❌ Lỗi: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Hoàn thành': return 'status-completed';
      case 'Đang xử lý': return 'status-processing';
      case 'Đã hủy': return 'status-cancelled';
      default: return '';
    }
  };

  // Hiển thị loading khi đang tải profile
  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button 
            className="back-btn"
            onClick={() => onNavigate('home')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Quay lại
          </button>
          <h1>Thông tin cá nhân</h1>
        </div>
        <div className="profile-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 20px', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button 
          className="back-btn"
          onClick={() => onNavigate('home')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
          </svg>
          Quay lại
        </button>
        <h1>Thông tin cá nhân</h1>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Avatar" className="profile-avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                </div>
              )}
              <label htmlFor="avatar-upload" className="avatar-upload-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
                </svg>
                Đổi ảnh
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <h2>{profileData.fullName}</h2>
            <p className="profile-email">{profileData.email}</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              Thông tin cá nhân
            </button>
            <button 
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
              Đổi mật khẩu
            </button>
            <button 
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
              </svg>
              Lịch sử đặt lịch
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'info' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Thông tin cá nhân</h2>
                {!isEditing && (
                  <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                    </svg>
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-value">{profileData.fullName}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-value">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-value">{profileData.phone}</p>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Địa chỉ</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p className="form-value">{profileData.address}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="save-btn" disabled={saving}>
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Đổi mật khẩu</h2>
              </div>

              <form onSubmit={handleChangePassword} className="profile-form">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới"
                    required
                    minLength="6"
                  />
                  <small className="form-hint">Mật khẩu phải có ít nhất 6 ký tự</small>
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Lịch sử đặt lịch</h2>
              </div>

              <div className="booking-history">
                {bookingHistory.length > 0 ? (
                  <div className="history-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Ngày đặt</th>
                          <th>Dịch vụ</th>
                          <th>Trạng thái</th>
                          <th>Giá tiền</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingHistory.map(booking => (
                          <tr key={booking.id}>
                            <td>{booking.date}</td>
                            <td>{booking.service}</td>
                            <td>
                              <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="price">{booking.price}</td>
                            <td>
                              <button className="view-detail-btn">
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-history">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
                    </svg>
                    <p>Chưa có lịch sử đặt lịch</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
