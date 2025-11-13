# 💬 Chat Widget - Hướng dẫn sử dụng

## 🎀 Tổng quan

Chat Widget là một component nhỏ xinh xinh, luôn hiển thị ở góc dưới bên phải màn hình, cho phép khách hàng chat trực tiếp với nhân viên hỗ trợ.

## ✨ Tính năng

### 1. **Floating Button**
- 🎯 Nút tròn xinh xinh với gradient tím-xanh
- 💫 Animation bounce và pulse
- 🔔 Badge thông báo tin nhắn mới (có wiggle effect)
- 📱 Fixed position - luôn đi theo màn hình
- 🎨 Hover effects mượt mà

### 2. **Chat Popup**
- 💬 Popup chat đẹp với animation scale + slide
- 👨‍💼 Avatar và status online
- 📜 Hiển thị lịch sử tin nhắn
- ⌨️ Typing indicator khi staff đang gõ
- 📤 Input box với send button

### 3. **Responsive Design**
- 💻 Desktop: Popup 380x550px ở góc phải
- 📱 Mobile: Full screen overlay
- 🎯 Auto scroll to bottom khi có tin nhắn mới

## 📁 Cấu trúc Files

```
src/components/ChatWidget/
├── ChatWidget.jsx          # Component chính
└── ChatWidget.css          # Styling xinh xinh
```

## 🎨 Giao diện

### Color Scheme
- **Primary Gradient**: `#667eea → #764ba2` (Tím - Xanh)
- **Background**: `#f8fafc` (Xám nhạt)
- **Staff Message**: `white`
- **User Message**: Gradient primary
- **Status Dot**: `#10b981` (Xanh lá)
- **Badge**: `#ef4444` (Đỏ)

### Animations
- ✨ **bounce**: Nút chat nhảy nhẹ
- 💓 **pulse**: Icon chat nhấp nháy
- 🔄 **wiggle**: Badge rung nhẹ
- 📈 **slideUp**: Tin nhắn trượt lên
- ⌨️ **typing**: 3 chấm nhảy khi typing
- 🌟 **blink**: Status dot nhấp nháy

## 🚀 Cách sử dụng

### 1. Import vào App.jsx
```jsx
import ChatWidget from "./components/ChatWidget/ChatWidget.jsx";

// Trong return
<ChatWidget />
```

### 2. Component tự động hoạt động
- Click nút chat → Mở popup
- Gõ tin nhắn → Enter hoặc click Send
- Staff sẽ reply tự động (demo)
- Click X hoặc click nút chat → Đóng popup

## 🔧 Customization

### Thay đổi màu sắc
```css
/* ChatWidget.css */
.chat-widget-button {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

### Thay đổi vị trí
```css
.chat-widget-button {
  bottom: 24px;  /* Khoảng cách từ dưới */
  right: 24px;   /* Khoảng cách từ phải */
}
```

### Thay đổi kích thước popup
```css
.chat-widget-popup {
  width: 380px;   /* Chiều rộng */
  height: 550px;  /* Chiều cao */
}
```

### Ẩn chat ở trang cụ thể
```jsx
// Trong App.jsx, thêm điều kiện
{currentPage !== 'staff' && currentPage !== 'technician' && <ChatWidget />}
```

## 🔌 Tích hợp Socket.IO (Future)

Để tích hợp chat real-time với backend:

### 1. Import Socket Context
```jsx
import { useSocket } from '../../contexts/SocketContext';

