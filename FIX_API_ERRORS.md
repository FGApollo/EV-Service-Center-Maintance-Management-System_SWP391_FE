# 🐛 FIX API ERRORS - CORS & Network Issues

## ❌ **LỖI HIỆN TẠI**

```
❌ Access to XMLHttpRequest blocked by CORS policy
❌ Failed to load resource: net::ERR_FAILED
❌ Lỗi khi gọi API: Network Error
```

---

## ✅ **GIẢI PHÁP**

### **Option 1: Chuyển sang Local Backend (ĐÃ THỰC HIỆN)**

**✅ Changed:** `src/api/config.js`
```javascript
const ENV = "local"; // ← Đã đổi từ "render" sang "local"
const LOCAL_API = "http://localhost:8080";
```

**Yêu cầu:**
- Backend phải chạy trên `http://localhost:8080`
- Backend phải enable CORS cho `http://localhost:5174`

---

### **Option 2: Fix CORS trên Backend**

#### **A. Spring Boot Backend (Java)**

**File:** `src/main/java/config/CorsConfig.java`

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:3000"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

**Hoặc dùng annotation:**

```java
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000"
    },
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
public class AuthController {
    // Your endpoints...
}
```

---

#### **B. Node.js/Express Backend**

**Install CORS:**
```bash
npm install cors
```

**File:** `server.js` hoặc `app.js`

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Your routes...
app.post('/api/auth/login', (req, res) => {
  // Login logic
});

app.listen(8080, () => {
  console.log('Backend running on http://localhost:8080');
});
```

---

#### **C. .NET Core Backend (C#)**

**File:** `Program.cs` hoặc `Startup.cs`

```csharp
// Program.cs (.NET 6+)
var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

app.MapControllers();
app.Run();
```

---

## 🧪 **TEST BACKEND**

### **1. Check nếu backend đang chạy:**

**PowerShell:**
```powershell
# Test health endpoint
curl http://localhost:8080/api/health

# Test login endpoint
curl -Method POST http://localhost:8080/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123"}'
```

**Expected:** Response JSON, không có error

---

### **2. Start Backend (nếu chưa chạy):**

**Spring Boot:**
```bash
cd backend-folder
./mvnw spring-boot:run
# hoặc
java -jar target/your-app.jar
```

**Node.js:**
```bash
cd backend-folder
npm start
# hoặc
node server.js
```

**.NET:**
```bash
cd backend-folder
dotnet run
```

---

## 🔍 **VERIFY FIX**

### **1. Check Backend Console:**

Khi frontend gọi API, backend console should show:
```
✅ POST /api/auth/login
✅ Origin: http://localhost:5174
✅ Response: 200 OK
```

### **2. Check Browser Console:**

Không còn lỗi CORS:
```
✅ POST http://localhost:8080/api/auth/login - 200 OK
✅ Response: { token: "...", role: "manager", centerId: 1 }
```

### **3. Check Network Tab (F12):**

**Request Headers:**
```
Origin: http://localhost:5174
Content-Type: application/json
```

**Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Credentials: true
```

---

## 📝 **CHECKLIST**

### **Frontend (ĐÃ XONG ✅):**
- [x] Changed `src/api/config.js` ENV to "local"
- [x] API URL: `http://localhost:8080`
- [x] Login page ready
- [x] Manager Dashboard ready

### **Backend (CẦN LÀM ⏳):**
- [ ] Backend đang chạy trên port 8080
- [ ] CORS enabled cho `http://localhost:5174`
- [ ] Endpoint `/api/auth/login` hoạt động
- [ ] LoginResponse trả về `centerId`
- [ ] Database có user với `role='manager'` và `center_id=1`

---

## 🚀 **NEXT STEPS**

### **If Backend Local đang chạy:**
1. ✅ Frontend đã cấu hình xong
2. Add CORS config vào backend (xem phần A/B/C ở trên)
3. Restart backend
4. Refresh browser (F5)
5. Test login lại

### **If Backend chưa chạy:**
1. Start backend trên port 8080
2. Test endpoint: `curl http://localhost:8080/api/health`
3. Add CORS config
4. Test login

### **If muốn dùng Backend Render (online):**
1. Change `src/api/config.js`: `ENV = "render"`
2. Liên hệ backend team để fix CORS
3. Backend cần add `https://localhost:5174` vào allowed origins

---

## 🆘 **TROUBLESHOOTING**

### **Lỗi: "Connection refused" hoặc "ERR_CONNECTION_REFUSED"**
→ Backend chưa chạy, start backend trước

### **Lỗi: "CORS policy" vẫn còn sau khi add CORS config**
→ Restart backend sau khi thay đổi config
→ Clear browser cache (Ctrl+Shift+Delete)
→ Hard refresh (Ctrl+F5)

### **Lỗi: "404 Not Found /api/auth/login"**
→ Check backend routing, endpoint phải là `/api/auth/login`

### **Lỗi: "401 Unauthorized"**
→ Credentials sai, check email/password
→ Check database có user với role='manager'

### **Backend port không phải 8080?**
→ Sửa `src/api/config.js`:
```javascript
const LOCAL_API = "http://localhost:3000"; // Thay 3000 bằng port của bạn
```

---

## 📞 **SUPPORT**

**Frontend đã sẵn sàng!** ✅  
**Chỉ cần backend:**
1. Chạy trên port 8080
2. Enable CORS cho localhost:5174
3. Trả về `centerId` trong LoginResponse

**Files Reference:**
- `src/api/config.js` - API configuration (ĐÃ FIX)
- `src/api/axiosClient.js` - Axios setup
- `src/api/index.js` - API calls
- `TESTING_GUIDE.md` - Test scenarios

---

**Status:** ✅ Frontend Ready | ⏳ Waiting for Backend CORS Fix
