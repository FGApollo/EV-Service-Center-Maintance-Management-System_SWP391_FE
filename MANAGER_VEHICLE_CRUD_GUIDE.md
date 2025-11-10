# 🚗 Hướng dẫn CRUD Quản lý Xe - Manager Dashboard

## 📋 Tổng quan

Manager có thể quản lý toàn bộ xe trong hệ thống với các chức năng:
- ✅ **Xem danh sách xe** đã đến bảo trì
- ➕ **Thêm xe mới** cho khách hàng
- ✏️ **Chỉnh sửa thông tin xe** (Model, VIN, Biển số, Năm SX, Màu sắc)
- 🗑️ **Xóa xe** khỏi hệ thống
- 👁️ **Xem chi tiết xe** và thông tin chủ xe

---

## 🎯 Các tính năng đã triển khai

### 1. **API Endpoints**

#### File: `src/api/index.js`

```javascript
// Lấy danh sách tất cả xe
export const getVehicles = async () => {
  const res = await axiosClient.get("/api/vehicles");
  return res.data;
};

// Thêm xe mới
export const addVehicle = async (data) => {
  const res = await axiosClient.post("/api/vehicles", data);
  return res.data;
};

// Cập nhật xe (✅ MỚI)
export const updateVehicle = async (id, data) => {
  console.log('📤 API Request: PUT /api/vehicles/' + id);
  console.log('📤 Request Data:', data);
  const res = await axiosClient.put(`/api/vehicles/${id}`, data);
  console.log('📥 API Response:', res.data);
  return res.data;
};

// Xóa xe
export const deleteVehicle = async (id) => {
  const res = await axiosClient.delete(`/api/vehicles/${id}`);
  return res.data;
};

// Lấy danh sách xe đã bảo dưỡng (với thông tin owner)
export const getVehiclesMaintained = async () => {
  const res = await axiosClient.get("/api/vehicles/maintained");
  return res.data;
};
```

---

### 2. **CRUD Handlers**

#### File: `src/pages/ManagerDashboard.jsx`

#### 📌 **CREATE - Thêm xe mới**

```javascript
const handleAddVehicleClick = () => {
  setModalMode('add');
  setSelectedVehicle(null);
  setVehicleFormData({
    vin: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    customerId: ''
  });
  setShowVehicleModal(true);
};
```

**Validation:**
- VIN, Model, Biển số: Bắt buộc
- Phải chọn khách hàng
- Năm SX: 2000 - hiện tại

#### 📌 **READ - Xem chi tiết xe**

```javascript
const handleViewVehicle = (vehicle) => {
  setModalMode('view');
  setSelectedVehicle(vehicle);
  // Load dữ liệu vào form ở chế độ readonly
  setShowVehicleModal(true);
};
```

**Hiển thị:**
- Thông tin xe: VIN, Model, Năm SX, Màu sắc, Biển số
- Thông tin chủ xe: Tên, Email, SĐT
- Tất cả field ở chế độ readonly

#### 📌 **UPDATE - Chỉnh sửa xe**

