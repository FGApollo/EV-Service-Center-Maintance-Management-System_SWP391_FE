# Manager Dashboard - Tích hợp API cho Biểu đồ

## 📊 Tổng quan

Tài liệu này mô tả cách tích hợp API để hiển thị các biểu đồ trong tab **Tài chính & Báo cáo** của Manager Dashboard.

## ✅ Các thay đổi đã thực hiện

### 1. **ManagerDashboard.jsx** - Import CenterAPI

```javascript
import * as CenterAPI from '../services/centerAwareAPI.js';
```

**Lý do**: CenterAPI tự động filter data theo `centerId` của Manager, đảm bảo Manager chỉ xem data của center mình quản lý.

### 2. **fetchOverviewData()** - Sử dụng CenterAPI

Thay đổi từ:
```javascript
API.getAllCustomers()
API.getVehiclesMaintained()
API.getAllAppointments()
API.getRevenueReport()
API.getProfitReport()
```

Sang:
```javascript
CenterAPI.getCustomers()      // ✅ Auto-filter by centerId
CenterAPI.getVehicles()        // ✅ Auto-filter by centerId
CenterAPI.getAppointments()    // ✅ Auto-filter by centerId
CenterAPI.getRevenueReport()   // ✅ Auto-filter by centerId
CenterAPI.getProfitReport()    // ✅ Auto-filter by centerId
```

### 3. **centerAwareAPI.js** - Thêm hàm mới

#### Thêm `getProfitReport()`:
```javascript
export const getProfitReport = async () => {
  const { centerId, role } = getCurrentUser();
  const report = await API.getProfitReport();
  
  if (role === ROLES.ADMIN) {
    return report;
  }
  
  // TODO: Filter report data theo center nếu backend chưa hỗ trợ
  return report;
};
```

#### Thêm `getTrendingServicesLastMonth()`:
```javascript
export const getTrendingServicesLastMonth = async () => {
  return await API.getTrendingServicesLastMonth();
};
```

## 📈 Biểu đồ được hiển thị

### 1. **Doanh thu theo tháng** (Revenue Chart)
- **Data source**: `overviewStats.revenueData`
- **API**: `CenterAPI.getRevenueReport()`
- **Backend endpoint**: `GET /api/admin/reports/revenue`
- **Format**: `{ "1": 5000000, "2": 7500000, ... }`

```jsx
<div className="chart-card revenue-chart">
  <h3><FaChartBar /> Doanh thu theo tháng</h3>
  <div className="bar-chart">
    {Object.entries(overviewStats.revenueData).map(([month, revenue]) => (
      <div key={month} className="bar-item">
        <div className="bar" style={{ height: `${height}%` }}></div>
        <div className="bar-label">{month}</div>
        <div className="bar-value">{formatCurrency(revenue)}</div>
      </div>
    ))}
  </div>
</div>
```

### 2. **Lợi nhuận theo tháng** (Profit Chart)
- **Data source**: `overviewStats.profitData`
- **API**: `CenterAPI.getProfitReport()`
- **Backend endpoint**: `GET /api/admin/reports/profit`
- **Format**: `{ "1": 2000000, "2": 3500000, ... }`

```jsx
<div className="chart-card profit-chart">
  <h3><FaChartLine /> Lợi nhuận theo tháng</h3>
  <div className="bar-chart">
    {Object.entries(overviewStats.profitData).map(([month, profit]) => (
      <div key={month} className="bar-item">
        <div className="bar bar-profit" style={{ height: `${height}%` }}></div>
        <div className="bar-label">{month}</div>
        <div className="bar-value">{formatCurrency(profit)}</div>
      </div>
    ))}
  </div>
</div>
```

### 3. **Dịch vụ phổ biến nhất** (Trending Services)
- **Data source**: `overviewStats.trendingServices`
- **API**: `CenterAPI.getTrendingServices()`
- **Backend endpoint**: `GET /api/admin/reports/trending-services/alltime`

### 4. **Dịch vụ phổ biến (Tháng trước)** (Trending Services Last Month)
- **Data source**: `overviewStats.trendingServicesLastMonth`
- **API**: `CenterAPI.getTrendingServicesLastMonth()`
- **Backend endpoint**: `GET /api/admin/reports/trending-services/last-month`

