// ================================================================
// CORS CONFIGURATION FOR SPRING BOOT BACKEND
// ================================================================
// Tạo file này trong backend project:
// src/main/java/com/evservice/config/CorsConfig.java
// ================================================================

package com.evservice.config;

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
                registry.addMapping("/api/**")  // Áp dụng cho tất cả /api/* endpoints
                    .allowedOrigins(
                        "http://localhost:5173",  // Vite default port
                        "http://localhost:5174",  // Vite alternative port (ĐANG DÙNG)
                        "http://localhost:3000",  // React default
                        "http://localhost:5000"   // Backup
                    )
                    .allowedMethods(
                        "GET", 
                        "POST", 
                        "PUT", 
                        "DELETE", 
                        "PATCH", 
                        "OPTIONS"
                    )
                    .allowedHeaders("*")  // Cho phép tất cả headers
                    .exposedHeaders(      // Expose headers cho frontend
                        "Authorization",
                        "Content-Type"
                    )
                    .allowCredentials(true)  // Cho phép cookies/credentials
                    .maxAge(3600);  // Cache preflight request 1 giờ
            }
        };
    }
}

// ================================================================
// ALTERNATIVE: Dùng @CrossOrigin trên từng Controller
// ================================================================
// Nếu không muốn tạo CorsConfig.java, có thể thêm annotation:

/*
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
    methods = {
        RequestMethod.GET, 
        RequestMethod.POST, 
        RequestMethod.PUT, 
        RequestMethod.DELETE
    },
    allowCredentials = "true"
)
public class AuthController {
    
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Login logic...
    }
}
*/

// ================================================================
// STEPS TO APPLY:
// ================================================================
// 1. Tạo file: src/main/java/com/evservice/config/CorsConfig.java
// 2. Copy code phần @Configuration ở trên
// 3. Adjust package name nếu cần (thay com.evservice thành package của bạn)
// 4. Restart backend (Ctrl+C rồi ./mvnw spring-boot:run)
// 5. Test lại frontend login
// 6. ✅ Should work!

// ================================================================
// VERIFY CORS WORKING:
// ================================================================
// Backend console should show:
// - No CORS errors
// - Request from http://localhost:5174 accepted
//
// Browser console should show:
// - Response headers include: Access-Control-Allow-Origin: http://localhost:5174
// - No CORS policy error
// - Login API returns 200 OK with token

// ================================================================
// IMPORTANT NOTES:
// ================================================================
// ✅ LoginResponse ĐÃ CÓ centerId! (Checked in OpenAPI spec)
// ✅ Backend port 8080 (Correct)
// ✅ Frontend config.js đã đúng (ENV = "local", port 8080)
// ⚠️ CHỈ CẦN: Add CORS config vào backend → DONE!
