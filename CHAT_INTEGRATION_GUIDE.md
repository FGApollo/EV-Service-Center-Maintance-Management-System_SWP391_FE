# 💬 Chat Integration - Customer ⟷ Staff

## ✅ Đã Fix!

**Vấn đề**: Customer nhắn tin qua ChatWidget nhưng Staff không nhận được  
**Nguyên nhân**: ChatWidget chỉ là UI demo, chưa kết nối WebSocket  
**Giải pháp**: Đã tích hợp WebSocket (SockJS + STOMP) vào ChatWidget

---

## 🔌 Kiến trúc WebSocket

### Backend Endpoints:
```
WebSocket: ws://localhost:8080/ws (SockJS)

Endpoints:
- /app/chat.create   → Customer tạo session mới
- /app/chat.send     → Gửi tin nhắn
- /app/chat.close    → Đóng session

Topics:
- /topic/staff/sessions     → Staff subscribe để nhận session mới
- /topic/chat/{sessionId}   → Subscribe để nhận tin nhắn trong session
```

### Flow hoạt động:

```
1. Customer mở chat widget
   ↓
2. Connect WebSocket → http://localhost:8080/ws
   ↓
3. Tạo sessionId mới: customer-{timestamp}-{random}
   ↓
4. Send /app/chat.create → Notify staff
   ↓
5. Subscribe /topic/chat/{sessionId}
   ↓
6. Staff dashboard tự động tạo chat room mới
   ↓
7. Customer gửi tin nhắn → /app/chat.send
   ↓
8. Staff nhận tin nhắn qua topic subscription
   ↓
9. Staff reply → Customer nhận qua subscription
```

---

## 🎯 Customer ChatWidget

### Tính năng mới:
✅ Kết nối WebSocket tự động khi mở chat  
✅ Tạo session ID unique cho mỗi customer  
✅ Gửi tin nhắn THẬT qua WebSocket  
✅ Nhận tin nhắn từ staff real-time  
✅ Connection status indicator (🟢 Connected / 🔴 Demo)  
✅ Fallback to DEMO mode nếu backend offline  
✅ Auto disconnect khi đóng widget  

### Code Flow:

```jsx
// 1. Mở chat → Connect WebSocket
useEffect(() => {
  if (!isOpen) return;
  
  const socket = new SockJS('http://localhost:8080/ws');
  const stomp = Stomp.over(socket);
  
  stomp.connect({}, () => {
    // 2. Tạo session ID
    const sessionId = `customer-${Date.now()}-${random}`;
    
    // 3. Notify staff
    stomp.send('/app/chat.create', {}, JSON.stringify({
      sessionId,
      customerId,
      customerName
    }));
    
    // 4. Subscribe để nhận reply
    stomp.subscribe(`/topic/chat/${sessionId}`, (msg) => {
      // Handle staff message
    });
  });
}, [isOpen]);

// 5. Gửi tin nhắn
const handleSend = () => {
  stomp.send('/app/chat.send', {}, JSON.stringify({
    sessionId,
    sender: 'CUSTOMER',
    content: message
  }));
};
```

---

## 👨‍💼 Staff Chat Dashboard

### Tính năng có sẵn:
✅ Subscribe `/topic/staff/sessions` để nhận session mới  
✅ Tự động tạo chat room khi có customer mới  
✅ Subscribe `/topic/chat/{sessionId}` để nhận tin nhắn  
✅ Gửi reply cho customer qua `/app/chat.send`  
✅ Đóng session qua `/app/chat.close`  

### Code Flow:

```jsx
// 1. Subscribe staff events
stomp.subscribe('/topic/staff/sessions', (event) => {
  if (event.type === 'CREATED') {
    // Tạo room mới
    createRoom(event.sessionId);
  }
});

// 2. Subscribe tin nhắn trong room
stomp.subscribe(`/topic/chat/${sessionId}`, (msg) => {
  if (msg.sender === 'CUSTOMER') {
    // Hiển thị tin nhắn customer
  }
});

// 3. Staff gửi reply
stomp.send('/app/chat.send', {}, JSON.stringify({
  sessionId,
  sender: 'STAFF',
  content: replyText
}));
```

---

## 🚀 Testing

### 1. Kiểm tra Backend
```bash
# Đảm bảo backend đang chạy
curl http://localhost:8080/health  # hoặc endpoint khác
```

### 2. Test Customer → Staff

**Bước 1**: Mở Staff Dashboard
- Login với tài khoản staff
- Vào tab "Chat"
- Màn hình sẽ hiển thị "Chờ khách hàng bắt đầu cuộc trò chuyện..."

**Bước 2**: Mở Customer page (tab mới)
- Click nút chat ở góc phải dưới
- Kiểm tra status: 🟢 "Đang kết nối" (nếu backend ON)
- Gõ tin nhắn và gửi

**Bước 3**: Check Staff Dashboard
- Room mới sẽ tự động xuất hiện
- Tin nhắn customer hiển thị: "Khách hàng: {message}"

**Bước 4**: Staff reply
- Gõ tin nhắn trong input box
- Click "Gửi" hoặc Enter

