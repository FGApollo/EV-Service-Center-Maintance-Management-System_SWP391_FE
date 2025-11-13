# 🐛 Chat Debug Guide - Customer ⟷ Staff

## ✅ Đã thêm Logging chi tiết!

Tôi đã thêm console.log vào các điểm quan trọng để debug.

---

## 🧪 Cách Test

### **Bước 1: Mở Staff Dashboard**

1. Login với tài khoản staff
2. Vào tab "Chat"
3. Mở Developer Tools (F12) → Tab Console
4. Xóa console để dễ theo dõi

**Console sẽ hiển thị:**
```
✅ WebSocket connected
✅ Staff subscribed to /topic/staff/sessions
```

### **Bước 2: Mở Customer Page (Tab mới)**

1. Mở trang customer (cùng site, tab mới)
2. Mở Developer Tools (F12) → Tab Console  
3. Click nút chat ở góc phải dưới

**Console sẽ hiển thị:**
```
🔌 Đang kết nối WebSocket...
✅ WebSocket connected
📤 Creating new chat session: {
  sessionId: "customer-1699999999-abc123",
  customerId: "user_123",
  customerName: "Nguyễn Văn A",
  timestamp: 1699999999000
}
```

### **Bước 3: Check Staff Console**

Quay lại tab Staff Dashboard → Console

**NẾU BACKEND ĐÚNG, bạn sẽ thấy:**
```
📨 Raw staff event frame: {"type":"CREATED","sessionId":"customer-...","..."}
📨 Parsed staff event: {type: 'CREATED', sessionId: '...', ...}
📨 Event type: CREATED
✅ Creating room for session: customer-1699999999-abc123
📡 Staff subscribing to /topic/chat/customer-1699999999-abc123
✅ Staff subscribed to /topic/chat/customer-1699999999-abc123
```

**NẾU KHÔNG THẤY GÌ** → ❌ Backend không broadcast event!

### **Bước 4: Customer gửi tin nhắn**

Trong customer widget:
1. Gõ: "Xin chào!"
2. Click Gửi

**Customer Console sẽ hiển thị:**
```
📤 Sending message: {
  sessionId: "customer-1699999999-abc123",
  sender: "CUSTOMER",
  content: "Xin chào!",
  timestamp: 1699999999000
}
✅ Message sent successfully
```

**NẾU GẶP LỖI:**
```
⚠️ Cannot send - Not connected or no sessionId {
  connected: false,
  hasStompConnection: false,
  sessionId: null
}
💡 DEMO mode: Simulating staff reply
```
→ ❌ WebSocket chưa kết nối hoặc chưa có sessionId

### **Bước 5: Check Staff nhận tin nhắn**

Quay lại Staff Console:

**NẾU BACKEND ĐÚNG:**
```
📨 Received message in session customer-1699999999-abc123: {"sessionId":"...","sender":"CUSTOMER","content":"Xin chào!","timestamp":...}
📨 Parsed message: {sessionId: '...', sender: 'CUSTOMER', content: 'Xin chào!', ...}
```

**NẾU KHÔNG THẤY** → ❌ Backend không broadcast tin nhắn!

---

## 🔍 Phân tích Vấn đề

### ❌ **Scenario 1: Staff không nhận event CREATED**

**Console Staff KHÔNG hiển thị:**
```
📨 Raw staff event frame: ...
```

**Nguyên nhân:**
- Backend không broadcast event lên `/topic/staff/sessions`
- Backend endpoint `/app/chat.create` không hoạt động
- Backend không xử lý message đúng format

**Fix Backend:**
```java
@MessageMapping("/chat.create")
@SendTo("/topic/staff/sessions")
public ChatEvent createSession(ChatSessionRequest request) {
    return ChatEvent.builder()
        .type("CREATED")
        .sessionId(request.getSessionId())
        .customerId(request.getCustomerId())
        .customerName(request.getCustomerName())
        .timestamp(System.currentTimeMillis())
        .build();
}
```

### ❌ **Scenario 2: Staff không nhận tin nhắn**

**Console Staff hiển thị:**
```
✅ Staff subscribed to /topic/chat/customer-...
```

Nhưng KHÔNG hiển thị:
```
📨 Received message in session ...
```

**Nguyên nhân:**
- Backend không broadcast tin nhắn lên `/topic/chat/{sessionId}`
- Backend endpoint `/app/chat.send` không hoạt động

**Fix Backend:**
```java
@MessageMapping("/chat.send")
public void sendMessage(ChatMessage message) {
    // Broadcast đến cả customer và staff trong session
    messagingTemplate.convertAndSend(
        "/topic/chat/" + message.getSessionId(),
        message
    );
}
```

### ❌ **Scenario 3: Customer không kết nối**

**Console Customer hiển thị:**
```
❌ WebSocket connection error: ...
💡 Đang chạy ở chế độ DEMO
```