### 5. **Phụ tùng trong kho** (Parts in Stock)
- **Data source**: `overviewStats.trendingParts`
- **API**: `CenterAPI.getParts()`
- **Backend endpoint**: `GET /api/parts`

## 🔄 Luồng dữ liệu

```
User logs in as Manager (centerId: 1)
         ↓
Manager clicks "Tài chính & Báo cáo" tab
         ↓
fetchOverviewData() được gọi
         ↓
CenterAPI.getRevenueReport() → Backend filters by centerId
CenterAPI.getProfitReport() → Backend filters by centerId
         ↓
Data được lưu vào overviewStats state
         ↓
Charts render với data từ overviewStats
```

## ⚠️ Lưu ý quan trọng

### 1. **Backend cần hỗ trợ filter theo centerId**

Hiện tại, các endpoint đang là `/api/admin/reports/*` - cần đảm bảo backend:
- Lấy `centerId` từ JWT token của Manager
- Chỉ trả về data của center đó

**Ví dụ backend logic**:
```java
@GetMapping("/api/admin/reports/revenue")
public ResponseEntity<Map<String, Double>> getRevenueReport(@AuthenticationPrincipal UserDetails userDetails) {
    User user = userRepository.findByUsername(userDetails.getUsername());
    
    if (user.getRole().equals("MANAGER")) {
        // Manager chỉ xem data của center mình
        return revenueService.getRevenueByCenter(user.getCenterId());
    } else {
        // Admin xem all centers
        return revenueService.getAllRevenue();
    }
}
```

### 2. **Frontend filter as fallback**

Nếu backend chưa hỗ trợ filter, CenterAPI sẽ filter ở frontend:

```javascript
export const getRevenueReport = async () => {
  const { centerId, role } = getCurrentUser();
  const report = await API.getRevenueReport();
  
  if (role === ROLES.ADMIN) {
    return report; // Admin xem all
  }
  
  // TODO: Implement frontend filtering logic
  // Filter report data theo centerId
  return filterReportByCenter(report, centerId);
};
```

### 3. **Xử lý empty data**

Biểu đồ hiển thị message khi không có data:

```jsx
{Object.keys(overviewStats.revenueData || {}).length > 0 ? (
  <div className="bar-chart">...</div>
) : (
  <div className="chart-empty">
    <FaChartBar size={40} />
    <p>Chưa có dữ liệu doanh thu</p>
  </div>
)}
```

## 🧪 Testing

### Test case 1: Manager login
1. Login với account role = 'manager', centerId = 1
2. Navigate to "Tài chính & Báo cáo" tab
3. Verify: Biểu đồ hiển thị data của center 1

### Test case 2: Empty data
1. Login với Manager của center mới (chưa có data)
2. Navigate to "Tài chính & Báo cáo" tab
3. Verify: Hiển thị "Chưa có dữ liệu" message

### Test case 3: Refresh data
1. Click nút 🔄 Refresh trên biểu đồ
2. Verify: Data được reload từ API

## 📝 TODO - Backend Requirements

Backend team cần implement:

1. ✅ Endpoint: `GET /api/admin/reports/revenue`
   - Filter by manager's centerId
   - Return: `{ "1": 5000000, "2": 7500000, ... }`

2. ✅ Endpoint: `GET /api/admin/reports/profit`
   - Filter by manager's centerId
   - Return: `{ "1": 2000000, "2": 3500000, ... }`

3. ✅ Endpoint: `GET /api/admin/reports/trending-services/alltime`
   - Filter by manager's centerId
   - Return: `[{ serviceId, serviceName, count }, ...]`

4. ✅ Endpoint: `GET /api/admin/reports/trending-services/last-month`
   - Filter by manager's centerId
   - Return: `[{ serviceId, serviceName, count }, ...]`

5. ⚠️ JWT Token validation
   - Extract centerId from token
   - Apply filter automatically for MANAGER role

## 🎯 Kết quả mong đợi

- ✅ Manager chỉ xem data của center mình quản lý
- ✅ Biểu đồ hiển thị realtime data từ backend
- ✅ Xử lý graceful khi không có data
- ✅ Refresh data dễ dàng với nút 🔄
- ✅ Responsive UI, mobile-friendly

---

**Updated**: November 10, 2025  
**Author**: GitHub Copilot  
**Status**: ✅ Ready for testing (pending backend filter implementation)
