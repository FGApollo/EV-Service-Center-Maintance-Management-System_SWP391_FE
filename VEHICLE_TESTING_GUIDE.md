# 🧪 Vehicle CRUD Testing Guide

## 🎯 Objective
Test all vehicle CRUD operations to ensure they work correctly with the updated code.

---

## 🚀 Quick Start

1. **Open browser** and go to Manager Dashboard
2. **Login** as Manager
3. **Navigate** to "Quản lý Xe" tab
4. **Follow** test cases below

---

## ✅ Test Case 1: Add New Vehicle

### Steps:
1. Click button **"➕ Thêm xe"**
2. Verify modal opens with title: "➕ Thêm xe mới"
3. **Check:** Should see blue info box saying:
   > ℹ️ **Lưu ý:** Xe sẽ được tự động gắn với tài khoản của bạn sau khi thêm.
4. **No customer dropdown** should appear
5. Fill in form:
   - **VIN:** `TEST12345ABC`
   - **Model:** `Tesla Model 3`
   - **Năm:** `2023`
   - **Màu:** `Đỏ`
   - **Biển số:** `29A-12345`
6. Click **"💾 Lưu"**

### Expected Result:
- ✅ Alert: "✅ Thêm xe thành công!"
- ✅ Modal closes
- ✅ Vehicle appears in list after ~500ms
- ✅ Vehicle owner is YOU (logged-in manager)

### What to Check in Console:
```javascript
➕ Adding vehicle (no customerId): {
  vin: "TEST12345ABC",
  model: "Tesla Model 3",
  year: 2023,
  color: "Đỏ",
  licensePlate: "29A-12345"
}
```

### Possible Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| "VIN đã tồn tại" | Duplicate VIN | Use different VIN |
| "Biển số đã được đăng ký" | Duplicate license plate | Use different plate |
| 403 Forbidden | No permission | Check token/role |
| 401 Unauthorized | Token expired | Re-login |

---

## ✅ Test Case 2: View Vehicle Details

### Steps:
1. Find the vehicle you just added
2. Click button **"👁️ Xem"**
3. Verify modal opens with title: "👁️ Thông tin xe"

### Expected Result:
- ✅ All fields are **read-only** (disabled)
- ✅ Shows vehicle details:
  - VIN, Model, Year, Color, License Plate
- ✅ Shows owner information (your name/email)
- ✅ **No Save button** (view-only mode)

---

## ✅ Test Case 3: Edit Vehicle

### Steps:
1. Find any vehicle in list
2. Click button **"✏️ Sửa"**
3. Verify modal opens with title: "✏️ Chỉnh sửa xe"
4. Verify form **pre-filled** with existing data
5. Modify one or more fields:
   - Change **Màu** to `Xanh`
   - Change **Năm** to `2024`
6. Click **"💾 Lưu"**

### Expected Result:
- ✅ Alert: "✅ Cập nhật xe thành công!"
- ✅ Modal closes
- ✅ Changes appear in list after ~500ms
- ✅ Other fields unchanged

### What to Check in Console:
```javascript
📝 Updating vehicle, vehicleId: 123
📝 Updating vehicle data: {
  id: 123,
  vin: "TEST12345ABC",
  model: "Tesla Model 3",
  year: 2024,
  color: "Xanh",
  licensePlate: "29A-12345"
}
```

### Possible Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| "Không tìm thấy ID xe" | vehicleId missing | Check vehicleFormData |
| "VIN đã tồn tại" | Changed VIN to existing one | Use unique VIN |
| 403 Forbidden | Not vehicle owner | Can only edit own vehicles |

---

## ✅ Test Case 4: Delete Vehicle

### Steps:
1. Find any vehicle in list
2. Click button **"🗑️ Xóa"**
3. Verify confirmation dialog: "⚠️ Bạn có chắc muốn xóa xe này?"
4. Click **OK/Yes**

### Expected Result:
- ✅ Alert: "✅ Đã xóa xe thành công!"
- ✅ Vehicle disappears from list
- ✅ List refreshes automatically

### To Test Cancel:
1. Click "🗑️ Xóa"
2. Click **Cancel/No** in confirmation dialog
3. ✅ Nothing happens, vehicle still in list

