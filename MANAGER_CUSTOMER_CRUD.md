# Manager Dashboard - CRUD Customers

## 📝 Tổng quan

Document này mô tả chức năng CRUD (Create, Read, Update, Delete) cho quản lý khách hàng trong Manager Dashboard.

## ✅ Tính năng đã implement

### 1. **Read (Xem danh sách)**
- ✅ Hiển thị danh sách customers trong grid layout
- ✅ Search khách hàng theo: tên, email, số điện thoại
- ✅ Hiển thị thông tin: Avatar, Tên, ID, Email, Phone, Ngày tham gia
- ✅ Auto-load data từ API khi vào tab "Khách hàng"

### 2. **Create (Thêm mới)**
- ✅ Modal form để thêm khách hàng mới
- ✅ Validate: Họ tên, Username, Email (bắt buộc)
- ✅ Mật khẩu mặc định: `Customer@123`
- ⚠️ **Cần backend hỗ trợ endpoint**: `POST /api/users/create`

### 3. **Update (Chỉnh sửa)**
- ✅ Modal form để edit thông tin khách hàng
- ✅ Load thông tin hiện tại vào form
- ✅ Cho phép sửa: Họ tên, Email, Số điện thoại, Địa chỉ
- ✅ **Không cho phép** sửa: Username (để bảo mật)
- ✅ API: `PUT /api/update/{id}`

### 4. **Delete (Xóa)**
- ✅ Confirm trước khi xóa
- ✅ Xử lý lỗi foreign key constraint
- ✅ API: `DELETE /api/employee/{id}` (tạm dùng chung)

### 5. **View (Xem chi tiết)**
- ✅ Modal chỉ đọc để xem thông tin chi tiết
- ✅ Không cho phép chỉnh sửa
- ✅ Button "Đóng" thay vì "Lưu"

## 🎨 UI/UX

### Customer Card
```jsx
<div className="customer-card">
  <div className="customer-header">
    <div className="customer-avatar"><FaUser /></div>
    <h3>{fullName}</h3>
    <p>ID: #{id}</p>
  </div>
  
  <div className="customer-info">
    <div className="info-row">
      <FaEnvelope /> {email}
    </div>
    <div className="info-row">
      <FaPhone /> {phone}
    </div>
    <div className="info-row">
      <FaCalendarAlt /> Tham gia: {joinDate}
    </div>
  </div>
  
  <div className="customer-actions">
    <button className="btn-view">👁️ Xem</button>
    <button className="btn-edit">✏️ Sửa</button>
    <button className="btn-delete">🗑️ Xóa</button>
  </div>
</div>
```

### Customer Modal
```jsx
<div className="modal-overlay">
  <div className="modal-content customer-modal">
    <div className="modal-header">
      <h2>✏️ Chỉnh sửa khách hàng #20</h2>
      <button className="close-btn">×</button>
    </div>
    
    <form>
      <div className="form-group">
        <label>Họ tên <span className="required">*</span></label>
        <input type="text" required />
      </div>
      
      <div className="form-group">
        <label>
          Tên đăng nhập 
          <span className="note">(không thể thay đổi)</span>
        </label>
        <input type="text" disabled />
      </div>
      
      <div className="form-group">
        <label>Email <span className="required">*</span></label>
        <input type="email" required />
      </div>
      
      <div className="form-group">
        <label>Số điện thoại</label>
        <input type="tel" />
      </div>
      
      <div className="form-group">
        <label>Địa chỉ</label>
        <textarea rows="3"></textarea>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-cancel">Hủy</button>
        <button type="submit" className="btn-save">💾 Lưu thay đổi</button>
      </div>
    </form>
  </div>
</div>
```

## 🔌 API Endpoints

