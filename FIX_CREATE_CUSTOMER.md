# Fix: Thêm khách hàng trong Manager Dashboard

## 🐛 Vấn đề
Manager không thể thêm khách hàng mới vì thiếu API endpoint.

## ✅ Giải pháp

### 1. Thêm API function `createCustomer()`
**File**: `src/api/index.js`

```javascript
// Tạo customer mới - Dùng register endpoint
export const createCustomer = async (data) => {
  console.log('📤 Creating customer via register:', data);
  const res = await axiosClient.post("/api/auth/register", data);
  return res.data;
};
```

**Endpoint sử dụng**: `POST /api/auth/register`

### 2. Update `handleSaveCustomer()` 
**File**: `src/pages/ManagerDashboard.jsx`

**Thay đổi**:
- ❌ Xóa alert "Chức năng chưa được hỗ trợ"
- ✅ Gọi `API.createCustomer()` để tạo customer
- ✅ Thêm validation username
- ✅ Xử lý các lỗi cụ thể:
  - Username đã tồn tại
  - Email đã được sử dụng
- ✅ Hiển thị thông tin đăng nhập sau khi tạo thành công

## 📋 Data Flow

### Input (Form Data):
```javascript
{
  name: "Nguyễn Văn A",           // Họ tên
  username: "nguyenvana",         // Username (bắt buộc)
  email: "nguyenvana@email.com",  // Email (bắt buộc)
  phone: "0901234567",            // Phone (optional)
  address: "123 ABC Street"       // Address (optional)
}
```

### Request to Backend:
```javascript
POST /api/auth/register
Body: {
  username: "nguyenvana",
  password: "Customer@123",        // Default password
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0901234567",
  address: "123 ABC Street",
  role: "customer"
}
```

### Success Response:
```javascript
{
  message: "User registered successfully",
  user: {
    id: 123,
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "123 ABC Street",
    role: "customer"
  }
}
```

## 🔒 Security & Validation

### Frontend Validation:
1. ✅ Họ tên: Bắt buộc
2. ✅ Username: Bắt buộc, trim whitespace
3. ✅ Email: Bắt buộc, format email
4. ⚪ Phone: Optional
5. ⚪ Address: Optional

### Default Values:
- **Password**: `Customer@123` (cần yêu cầu customer đổi password lần đầu đăng nhập)
- **Role**: `customer` (hardcoded)

### Error Handling:
```javascript
// Username đã tồn tại
if (errorMsg.includes('username') && errorMsg.includes('exist')) {
  alert('❌ Tên đăng nhập đã tồn tại!');
}

// Email đã được sử dụng
if (errorMsg.includes('email') && errorMsg.includes('exist')) {
  alert('❌ Email đã được sử dụng!');
}

// Lỗi khác
alert('❌ Lỗi: ' + errorMsg);
```

## 📱 User Experience

### Flow thêm khách hàng:
```
1. Manager click "➕ Thêm khách hàng"
   ↓
2. Modal hiển thị form trống
   ↓
3. Manager nhập thông tin:
   - Họ tên: "Long Quan" ✅
   - Username: "long" ✅
   - Email: "long@gmail.com" ✅
   - Phone: "123456789" (optional)
   - Address: "..." (optional)
   ↓
4. Manager click "✅ Thêm khách hàng"
   ↓
5. System validate data
   ↓
6. System call API: POST /api/auth/register
   ↓
7. Success:
   ✅ Alert: "Thêm khách hàng thành công!
              
              Thông tin đăng nhập:
              👤 Username: long
              🔑 Password: Customer@123"
   ↓
8. Modal đóng
   ↓
9. Refresh danh sách customers
```

### Success Alert:
```
✅ Thêm khách hàng thành công!

Thông tin đăng nhập:
👤 Username: long
🔑 Password: Customer@123
```

### Error Scenarios:

#### 1. Username đã tồn tại:
```
❌ Lỗi: Tên đăng nhập đã tồn tại!
Vui lòng chọn tên đăng nhập khác.
```

#### 2. Email đã được sử dụng:
```
❌ Lỗi: Email đã được sử dụng!
Vui lòng dùng email khác.
```

