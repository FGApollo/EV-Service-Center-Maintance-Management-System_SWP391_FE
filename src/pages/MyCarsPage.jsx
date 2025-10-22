import React, { useState } from 'react';
import { FaCar, FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTimes, FaSave } from 'react-icons/fa';

function MyCarsPage({ onNavigate }) {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Mock data - trong thực tế sẽ lấy từ API
  const [cars, setCars] = useState([
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: '29A-12345',
      color: 'Đỏ',
      vin: 'WBA12345678901234',
      image: '🚗',
    },
    {
      id: 2,
      brand: 'BMW',
      model: 'X5',
      year: 2022,
      licensePlate: '30B-67890',
      color: 'Đen',
      vin: 'WBA98765432109876',
      image: '🚙',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    vin: '',
    image: '🚗',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      color: '',
      vin: '',
      image: '🚗',
    });
    setShowModal(true);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setFormData(car);
    setShowModal(true);
  };

  const handleDeleteCar = (carId) => {
    if (window.confirm('Bạn có chắc muốn xóa xe này?')) {
      setCars(cars.filter(car => car.id !== carId));
      // TODO: Gọi API để xóa trên server
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCar) {
      // Cập nhật xe
      setCars(cars.map(car => 
        car.id === editingCar.id ? { ...formData, id: car.id } : car
      ));
      // TODO: Gọi API để cập nhật trên server
    } else {
      // Thêm xe mới
      const newCar = {
        ...formData,
        id: Date.now(), // Tạm thời dùng timestamp làm id
      };
      setCars([...cars, newCar]);
      // TODO: Gọi API để thêm trên server
    }
    
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Xe Của Tôi</h1>
              <p className="text-gray-600">Quản lý thông tin xe của bạn</p>
            </div>
            <button
              onClick={handleAddCar}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
            >
              <FaPlus />
              <span>Thêm xe mới</span>
            </button>
          </div>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có xe nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thêm xe của bạn để quản lý và đặt lịch bảo dưỡng dễ dàng hơn
            </p>
            <button
              onClick={handleAddCar}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
            >
              Thêm xe ngay
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Car Image/Icon */}
                <div className="h-40 bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-8xl">
                  {car.image}
                </div>
                
                {/* Car Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">Năm {car.year}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biển số:</span>
                      <span className="font-semibold text-gray-800">{car.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Màu sắc:</span>
                      <span className="font-semibold text-gray-800">{car.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số khung:</span>
                      <span className="font-semibold text-gray-800 text-xs">{car.vin}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={() => handleEditCar(car)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaEdit size={14} />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={14} />
                      <span>Xóa</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onNavigate('booking')}
                    className="w-full mt-3 px-4 py-2 border-2 border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                  >
                    Đặt lịch bảo dưỡng
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Add/Edit Car */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingCar ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hãng xe *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: Tesla, BMW, Mercedes..."
                    />
                  </div>
                  
                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dòng xe *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: Model 3, X5, C-Class..."
                    />
                  </div>
                  
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Năm sản xuất *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* License Plate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biển số xe *
                    </label>
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: 29A-12345"
                    />
                  </div>
                  
                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu sắc
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: Đen, Trắng, Đỏ..."
                    />
                  </div>
                  
                  {/* VIN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số khung (VIN)
                    </label>
                    <input
                      type="text"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: WBA12345678901234"
                    />
                  </div>
                </div>
                
                {/* Image Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn biểu tượng
                  </label>
                  <div className="flex space-x-2">
                    {['🚗', '🚙', '🚕', '🚐', '🚓', '🏎️', '🚜'].map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: icon }))}
                        className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                          formData.image === icon
                            ? 'border-blue-500 bg-blue-50 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all font-medium"
                  >
                    <FaSave />
                    <span>{editingCar ? 'Cập nhật' : 'Thêm xe'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCarsPage;