```javascript
const handleEditVehicle = (vehicleData) => {
  // Xử lý cả 2 trường hợp: API trả về {vehicle, owner} hoặc chỉ vehicle
  const vehicle = vehicleData.vehicle || vehicleData;
  const owner = vehicleData.owner || vehicle.owner;
  
  setModalMode('edit');
  setSelectedVehicle(vehicleData);
  setVehicleFormData({
    vin: vehicle.vin || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    color: vehicle.color || '',
    licensePlate: vehicle.licensePlate || '',
    customerId: owner?.id || ''
  });
  setShowVehicleModal(true);
};

const handleSaveVehicle = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!vehicleFormData.vin || !vehicleFormData.model || !vehicleFormData.licensePlate) {
    alert('⚠️ Vui lòng điền đầy đủ: VIN, Model, Biển số');
    return;
  }

  try {
    setSavingVehicle(true);
    
    if (modalMode === 'edit') {
      const vehicleId = selectedVehicle?.id || selectedVehicle?.vehicle?.id;
      if (!vehicleId) {
        alert('⚠️ Không tìm thấy ID xe để cập nhật');
        return;
      }
      
      await API.updateVehicle(vehicleId, {
        vin: vehicleFormData.vin,
        model: vehicleFormData.model,
        year: vehicleFormData.year,
        color: vehicleFormData.color,
        licensePlate: vehicleFormData.licensePlate
      });
      alert('✅ Cập nhật xe thành công!');
    }
    
    setShowVehicleModal(false);
    fetchVehicles(); // Reload danh sách
  } catch (err) {
    console.error('❌ Error saving vehicle:', err);
    const errorMsg = err.response?.data?.message || err.message || 'Không thể lưu xe';
    alert(`❌ Lỗi: ${errorMsg}`);
  } finally {
    setSavingVehicle(false);
  }
};
```

**Lưu ý khi edit:**
- ⚠️ **Không thể thay đổi chủ xe** (customerId)
- Hiển thị thông tin chủ xe ở dạng readonly
- Chỉ cho phép sửa: VIN, Model, Năm SX, Màu sắc, Biển số

#### 📌 **DELETE - Xóa xe**

```javascript
const handleDeleteVehicle = async (vehicleId) => {
  if (!confirm('⚠️ Bạn có chắc muốn xóa xe này?')) {
    return;
  }

  try {
    await API.deleteVehicle(vehicleId);
    alert('✅ Đã xóa xe thành công!');
    fetchVehicles();
  } catch (err) {
    console.error('❌ Error deleting vehicle:', err);
    alert(`❌ Lỗi: ${err.message || 'Không thể xóa xe'}`);
  }
};
```

**Xác nhận:**
- Hiển thị confirm dialog trước khi xóa
- Reload danh sách sau khi xóa thành công

---

### 3. **UI/UX Modal**

#### **Chế độ ADD (Thêm xe)**
- Dropdown chọn khách hàng (required)
- Form nhập thông tin xe
- Nút: ✅ Thêm xe

#### **Chế độ EDIT (Sửa xe)**
- Hiển thị info box chủ xe (readonly):
  ```
  ┌─────────────────────────────────┐
  │ 👤 Chủ xe: Nguyễn Văn A         │
  │ ✉️ nguyenvana@gmail.com         │
  │ 📞 0901234567                    │
  │ ℹ️ Không thể thay đổi chủ xe    │
  └─────────────────────────────────┘
  ```
- Form chỉnh sửa thông tin xe
- Nút: 💾 Lưu thay đổi

#### **Chế độ VIEW (Xem chi tiết)**
- Tất cả field ở chế độ readonly
- Hiển thị đầy đủ thông tin xe và chủ xe
- Nút: Đóng

---

## 🔍 **Tìm kiếm & Filter**

```javascript
vehicles.filter(vehicle => 
  searchQuery === '' || 
  vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  vehicle.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  vehicle.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  vehicle.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
)
```

**Tìm kiếm theo:**
- Model xe
- VIN
- Biển số
- Tên chủ xe

---

## 📊 **Bảng danh sách xe**

| STT | Thông tin xe | VIN | Biển số | Năm SX | Màu sắc | Lịch sử | Thao tác |
|-----|--------------|-----|---------|--------|---------|---------|----------|
| 1 | **Tesla Model 3**<br>👤 Nguyễn Văn A | `WBA3B5C50DF` | 29A-12345 | 2021 | white | - | 👁️ 🔧 🗑️ |

**Action buttons:**
- 👁️ **Xem** - View details
- 🔧 **Sửa** - Edit vehicle
- 🗑️ **Xóa** - Delete vehicle

---

## 🎨 **CSS Styling**

Modal được style trong `ManagerDashboard.css`:

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-large {
  max-width: 700px;
  width: 90%;
}