#### 3. Network error:
```
❌ Lỗi: Network error. Check your connection.
```

## 🧪 Testing

### Test Case 1: Thêm customer thành công
```
Input:
- Họ tên: "Test User"
- Username: "testuser123"
- Email: "testuser@test.com"
- Phone: "0912345678"
- Address: "123 Test St"

Expected:
✅ Customer được tạo thành công
✅ Alert hiển thị thông tin đăng nhập
✅ Modal đóng
✅ Danh sách refresh và hiển thị customer mới
```

### Test Case 2: Username trùng
```
Input:
- Username: "victorhatthinh" (already exists)

Expected:
❌ Alert: "Tên đăng nhập đã tồn tại!"
❌ Modal vẫn mở để user sửa
```

### Test Case 3: Email trùng
```
Input:
- Email: "victorhatthinh@gmail.com" (already exists)

Expected:
❌ Alert: "Email đã được sử dụng!"
❌ Modal vẫn mở để user sửa
```

### Test Case 4: Thiếu username
```
Input:
- Username: "" (empty)
- Email: "test@test.com"

Expected:
❌ Alert: "Vui lòng nhập tên đăng nhập!"
❌ Modal vẫn mở
```

### Test Case 5: Email không hợp lệ
```
Input:
- Email: "notanemail" (invalid format)

Expected:
❌ HTML5 validation: "Please include an '@' in the email address"
❌ Form không submit
```

## ⚠️ Lưu ý quan trọng

### 1. Default Password
- Password mặc định: `Customer@123`
- **Recommendation**: Backend nên force customer đổi password lần đầu đăng nhập
- Hoặc gửi email reset password link

### 2. Role Assignment
- Role được hardcode là `"customer"`
- Không cho phép Manager tạo user với role khác

### 3. Security
- Endpoint `/api/auth/register` là public (không cần token)
- Có thể bị abuse nếu không có rate limiting
- **Recommendation**: Backend nên có CAPTCHA hoặc rate limiting

### 4. Username Rules
- Không cho phép thay đổi sau khi tạo
- Nên có validation rules:
  - Độ dài tối thiểu: 4 ký tự
  - Chỉ chứa: a-z, 0-9, underscore
  - Không chứa khoảng trắng

### 5. Data Filtering
- Customer được tạo không có `centerId`
- Backend cần logic để:
  - Gán `centerId` khi customer đặt lịch lần đầu
  - Hoặc Manager chỉ xem customers đã từng dùng dịch vụ tại center mình

## 🔄 Integration với Backend

### Backend cần đảm bảo:

1. ✅ Endpoint `/api/auth/register` hoạt động
2. ✅ Accept role parameter trong request body
3. ✅ Return user object sau khi tạo thành công
4. ✅ Validate unique username & email
5. ✅ Hash password trước khi lưu DB
6. ⚠️ (Optional) Send welcome email to customer
7. ⚠️ (Optional) Force change password on first login

### Response Format:
```javascript
{
  "message": "User registered successfully",
  "user": {
    "id": 123,
    "username": "testuser",
    "fullName": "Test User",
    "email": "test@test.com",
    "phone": "0912345678",
    "address": "123 Test St",
    "role": "customer",
    "createdAt": "2025-11-10T10:30:00Z"
  }
}
```

## 📊 Impact

### Before:
- ❌ Manager không thể tạo customer
- ❌ Alert "Chức năng chưa được hỗ trợ"
- ❌ Phải dùng tool khác để tạo customer

### After:
- ✅ Manager tạo customer trực tiếp trong dashboard
- ✅ Validation đầy đủ
- ✅ Error handling rõ ràng
- ✅ UX flow hoàn chỉnh

## 🎯 Next Steps

1. ⏳ Test kỹ chức năng trên môi trường staging
2. ⏳ Backend implement email notification
3. ⏳ Backend implement force change password
4. ⏳ Thêm tính năng "Send password reset link" thay vì hiển thị password
5. ⏳ Thêm CAPTCHA cho endpoint `/api/auth/register`

---

**Date**: November 10, 2025  
**Author**: GitHub Copilot  
**Status**: ✅ Ready for testing
