# 🚗 Hướng dẫn Quản lý Xe Đã Bảo Dưỡng

## 📋 Tổng quan

Component `VehicleManagement` hiển thị danh sách các xe đã được bảo dưỡng tại trung tâm, dành cho Staff sử dụng.

## ✨ Tính năng chính

### 1. **Hiển thị danh sách xe**
- Hiển thị thông tin chi tiết: Model, năm sản xuất, VIN, biển số, màu sắc, chủ xe
- Hiển thị số lần bảo dưỡng và lần bảo dưỡng gần nhất
- Hiển thị các dịch vụ đã thực hiện

### 2. **Tìm kiếm và lọc**
- Tìm kiếm theo: Tên xe, VIN, biển số, chủ xe
- Sắp xếp theo: Mới nhất, Số lần bảo dưỡng, Tên xe (A-Z)
- Real-time search khi gõ

### 3. **Xem chi tiết**
- Modal popup hiển thị thông tin đầy đủ
- Lịch sử bảo dưỡng chi tiết
- Danh sách đầy đủ các dịch vụ đã thực hiện

### 4. **Trạng thái & UX**
- Loading state khi đang tải dữ liệu
- Error state với nút "Thử lại" khi có lỗi
- Empty state khi không có dữ liệu
- Nút làm mới dữ liệu

## 🔌 API Integration

### Endpoint sử dụng:
```
GET /api/vehicles/maintained
```

### Response Format:
```json
[
  {
    "vehicleId": 1,
    "model": "Tesla Model 3",
    "year": 2023,
    "vin": "5YJ3E1EA8JF000001",
    "licensePlate": "30A-12345",
    "color": "#FF0000",
    "ownerName": "Nguyễn Văn A",
    "maintenanceCount": 5,
    "closetTime": "2025-11-13T07:27:06.224Z",
    "maintenanceServices": [
      "Thay dầu",
      "Kiểm tra phanh",
      "Bảo dưỡng định kỳ"
    ]
  }
]
```

## 📁 Cấu trúc Files

```
src/pages/StaffDashboard/components/VehicleManagement/
├── VehicleManagement.jsx    # Component chính
└── VehicleManagement.css     # Styling
```

## 🎨 Giao diện

### Grid Layout
- Responsive grid tự động điều chỉnh
- Mỗi card hiển thị thông tin đầy đủ
- Hover effects để tăng trải nghiệm

### Color Scheme
- Primary: Gradient purple-blue (#667eea → #764ba2)
- Background: Light gray (#f8fafc)
- Text: Dark slate (#1e293b)
- Borders: Light gray (#e2e8f0)

### Animations
- Fade in khi load dữ liệu
- Hover effects trên cards
- Modal slide up animation
- Rotate animation trên nút refresh

## 🚀 Cách sử dụng

### 1. Trong StaffDashboard
Component này được tích hợp sẵn trong Staff Dashboard:

```jsx
import VehicleManagement from './components/VehicleManagement/VehicleManagement';

// Sử dụng trong routing hoặc tab system
<VehicleManagement />
```

### 2. Yêu cầu
- User phải đăng nhập với role `staff`
- Token authentication trong localStorage
- Backend API phải sẵn sàng

### 3. State Management
Component tự quản lý state:
- `vehicles`: Danh sách xe từ API
- `filteredVehicles`: Danh sách sau khi filter/search
- `loading`: Trạng thái đang tải
- `error`: Thông báo lỗi (nếu có)
- `searchTerm`: Từ khóa tìm kiếm
- `sortBy`: Tiêu chí sắp xếp
- `selectedVehicle`: Xe đang xem chi tiết

## 🔧 Customization

### Thay đổi số cột grid
Trong `VehicleManagement.css`:
```css
.vehicles-grid {
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  /* Thay đổi 380px để điều chỉnh kích thước tối thiểu của card */
}
```

### Thay đổi màu sắc
```css
.maintenance-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Thay đổi gradient theo ý muốn */
}
```

### Thêm filter mới
Trong `VehicleManagement.jsx`, thêm option vào `sortBy`:
```jsx
<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
  <option value="closetTime">Mới nhất</option>
  <option value="maintenanceCount">Số lần bảo dưỡng</option>
  <option value="model">Tên xe (A-Z)</option>
  <option value="ownerName">Chủ xe (A-Z)</option> {/* Mới */}
</select>
```

Và cập nhật logic sort:
```jsx
case 'ownerName':
  return (a.ownerName || '').localeCompare(b.ownerName || '');
```

## 🐛 Troubleshooting

### 1. Không load được dữ liệu
- Kiểm tra token trong localStorage
- Kiểm tra API endpoint đang hoạt động
- Kiểm tra CORS settings
- Xem console log để biết lỗi chi tiết

### 2. Tìm kiếm không hoạt động
- Kiểm tra xem dữ liệu có đúng format không
- Các field phải có giá trị (không null)

### 3. Modal không hiển thị
- Kiểm tra z-index trong CSS
- Xem có conflict với CSS khác không

### 4. Lỗi 401/403
- Token hết hạn, cần đăng nhập lại
- User không có quyền staff

## 📱 Responsive Design

Component tự động responsive:
- Desktop: 2-3 cột
- Tablet: 1-2 cột
- Mobile: 1 cột

Breakpoint chính: `768px`

## 🔒 Security

- Tất cả API calls đều yêu cầu authentication
- Token được tự động gắn vào headers
- Không lưu sensitive data trong component state

## 📈 Performance

- Lazy loading modal (chỉ render khi cần)
- Debounce search (có thể thêm nếu cần)
- Memoization cho filtered list
- CSS animations sử dụng GPU

## 🎯 Future Enhancements

1. **Export dữ liệu**: Xuất danh sách xe ra Excel/PDF
2. **Filter nâng cao**: Filter theo năm, số lần bảo dưỡng
3. **Charts**: Biểu đồ thống kê
4. **Notifications**: Thông báo xe cần bảo dưỡng định kỳ
5. **Print**: In thông tin xe
6. **History timeline**: Hiển thị timeline bảo dưỡng

## 💡 Tips

- Sử dụng nút refresh để cập nhật dữ liệu mới nhất
- Click vào card để xem thông tin chi tiết
- Sử dụng search để tìm nhanh xe cần thiết
- Sắp xếp theo "Số lần bảo dưỡng" để thấy khách hàng trung thành

---

**Tác giả**: AI Assistant  
**Ngày tạo**: 2025-11-13  
**Version**: 1.0.0