.info-display {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}
```

---

## ⚠️ **Lưu ý quan trọng**

### 1. **Data Structure từ API**

API có thể trả về 2 dạng:
- `{vehicle: {...}, owner: {...}}` - Object lồng nhau
- `{id, vin, model, ..., owner: {...}}` - Vehicle với owner nested

Code đã xử lý cả 2 trường hợp:
```javascript
const vehicle = vehicleData.vehicle || vehicleData;
const owner = vehicleData.owner || vehicle.owner;
```

### 2. **Backend Requirements**

Đảm bảo backend có endpoint:
```
PUT /api/vehicles/{id}
```

Request body:
```json
{
  "vin": "string",
  "model": "string",
  "year": 2024,
  "color": "string",
  "licensePlate": "string"
}
```

### 3. **Validation Rules**

**Required fields:**
- VIN
- Model
- Biển số (licensePlate)
- Customer ID (chỉ khi thêm mới)

**Optional fields:**
- Năm sản xuất (default: năm hiện tại)
- Màu sắc

### 4. **Permission**

Chỉ Manager (role="MANAGER") mới có quyền:
- Xem tất cả xe trong center
- Thêm/Sửa/Xóa xe

---

## 🧪 **Testing Workflow**

### Test Case 1: Thêm xe mới
1. Click nút "➕ Thêm xe"
2. Chọn khách hàng từ dropdown
3. Nhập VIN, Model, Biển số
4. (Optional) Nhập Năm SX, Màu sắc
5. Click "✅ Thêm xe"
6. ✅ Kiểm tra: Xe xuất hiện trong danh sách

### Test Case 2: Sửa xe
1. Click "🔧 Sửa" ở hàng xe cần sửa
2. Modal hiển thị thông tin chủ xe (readonly)
3. Sửa thông tin xe (VIN, Model, ...)
4. Click "💾 Lưu thay đổi"
5. ✅ Kiểm tra: Thông tin xe được cập nhật

### Test Case 3: Xem chi tiết
1. Click "👁️ Xem" ở hàng xe
2. Modal hiển thị đầy đủ thông tin
3. Tất cả field readonly
4. Click "Đóng"

### Test Case 4: Xóa xe
1. Click "🗑️ Xóa"
2. Confirm dialog hiển thị
3. Click OK
4. ✅ Kiểm tra: Xe biến khỏi danh sách

### Test Case 5: Tìm kiếm
1. Nhập từ khóa vào search box
2. ✅ Kiểm tra: Danh sách lọc theo Model/VIN/Biển số/Tên chủ xe

---

## 📝 **Changelog**

### Version 1.0 (2024-11-11)
- ✅ Thêm API `updateVehicle` vào `src/api/index.js`
- ✅ Cập nhật `handleSaveVehicle` để gọi API update
- ✅ Cải thiện `handleEditVehicle` xử lý cả 2 dạng data structure
- ✅ Thêm info box hiển thị chủ xe khi edit/view
- ✅ Thêm validation và error handling
- ✅ Fix bug truyền sai tham số `vehicleData` vs `vehicle`

---

## 🚀 **Future Improvements**

- [ ] Thêm pagination cho danh sách xe
- [ ] Filter theo năm sản xuất, màu sắc
- [ ] Export danh sách xe ra Excel/PDF
- [ ] Upload ảnh xe
- [ ] Lịch sử bảo dưỡng chi tiết
- [ ] QR code cho mỗi xe
- [ ] Thông báo khi xe sắp đến hạn bảo dưỡng

---

## 📞 **Support**

Nếu gặp vấn đề, kiểm tra:
1. Console log có lỗi gì không
2. Backend API có hoạt động không
3. Token JWT còn hợp lệ không
4. Role có đúng là MANAGER không

---

**Tài liệu này được cập nhật**: 11/11/2024
**Version**: 1.0
**Author**: FGApollo Team
