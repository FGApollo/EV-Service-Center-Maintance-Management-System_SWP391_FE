import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import PaymentReturn from "./pages/PaymentReturn.jsx";
import Profile from "./pages/Profile.jsx";
import MyCar from "./pages/MyCar.jsx";
import StaffDashboard from "./pages/StaffDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard.jsx";
import Footer from "./components/Footer.jsx";
import ChatWidget from "./components/ChatWidget/ChatWidget.jsx";

const PAGE_TO_PATH = {
  home: '/',
  login: '/login',
  booking: '/booking',
  'payment-return': '/payment-return',
  profile: '/profile',
  mycar: '/mycar',
  staff: '/staff',
  technician: '/technician'
};

const PATH_TO_PAGE = Object.entries(PAGE_TO_PATH).reduce((acc, [page, path]) => {
  acc[path] = page;
  return acc;
}, {});

const getPageFromPath = (path) => PATH_TO_PAGE[path] || 'home';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return getPageFromPath(window.location.pathname);
    }
    return 'home';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useCallback((page, options = {}) => {
    const { replace = false, search, toast: toastOption } = options;
    setCurrentPage(page);
    if (toastOption) {
      setToast({
        id: Date.now(),
        ...toastOption,
        message: toastOption.message || ''
      });
    } else {
      setToast(null);
    }

    if (typeof window === 'undefined') {
      return;
    }

    const path = PAGE_TO_PATH[page] || '/';
    const url = `${path}${search !== undefined ? search : ''}`;
    const state = { page };

    if (replace) {
      window.history.replaceState(state, '', url);
    } else if (window.location.pathname !== path || (search !== undefined && window.location.search !== search)) {
      window.history.pushState(state, '', url);
    } else {
      window.history.replaceState(state, '', url);
    }
  }, []);

  // Ensure history state reflects initial page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({ page: currentPage }, '', window.location.pathname + window.location.search);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname;
      setCurrentPage(getPageFromPath(path));
    };

    window.addEventListener('popstate', handlePopState);
    // Listen for global logout events dispatched by axios client
    const handleAppLogout = (e) => {
      console.warn('App received logout event:', e?.detail);
      // Clear auth and redirect to login page
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (err) {}
      setIsLoggedIn(false);
      setUser(null);
      navigate('login', { replace: true });
    };
    window.addEventListener('app:logout', handleAppLogout);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('app:logout', handleAppLogout);
    };
  }, []);

  // Detect payment return và auto redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;
    
    // Check nếu có custom backend payment params
    const hasCustomParams = 
      urlParams.has('status') && urlParams.has('amount');
    
    // Check nếu có VNPay payment params
    const hasVNPayParams = 
      urlParams.has('vnp_TransactionStatus') || 
      urlParams.has('vnp_ResponseCode') ||
      urlParams.has('vnp_TxnRef');
    
    // Check nếu có MoMo payment params
    const hasMoMoParams = 
      urlParams.has('partnerCode') ||
      urlParams.has('orderId') ||
      urlParams.has('resultCode');
    
    // Nếu đang ở /api/auth/payment-return hoặc có payment params
    if (currentPath.includes('payment-return') || hasCustomParams || hasVNPayParams || hasMoMoParams) {
      console.log('💳 Detected payment return, redirecting...');
      navigate('payment-return', { 
        replace: true, 
        search: window.location.search 
      });
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    try { localStorage.setItem('user', JSON.stringify(userData)); } catch (e) {}
  };

  // Navigate thông thường - clear vehicle data
  const handleNavigate = (page) => {
    setSelectedVehicle(null); // Reset thông tin xe khi navigate thông thường
    navigate(page);
  };

  // Navigate với vehicle data - chỉ dùng khi bấm "Đặt lịch" từ MyCar
  const handleNavigateWithVehicle = (page, vehicleData) => {
    setSelectedVehicle(vehicleData);
    navigate(page);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'booking':
        return <BookingPage onNavigate={handleNavigate} prefilledVehicle={selectedVehicle} />;
      case 'payment-return':
        return <PaymentReturn onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'mycar':
        return <MyCar onNavigate={handleNavigate} onNavigateWithVehicle={handleNavigateWithVehicle} />;
      case 'staff':
        return <StaffDashboard onNavigate={handleNavigate} />;
      case 'technician':
        return <TechnicianDashboard onNavigate={handleNavigate} />;
      case 'home':
      default:
        return (
          <>
            <Navbar onNavigate={handleNavigate} isLoggedIn={isLoggedIn} onLogout={() => { setIsLoggedIn(false); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); }} user={user} />
            <main>
              <Home onNavigate={handleNavigate} />
            </main>
            <Footer onNavigate={handleNavigate} />
          </>
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
      {toast && (
        <div className={`app-toast ${toast.type || 'info'}`}>
          {toast.message}
        </div>
      )}
      {/* Chat Widget - Luôn hiển thị trên mọi trang */}
      <ChatWidget />
    </div>
  );
}

export default App;
