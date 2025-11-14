import React from "react";

function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔧</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">AutoCare Pro</h3>
                <p className="text-sm text-gray-400">Bảo dưỡng xe chuyên nghiệp</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trung tâm bảo dưỡng và sửa chữa xe hơi hàng đầu với đội ngũ kỹ thuật viên 
              giàu kinh nghiệm và trang thiết bị hiện đại.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dịch Vụ</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer">Bảo dưỡng định kỳ</li>
              <li className="hover:text-white cursor-pointer">Sửa chữa động cơ</li>
              <li className="hover:text-white cursor-pointer">Hệ thống phanh & lốp</li>
              <li className="hover:text-white cursor-pointer">Hệ thống điện</li>
              <li className="hover:text-white cursor-pointer">Điều hòa & làm mát</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Hệ</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p className="flex items-center gap-2">
                <span>📍</span>
                123 Đường ABC, Quận XYZ, TP. HCM
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                0123 456 789
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span>
                info@autocarepro.com
              </p>
              <p className="flex items-center gap-2">
                <span>🕒</span>
                Thứ 2 - CN: 7:00 - 19:00
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Theo Dõi</h4>
            <div className="flex space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700">
                <span className="text-white text-sm">@</span>
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700">
                <span className="text-white text-sm">Z</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Đăng ký nhận thông tin khuyến mãi và tips bảo dưỡng xe
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 AutoCare Pro. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Chính sách bảo mật</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Điều khoản sử dụng</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Chính sách bảo hành</a>
            {onNavigate && (
              <>
                <button 
                  onClick={() => onNavigate('staff')}
                  className="text-gray-600 hover:text-blue-400 text-sm transition-colors"
                  title="Dành cho nhân viên tiếp nhận"
                >
                  👨‍💼 Staff
                </button>
                <button 
                  onClick={() => onNavigate('technician')}
                  className="text-gray-600 hover:text-green-400 text-sm transition-colors"
                  title="Dành cho kỹ thuật viên"
                >
                  🔧 Technician
                </button>
                <button 
                  onClick={() => {
                    console.log('Manager button clicked!', onNavigate);
                    if (onNavigate) {
                      onNavigate('manager');
                    } else {
                      console.error('onNavigate is not defined!');
                    }
                  }}
                  className="text-gray-600 hover:text-orange-400 text-sm transition-colors font-semibold"
                  title="Dành cho quản lý trung tâm"
                >
                  👨‍💼 Manager
                </button>
                <button 
                  onClick={() => {
                    console.log('Admin button clicked (deprecated)!', onNavigate);
                    if (onNavigate) {
                      onNavigate('admin');
                    } else {
                      console.error('onNavigate is not defined!');
                    }
                  }}
                  className="text-gray-700 hover:text-purple-400 text-sm transition-colors opacity-50"
                  title="Admin (deprecated - use Manager)"
                >
                  👑 Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;