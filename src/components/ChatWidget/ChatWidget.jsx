import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaComments, FaCircle } from 'react-icons/fa';
import './ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'staff',
      text: 'Xin chào! 👋 Chúng tôi có thể giúp gì cho bạn?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const stompRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Debug: Log khi component mount
  useEffect(() => {
    console.log('✅ ChatWidget mounted!');
    return () => console.log('❌ ChatWidget unmounted');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(() => scrollToBottom(), 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // Kết nối WebSocket
  useEffect(() => {
    if (!isOpen || connected || sessionId) return;

    const initWebSocket = () => {
      try {
        const SockJS = window.SockJS;
        const Stomp = window.Stomp;

        if (!SockJS || !Stomp) {
          console.error('❌ SockJS hoặc Stomp chưa được load');
          console.log('💡 Đang chạy ở chế độ DEMO');
          return;
        }

        console.log('🔌 Đang kết nối WebSocket...');
        const socket = new SockJS('http://localhost:8080/ws');
        const stomp = Stomp.over(socket);
        stomp.debug = () => {};

        stomp.connect({}, () => {
          console.log('✅ WebSocket connected');
          setConnected(true);

          const newSessionId = `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          setSessionId(newSessionId);

          stomp.subscribe(`/topic/chat/${newSessionId}`, (frame) => {
            try {
              const msg = JSON.parse(frame.body);
              if (msg.sender === 'STAFF') {
                const newMessage = {
                  id: Date.now(),
                  sender: 'staff',
                  text: msg.content,
                  time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newMessage]);
                setIsTyping(false);
              }
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          });

          const createPayload = {
            sessionId: newSessionId,
            customerId: currentUser.user_id || 'guest',
            customerName: currentUser.fullName || 'Khách hàng',
            timestamp: Date.now()
          };
          
          console.log('📤 Creating new chat session:', createPayload);
          stomp.send('/app/chat.create', {}, JSON.stringify(createPayload));
          stompRef.current = stomp;
        }, (err) => {
          console.error('❌ WebSocket connection error:', err);
          console.log('💡 Đang chạy ở chế độ DEMO');
        });

      } catch (e) {
        console.error('Error initializing WebSocket:', e);
      }
    };

    initWebSocket();

    return () => {
      if (stompRef.current?.connected) {
        try {
          if (sessionId) {
            stompRef.current.send('/app/chat.close', {}, JSON.stringify({ sessionId }));
          }
          stompRef.current.disconnect(() => {
            console.log('🔌 WebSocket disconnected');
          });
        } catch (e) {
          console.error('Error disconnecting:', e);
        }
      }
    };
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const messageToSend = inputMessage;
    setInputMessage('');
    
    setMessages(prev => {
      const updated = [...prev, newMessage];
      setTimeout(() => scrollToBottom(), 100);
      return updated;
    });

    if (connected && stompRef.current?.connected && sessionId) {
      try {
        const msgPayload = {
          sessionId: sessionId,
          sender: 'CUSTOMER',
          content: messageToSend,
          timestamp: Date.now()
        };
        console.log('📤 Sending message:', msgPayload);
        stompRef.current.send('/app/chat.send', {}, JSON.stringify(msgPayload));
        console.log('✅ Message sent successfully');
      } catch (err) {
        console.error('❌ Error sending message:', err);
      }
    } else {
      console.log('💡 DEMO mode: Simulating staff reply');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const staffReply = {
          id: Date.now() + 1,
          sender: 'staff',
          text: 'Cảm ơn bạn đã liên hệ! Nhân viên sẽ phản hồi trong giây lát. 😊',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, staffReply]);
      }, 1500);
    }
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  console.log('🎨 ChatWidget rendering, isOpen:', isOpen);

  return (
    <>
      {/* Chat Window */}
      <div className={`modern-chat-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="modern-chat-header">
          <div className="header-left">
            <div className="header-avatar">
              <div className="avatar-icon">💬</div>
              <span className={`status-indicator ${connected ? 'online' : 'offline'}`}>
                <FaCircle />
              </span>
            </div>
            <div className="header-info">
              <h3>Hỗ trợ trực tuyến</h3>
              <p className="status-text">
                {connected ? 'Đang hoạt động' : 'Chế độ demo'}
              </p>
            </div>
          </div>
          <button className="close-button" onClick={toggleChat} aria-label="Đóng chat">
            <FaTimes />
          </button>
        </div>

        {/* Messages Area */}
        <div className="modern-chat-messages">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={`${msg.id}-${index}`} className={`message-wrapper ${msg.sender}`}>
                {msg.sender === 'staff' && (
                  <div className="message-avatar staff">
                    <span>👨‍💼</span>
                  </div>
                )}
                <div className="message-group">
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                  </div>
                  <span className="message-timestamp">{msg.time}</span>
                </div>
                {msg.sender === 'user' && (
                  <div className="message-avatar user">
                    <span>👤</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message-wrapper staff">
                <div className="message-avatar staff">
                  <span>👨‍💼</span>
                </div>
                <div className="message-group">
                  <div className="message-bubble typing">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <form className="modern-chat-input" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Nhập tin nhắn của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="message-input"
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!inputMessage.trim()}
              aria-label="Gửi tin nhắn"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>

      {/* Floating Button */}
      <button 
        className={`modern-chat-button ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Mở chat hỗ trợ"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 99999,
          display: 'flex'
        }}
      >
        <FaComments className="button-icon" />
        <span className="notification-badge">1</span>
      </button>
    </>
  );
}

export default ChatWidget;
