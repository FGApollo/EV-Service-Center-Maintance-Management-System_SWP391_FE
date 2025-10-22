import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';

function ProfilePage({ onNavigate }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Cập nhật user trong localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    
    // TODO: Gọi API để cập nhật trên server
    console.log('Cập nhật thông tin:', updatedUser);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Bạn cần đăng nhập để xem trang này
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const name = user?.fullName || user?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-emerald-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials()}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.fullName || 'Người dùng'}
                </h1>
                <p className="text-gray-500">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                    👑 Admin
                  </span>
                )}
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaEdit />
                  <span>Chỉnh sửa</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaSave />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes />
                    <span>Hủy</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-600 text-sm font-medium mb-2">
                    <FaUser className="text-blue-500" />
                    <span>Họ và tên</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg px-4 py-3 bg-gray-50 rounded-lg">
                      {user.fullName || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-600 text-sm font-medium mb-2">
                    <FaEnvelope className="text-blue-500" />
                    <span>Email</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập email"
                      disabled
                    />
                  ) : (
                    <p className="text-gray-800 text-lg px-4 py-3 bg-gray-50 rounded-lg">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-600 text-sm font-medium mb-2">
                    <FaPhone className="text-blue-500" />
                    <span>Số điện thoại</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg px-4 py-3 bg-gray-50 rounded-lg">
                      {user.phone || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-600 text-sm font-medium mb-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>Địa chỉ</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập địa chỉ"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg px-4 py-3 bg-gray-50 rounded-lg">
                      {user.address || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin tài khoản</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Ngày tham gia:</span>
                  <span className="font-medium text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Vai trò:</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => onNavigate('my-cars')}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-3xl mb-2">🚗</div>
            <h3 className="font-semibold text-gray-800">Xe của tôi</h3>
            <p className="text-sm text-gray-500 mt-1">Quản lý xe của bạn</p>
          </button>
          
          <button
            onClick={() => onNavigate('my-bookings')}
            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-800">Đơn của tôi</h3>
            <p className="text-sm text-gray-500 mt-1">Xem lịch sử đặt lịch</p>
          </button>
          
          <button
            onClick={() => onNavigate('booking')}
            className="p-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-3xl mb-2">➕</div>
            <h3 className="font-semibold">Đặt lịch mới</h3>
            <p className="text-sm opacity-90 mt-1">Đặt lịch bảo dưỡng ngay</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;