const { socket, connected } = useSocket();
```

### 2. Send Message qua Socket
```jsx
const handleSendMessage = (e) => {
  e.preventDefault();
  if (!inputMessage.trim() || !socket) return;

  const newMessage = {
    id: Date.now(),
    sender: 'user',
    text: inputMessage,
    time: new Date().toISOString()
  };

  // Emit to server
  socket.emit('customer_message', {
    message: inputMessage,
    userId: currentUser.user_id
  });

  setMessages(prev => [...prev, newMessage]);
  setInputMessage('');
};
```

### 3. Listen for Staff Messages
```jsx
useEffect(() => {
  if (!socket) return;

  socket.on('staff_reply', (data) => {
    const staffMessage = {
      id: Date.now(),
      sender: 'staff',
      text: data.message,
      time: data.time
    };
    setMessages(prev => [...prev, staffMessage]);
  });

  return () => {
    socket.off('staff_reply');
  };
}, [socket]);
```

## 📊 State Management

```jsx
const [isOpen, setIsOpen] = useState(false);          // Popup mở/đóng
const [messages, setMessages] = useState([]);         // Danh sách tin nhắn
const [inputMessage, setInputMessage] = useState(''); // Input value
const [isTyping, setIsTyping] = useState(false);      // Staff đang gõ
```

## 🎯 Features để thêm

### Đã có ✅
- Floating button với animations
- Popup chat responsive
- Send/receive messages (demo)
- Typing indicator
- Auto scroll
- Badge notification
- Smooth animations

### Có thể thêm 🚀
1. **Socket.IO Integration**: Chat real-time với staff
2. **File Upload**: Gửi hình ảnh, file
3. **Emoji Picker**: Thêm emoji vào tin nhắn
4. **Sound Notification**: Tiếng "ting" khi có tin nhắn mới
5. **Read Receipts**: Tick xanh khi staff đã đọc
6. **Chat History**: Lưu lịch sử chat trong localStorage
7. **Multiple Staff**: Chọn nhân viên cụ thể để chat
8. **Rating**: Đánh giá sau khi chat xong
9. **Quick Replies**: Các câu trả lời nhanh
10. **Away Message**: Thông báo ngoài giờ làm việc

## 💡 Tips

### Auto-open khi có event
```jsx
// Tự động mở chat khi user cần hỗ trợ
useEffect(() => {
  const needHelp = localStorage.getItem('needHelp');
  if (needHelp === 'true') {
    setIsOpen(true);
    localStorage.removeItem('needHelp');
  }
}, []);
```

### Persistent chat
```jsx
// Lưu trạng thái chat
useEffect(() => {
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}, [messages]);

// Load lại khi mount
useState(() => {
  const saved = localStorage.getItem('chatMessages');
  return saved ? JSON.parse(saved) : [defaultMessage];
});
```

### Notification permission
```jsx
// Xin quyền notification
const requestNotification = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

// Show notification khi có tin nhắn mới
const showNotification = (message) => {
  if (Notification.permission === 'granted') {
    new Notification('Tin nhắn mới từ CarCare', {
      body: message,
      icon: '/logo.png'
    });
  }
};
```

## 🐛 Troubleshooting

### 1. Nút chat không hiển thị
- Kiểm tra z-index (phải > các elements khác)
- Kiểm tra CSS import đúng chưa
- Xem console có lỗi không

### 2. Animation không mượt
- Kiểm tra browser có hỗ trợ CSS transitions
- Đảm bảo không có CSS conflicts
- Thử disable hardware acceleration nếu lag

### 3. Mobile không responsive
- Kiểm tra viewport meta tag
- Xem media queries có apply không
- Test trên nhiều devices khác nhau

## 📱 Browser Support

- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support
- ✅ Safari - Full support
- ✅ Mobile browsers - Full support

## 🎓 Best Practices

1. **Performance**: Lazy load chat widget chỉ khi cần
2. **Accessibility**: Thêm aria-labels cho screen readers
3. **SEO**: Không ảnh hưởng vì là fixed component
4. **Security**: Validate input, sanitize messages
5. **UX**: Đừng auto-open quá nhiều, sẽ annoying

## 📝 Notes

- Component độc lập, không phụ thuộc vào page nào
- Có thể tái sử dụng cho nhiều projects
- CSS animations sử dụng GPU acceleration (performant)
- Messages hiện tại là demo, cần tích hợp backend

---

**Tác giả**: AI Assistant 🤖  
**Ngày tạo**: 2025-11-13  
**Version**: 1.0.0 (Beta)  
**Status**: Ready to use! 🎉