**Nguyên nhân:**
- Backend không chạy
- URL sai (không phải `http://localhost:8080/ws`)
- CORS issues

**Fix:**
1. Check backend đang chạy:
```bash
curl http://localhost:8080/ws
```

2. Check CORS config trong backend:
```java
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")  // Allow all
            .withSockJS();
}
```

---

## 📊 Expected Console Flow

### **Customer Console (Hoàn chỉnh):**
```
🔌 Đang kết nối WebSocket...
✅ WebSocket connected
📤 Creating new chat session: {sessionId: "...", ...}
📤 Sending message: {sessionId: "...", sender: "CUSTOMER", content: "Xin chào!", ...}
✅ Message sent successfully
```

### **Staff Console (Hoàn chỉnh):**
```
✅ WebSocket connected
✅ Staff subscribed to /topic/staff/sessions
📨 Raw staff event frame: {"type":"CREATED",...}
📨 Parsed staff event: {type: "CREATED", ...}
📨 Event type: CREATED
✅ Creating room for session: customer-...
📡 Staff subscribing to /topic/chat/customer-...
✅ Staff subscribed to /topic/chat/customer-...
📨 Received message in session customer-...: {"sender":"CUSTOMER",...}
📨 Parsed message: {sender: "CUSTOMER", content: "Xin chào!", ...}
```

---

## 🎯 Common Issues

### Issue 1: Backend chưa có handler

**Backend cần:**
```java
@MessageMapping("/chat.create")
@SendTo("/topic/staff/sessions")
public ChatEvent createSession(...) { ... }

@MessageMapping("/chat.send")
public void sendMessage(...) { ... }

@MessageMapping("/chat.close")
public void closeSession(...) { ... }
```

### Issue 2: Event format không đúng

**Backend phải trả về đúng format:**
```json
{
  "type": "CREATED",      // ← QUAN TRỌNG! Phải có field này
  "sessionId": "...",
  "customerId": "...",
  "customerName": "..."
}
```

### Issue 3: Topic không match

**Đảm bảo:**
- Customer subscribe: `/topic/chat/{sessionId}`
- Staff subscribe: `/topic/staff/sessions` (events) và `/topic/chat/{sessionId}` (messages)
- Backend send đúng topic

---

## 🚀 Quick Test Backend

Nếu muốn test backend trực tiếp, dùng file test HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"></script>
</head>
<body>
    <button onclick="testCreate()">Test Create Session</button>
    <button onclick="testSend()">Test Send Message</button>
    
    <script>
        let stomp;
        let sessionId = 'test-' + Date.now();
        
        // Connect
        const socket = new SockJS('http://localhost:8080/ws');
        stomp = Stomp.over(socket);
        stomp.connect({}, () => {
            console.log('Connected');
            
            // Subscribe staff events
            stomp.subscribe('/topic/staff/sessions', (frame) => {
                console.log('Staff event:', frame.body);
            });
            
            // Subscribe messages
            stomp.subscribe('/topic/chat/' + sessionId, (frame) => {
                console.log('Message:', frame.body);
            });
        });
        
        function testCreate() {
            stomp.send('/app/chat.create', {}, JSON.stringify({
                sessionId: sessionId,
                customerId: 'test-user',
                customerName: 'Test User'
            }));
        }
        
        function testSend() {
            stomp.send('/app/chat.send', {}, JSON.stringify({
                sessionId: sessionId,
                sender: 'CUSTOMER',
                content: 'Test message'
            }));
        }
    </script>
</body>
</html>
```

---

## 💡 Tips

1. **Luôn check console logs** - Tất cả các bước đều có log
2. **Test backend riêng** - Dùng HTML test file để verify backend
3. **Check Network tab** - Xem WebSocket frames trong DevTools → Network → WS
4. **Test từng bước** - Đừng test tất cả cùng lúc
5. **Clear console** - Để dễ nhìn flow

---

## ✅ Success Checklist

- [ ] Staff console hiển thị "✅ Staff subscribed to /topic/staff/sessions"
- [ ] Customer console hiển thị "✅ WebSocket connected"
- [ ] Customer console hiển thị "📤 Creating new chat session"
- [ ] Staff console hiển thị "📨 Parsed staff event: {type: 'CREATED', ...}"
- [ ] Staff console hiển thị "✅ Creating room for session: ..."
- [ ] Customer console hiển thị "✅ Message sent successfully"
- [ ] Staff console hiển thị "📨 Received message in session ..."
- [ ] Staff UI hiển thị room mới và tin nhắn customer

---

**Nếu tất cả checklist đều ✅ → Chat hoạt động hoàn hảo!** 🎉

**Nếu có ❌ → Check phần Troubleshooting tương ứng!** 🔧

---

**Tác giả**: AI Assistant 🤖  
**Ngày tạo**: 2025-11-13  
**Version**: Debug v1.0  
**Mục đích**: Debug chat integration