### 1. Get All Customers
```javascript
GET /api/users/all_customer

Response: [
  {
    id: 20,
    username: "victorhatthinh",
    fullName: "Dùng Thanh Nộ",
    email: "victorhatthinh@gmail.com",
    phone: "0987654321",
    address: null,
    role: "customer",
    joinDate: "2024-11-01T00:00:00"
  },
  ...
]
```

### 2. Update Customer
```javascript
PUT /api/update/{id}

Request Body:
{
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "phone": "0901234567",
  "address": "123 Đường ABC, TP.HCM"
}

Response:
{
  "message": "User updated successfully",
  "user": { ... }
}
```

### 3. Delete Customer
```javascript
DELETE /api/employee/{id}

Response:
{
  "message": "User deleted successfully"
}
```

### 4. Create Customer (⚠️ Cần implement backend)
```javascript
POST /api/users/create

Request Body:
{
  "username": "nguyenvana",
  "password": "Customer@123",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@email.com",
  "phone": "0901234567",
  "address": "123 Đường ABC, TP.HCM",
  "role": "customer"
}

Response:
{
  "message": "User created successfully",
  "user": { ... }
}
```

## 📋 Validation Rules

### Create (Thêm mới):
- ✅ Họ tên: Bắt buộc
- ✅ Username: Bắt buộc, unique
- ✅ Email: Bắt buộc, format email hợp lệ
- 🔘 Số điện thoại: Không bắt buộc
- 🔘 Địa chỉ: Không bắt buộc

### Update (Chỉnh sửa):
- ✅ Họ tên: Bắt buộc
- ✅ Email: Bắt buộc, format email hợp lệ
- 🔘 Số điện thoại: Không bắt buộc
- 🔘 Địa chỉ: Không bắt buộc
- ❌ Username: Không cho phép thay đổi

## 🎯 User Flow

### Flow 1: Xem danh sách khách hàng
```
1. User click tab "Khách hàng"
2. System fetch data từ API: GET /api/users/all_customer
3. Hiển thị danh sách customers trong grid
4. User có thể search theo tên/email/phone
```

### Flow 2: Thêm khách hàng mới
```
1. User click button "➕ Thêm khách hàng"
2. Modal hiển thị với form trống
3. User nhập thông tin: Họ tên, Username, Email, Phone, Address
4. User click "✅ Thêm khách hàng"
5. System validate data
6. ⚠️ Alert: "Chức năng yêu cầu backend hỗ trợ endpoint"
   (TODO: Implement backend endpoint)
7. Modal đóng
```

### Flow 3: Chỉnh sửa khách hàng
```
1. User click button "✏️" trên customer card
2. Modal hiển thị với data hiện tại
3. Username field bị disabled (không cho sửa)
4. User sửa thông tin: Họ tên, Email, Phone, Address
5. User click "💾 Lưu thay đổi"
6. System validate data
7. System call API: PUT /api/update/{id}
8. Nếu thành công:
   - Alert "✅ Cập nhật thành công"
   - Modal đóng
   - Refresh danh sách
9. Nếu lỗi:
   - Alert với error message
   - Modal vẫn mở để user sửa
```

### Flow 4: Xóa khách hàng
```
1. User click button "🗑️" trên customer card
2. Confirm dialog hiển thị
3. User click "OK"
4. System call API: DELETE /api/employee/{id}
5. Nếu thành công:
   - Alert "✅ Đã xóa thành công"
   - Update state local (xóa khỏi list)
   - Refresh danh sách
6. Nếu lỗi:
   - Check error type:
     - 403: "Bạn không có quyền xóa"
     - Foreign key: "Không thể xóa vì có dữ liệu liên quan"
     - Other: Hiển thị error message
```

### Flow 5: Xem chi tiết
```
1. User click button "👁️" trên customer card
2. Modal hiển thị với data hiện tại
3. Tất cả fields đều disabled (chỉ đọc)
4. Chỉ có button "Đóng"
5. User click "Đóng" để đóng modal
```

## 🔒 Permission & Security