### Possible Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden | Not vehicle owner | Can only delete own vehicles |
| 404 Not Found | Vehicle already deleted | Refresh page |

---

## 🔍 Advanced Testing

### Test 1: Duplicate VIN
1. Add vehicle with VIN: `DUPLICATE123`
2. Try to add another vehicle with same VIN
3. **Expected:** "❌ Lỗi: VIN đã tồn tại trong hệ thống!"

### Test 2: Duplicate License Plate
1. Add vehicle with plate: `29A-99999`
2. Try to add another vehicle with same plate
3. **Expected:** "❌ Lỗi: Biển số đã được đăng ký!"

### Test 3: Form Validation
1. Click "Thêm xe"
2. Leave **VIN** empty, fill other fields
3. Try to submit
4. **Expected:** Alert: "⚠️ Vui lòng điền đầy đủ: VIN, Model, Biển số"

### Test 4: Year Data Type
1. Add vehicle with year: `2023` (number)
2. Check console log
3. **Expected:** `year: 2023` (not `"2023"` as string)

### Test 5: Whitespace Handling
1. Add vehicle with:
   - VIN: `  SPACES123  ` (with spaces)
   - Model: `  Tesla  ` (with spaces)
2. Submit form
3. **Expected:** Spaces are trimmed automatically

---

## 🐛 Debugging Tips

### If Add Vehicle Doesn't Work:

1. **Open Browser Console** (F12)
2. **Check Network Tab:**
   - Look for `POST /api/vehicles`
   - Check Request Payload (should NOT have `customerId`)
   - Check Response Status (should be 200/201)

3. **Check Console Logs:**
   ```javascript
   ➕ Adding vehicle (no customerId): {...}
   ```

4. **Check Token:**
   ```javascript
   // In console
   console.log(localStorage.getItem('token'));
   ```

### If Edit Vehicle Doesn't Work:

1. **Check Console Logs:**
   ```javascript
   📝 Updating vehicle, vehicleId: ???
   ```
   - If `vehicleId` is `undefined`, the form data wasn't set correctly

2. **Check Network Tab:**
   - Look for `PUT /api/vehicles/{id}`
   - Check Request Payload (should have `id` field)

3. **Check Form Pre-fill:**
   - When modal opens, verify fields are filled
   - If empty, `handleEditVehicle()` didn't run

### If Delete Doesn't Work:

1. **Check Confirmation Dialog:**
   - Should appear before delete
   - If doesn't appear, browser blocked `confirm()`

2. **Check Network Tab:**
   - Look for `DELETE /api/vehicles/{id}`
   - Check Response Status

---

## 📊 Test Results Template

Copy this to track your testing:

```markdown
## Test Results - [Date]

### ✅ Add Vehicle
- [ ] Modal opens correctly
- [ ] No customer dropdown shown
- [ ] Info message displayed
- [ ] Form validation works
- [ ] Submit successful
- [ ] Vehicle appears in list
- **Notes:** 

### ✅ View Vehicle
- [ ] Modal opens correctly
- [ ] All fields read-only
- [ ] Shows correct data
- [ ] No save button
- **Notes:**

### ✅ Edit Vehicle
- [ ] Modal opens correctly
- [ ] Form pre-filled
- [ ] Can modify fields
- [ ] Save successful
- [ ] Changes reflected in list
- **Notes:**

### ✅ Delete Vehicle
- [ ] Confirmation dialog appears
- [ ] Delete successful
- [ ] Vehicle removed from list
- [ ] Cancel works correctly
- **Notes:**

### 🐛 Issues Found
1. 
2. 
3. 

### 📝 Additional Notes

```

---

## 🎯 Success Criteria

All operations should work WITHOUT:
- ❌ Console errors
- ❌ API 400/403/500 errors
- ❌ Data not refreshing
- ❌ Modal not closing
- ❌ Duplicate entries

All operations should work WITH:
- ✅ Success alert messages
- ✅ Immediate UI updates
- ✅ Proper error handling
- ✅ Data validation
- ✅ Clean console logs

---

## 📞 Support

If issues persist after testing:
1. Check `VEHICLE_CRUD_COMPLETE.md` for implementation details
2. Review console logs carefully
3. Test API endpoints directly with Postman/curl
4. Verify backend is running and accessible

---

**Last Updated:** 2024
**Version:** 1.0