**Bước 5**: Check Customer widget
- Tin nhắn staff xuất hiện bên trái
- Format: Bubble trắng với text

### 3. Debug Console

**Customer console:**
```
🔌 Đang kết nối WebSocket...
✅ WebSocket connected
📤 Sent message to staff
```

**Staff console:**
```
✅ WebSocket connected
📨 Staff event: {type: 'CREATED', sessionId: '...'}
```

---

## ⚠️ Troubleshooting

### 1. Customer không kết nối được

**Triệu chứng**: Status hiển thị "🔴 Chế độ demo"

**Nguyên nhân**:
- Backend không chạy
- CORS issues
- SockJS/Stomp không load

**Fix**:
```bash
# 1. Check backend
curl http://localhost:8080/ws

# 2. Check browser console
# Xem có lỗi CORS hoặc 404 không

# 3. Verify libraries loaded
console.log(window.SockJS, window.Stomp);
```

### 2. Staff không nhận được session mới

**Triệu chứng**: Staff dashboard không hiện room mới

**Nguyên nhân**:
- Staff chưa subscribe `/topic/staff/sessions`
- Backend không broadcast event

**Fix**:
```jsx
// Check staff subscription
stomp.subscribe('/topic/staff/sessions', (frame) => {
  console.log('📨 Staff event:', JSON.parse(frame.body));
});
```

### 3. Tin nhắn không được gửi

**Triệu chứng**: Tin nhắn chỉ hiện local, không sang bên kia

**Nguyên nhân**:
- Session ID không match
- Sender không đúng format
- Topic subscription sai

**Fix**:
```jsx
// Customer log sessionId khi gửi
console.log('Sending to session:', sessionId);

// Staff check sessionId khi nhận
console.log('Received in session:', frame.headers.destination);
```

### 4. CORS Error

**Triệu chứng**: Browser console báo CORS

**Fix backend**:
```java
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // ← Allow all origins
                .withSockJS();
    }
}
```

---

## 🎨 UI/UX Features

### Customer Widget:
- ✨ Connection indicator (màu xanh/đỏ)
- 💬 Real-time messaging
- ⌨️ Typing indicator (có thể thêm)
- 📜 Auto scroll to bottom
- 🎀 Cute animations

### Staff Dashboard:
- 🔔 New session notification
- 👥 Multiple concurrent chats
- ✕ Close session button
- 📊 Session ID display
- 💬 Real-time updates

---

## 🔮 Future Enhancements

### Phase 2:
- [ ] Typing indicator (customer → staff, staff → customer)
- [ ] Read receipts (✓✓ tick marks)
- [ ] Sound notification
- [ ] File/Image upload
- [ ] Emoji picker
- [ ] Chat history persistence

### Phase 3:
- [ ] Multiple staff support
- [ ] Chat transfer between staff
- [ ] Chatbot integration (AI auto-reply)
- [ ] Analytics dashboard
- [ ] Customer feedback/rating
- [ ] Away message (ngoài giờ)

---

## 📝 Backend Requirements

### Message Format:

```json
{
  "sessionId": "customer-1699999999-abc123",
  "sender": "CUSTOMER" | "STAFF",
  "content": "Tin nhắn",
  "timestamp": 1699999999000,
  "customerId": "user_123",        // optional
  "customerName": "Nguyễn Văn A"   // optional
}
```

### Event Format:

```json
{
  "type": "CREATED" | "CLOSED",
  "sessionId": "customer-1699999999-abc123",
  "customerId": "user_123",
  "customerName": "Nguyễn Văn A",
  "initialMessage": {              // optional
    "sender": "CUSTOMER",
    "content": "Xin chào"
  }
}
```

---

## 🎓 Best Practices

1. **Session ID**: Luôn unique, format: `customer-{timestamp}-{random}`
2. **Error Handling**: Fallback to demo mode nếu WebSocket fail
3. **Connection Status**: Hiển thị rõ cho user biết
4. **Clean up**: Disconnect WebSocket khi component unmount
5. **Message Validation**: Check sender, content trước khi parse
6. **Logging**: Console.log để debug, nhưng tắt ở production

---

## 🎉 Summary

### ✅ Customer ChatWidget:
- Kết nối WebSocket khi mở chat
- Gửi tin nhắn THẬT qua `/app/chat.send`
- Nhận reply từ staff real-time
- Hiển thị connection status

### ✅ Staff Dashboard:
- Nhận session mới tự động
- Chat với nhiều customer cùng lúc
- Reply real-time
- Đóng session khi xong

### ✅ Communication:
- WebSocket bidirectional
- Topic-based subscription
- JSON message format
- Real-time, no polling

---

**🎊 Chat system đã hoạt động đầy đủ!**

Giờ customer nhắn tin qua widget → Staff nhận được ngay lập tức! 💬✨

---

**Tác giả**: AI Assistant 🤖  
**Ngày update**: 2025-11-13  
**Version**: 2.0.0 (WebSocket Integration)  
**Status**: Production Ready! 🚀