### Role: MANAGER
- ✅ Có quyền xem danh sách customers
- ✅ Có quyền chỉnh sửa customer info
- ⚠️ Có quyền xóa customer (cần xác nhận)
- ⚠️ Có quyền thêm customer mới (pending backend)

### Data Filtering:
- Manager chỉ xem customers của center mình quản lý
- Sử dụng `CenterAPI.getCustomers()` thay vì `API.getAllCustomers()`
- Backend cần filter data theo `centerId` từ JWT token

## 🐛 Error Handling

### 1. Network Error
```javascript
catch (err) {
  if (!err.response) {
    alert("❌ Lỗi kết nối mạng. Vui lòng kiểm tra internet!");
  }
}
```

### 2. Validation Error (400)
```javascript
if (err.response?.status === 400) {
  alert(`❌ Dữ liệu không hợp lệ: ${err.response.data.message}`);
}
```

### 3. Permission Error (403)
```javascript
if (err.response?.status === 403) {
  alert("❌ Bạn không có quyền thực hiện thao tác này!");
}
```

### 4. Not Found Error (404)
```javascript
if (err.response?.status === 404) {
  alert("❌ Không tìm thấy khách hàng này!");
}
```

### 5. Foreign Key Constraint
```javascript
if (errorMsg.includes('constraint') || errorMsg.includes('foreign key')) {
  alert("❌ Không thể xóa vì:\n- Khách hàng có lịch hẹn liên quan\n- Hoặc có dữ liệu phụ thuộc");
}
```

## 📱 Responsive Design

### Desktop (> 1024px):
- Customer grid: 3 columns
- Modal width: 600px

### Tablet (768px - 1024px):
- Customer grid: 2 columns
- Modal width: 90%

### Mobile (< 768px):
- Customer grid: 1 column
- Modal width: 95%
- Form fields full width

## 🧪 Testing Checklist

### ✅ CRUD Operations
- [ ] Xem danh sách customers
- [ ] Search customers (theo tên, email, phone)
- [ ] Thêm customer mới (pending backend)
- [ ] Chỉnh sửa customer info
- [ ] Xóa customer
- [ ] Xem chi tiết customer

### ✅ Validation
- [ ] Không để trống Họ tên (khi add/edit)
- [ ] Không để trống Username (khi add)
- [ ] Email phải đúng format
- [ ] Username không được sửa (khi edit)

### ✅ UI/UX
- [ ] Modal mở/đóng mượt mà
- [ ] Loading state khi save
- [ ] Disable fields khi view-only
- [ ] Alert messages rõ ràng
- [ ] Responsive trên mobile

### ✅ Error Handling
- [ ] Handle network error
- [ ] Handle permission error
- [ ] Handle foreign key constraint
- [ ] Show meaningful error messages

## 🚀 TODO - Next Steps

### Backend Requirements:
1. ✅ Endpoint: `POST /api/users/create`
   - Tạo customer mới với role = "customer"
   - Generate unique username
   - Hash password
   - Return created user

2. ✅ Endpoint: `DELETE /api/users/{id}` 
   - Thay thế `/api/employee/{id}` cho customer
   - Check foreign key constraints
   - Soft delete nếu có data liên quan

3. ✅ Filter by centerId
   - Manager chỉ xem customers của center mình
   - Add centerId filter vào GET /api/users/all_customer

### Frontend Improvements:
1. ⏳ Pagination cho customer list (nếu có nhiều customers)
2. ⏳ Sort customers theo: Tên, Email, Ngày tham gia
3. ⏳ Export customer list to CSV/Excel
4. ⏳ Bulk operations (xóa nhiều customers cùng lúc)
5. ⏳ Advanced filters (theo ngày tham gia, số lượng appointments, etc.)

---

**Updated**: November 10, 2025  
**Author**: GitHub Copilot  
**Status**: ✅ CRUD hoàn chỉnh (pending Create endpoint từ backend)
