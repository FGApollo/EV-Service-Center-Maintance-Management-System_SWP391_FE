import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import PaymentGatewayPage from "./pages/PaymentGatewayPage.jsx";
import PaymentReturnPage from "./pages/PaymentReturnPage.jsx";
import Profile from "./pages/Profile.jsx";
import MyCar from "./pages/MyCar.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import TechnicianDashboard from "./pages/TechnicianDashboard.jsx";
import Footer from "./components/Footer.jsx";
import AdminDashboard from './pages/AdminDashboard/index.jsx';
import ManagerDashboard from './pages/ManagerDashboard/index.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
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
  const [appointmentForPayment, setAppointmentForPayment] = useState(null);

  // 🔗 URL Routing - Sync currentPage với URL hash
  useEffect(() => {
    // Function để extract page từ URL hash
    const getPageFromHash = () => {
      const hash = window.location.hash.slice(1); // Bỏ dấu #
      
      console.log('📍 Current URL:', window.location.href);
      console.log('📍 Hash:', window.location.hash);
      console.log('📍 Parsed hash:', hash);
      
      // Nếu không có hash, về home
      if (!hash) return 'home';
      
      // Extract main page (trước dấu / hoặc toàn bộ nếu không có /)
      const mainPage = hash.split('/')[0] || hash;
      
      console.log('📍 Main page extracted:', mainPage);
      
      return mainPage;
    };

    // Set initial page từ URL
    const initialPage = getPageFromHash();
    setCurrentPage(initialPage);

    // Listen to hash changes (Back/Forward browser buttons)
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      console.log('🔄 Hash changed to:', newPage);
      setCurrentPage(newPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // ✅ Chỉ chạy 1 lần khi mount

  // Check URL params để detect payment return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check nếu có payment return params (VNPay, MoMo, etc.)
    const hasPaymentParams = 
      urlParams.has('vnp_TransactionStatus') || // VNPay
      urlParams.has('vnp_ResponseCode') ||      // VNPay
      urlParams.has('partnerCode') ||           // MoMo
      urlParams.has('orderId') ||               // MoMo
      urlParams.has('resultCode');              // MoMo
    
    if (hasPaymentParams) {
      console.log('🔄 Detected payment return callback');
      setCurrentPage('payment-return');
      window.location.hash = 'payment-return';
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    try { localStorage.setItem('user', JSON.stringify(userData)); } catch (e) {}
  };

  // Navigate to payment với appointment data
  const handleNavigateToPayment = (appointmentData) => {
    console.log('🔗 Navigate to payment with appointment:', appointmentData);
    setAppointmentForPayment(appointmentData);
    window.location.hash = 'payment';
  };

  // Handle payment complete
  const handlePaymentComplete = (paymentData) => {
    console.log('✅ Payment completed:', paymentData);
    setAppointmentForPayment(null);
    window.location.hash = 'home';
    alert('✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
  };

  // Navigate thông thường - clear vehicle data
  const handleNavigate = (page) => {
    console.log('🔗 Navigate to:', page);
    setSelectedVehicle(null); // Reset thông tin xe khi navigate thông thường
    
    // ✅ Set hash và đảm bảo path luôn là /
    if (page.startsWith('#')) {
      window.location.hash = page.slice(1); // Bỏ # vì window.location.hash tự thêm
    } else {
      window.location.hash = page;
    }
  };

  // Navigate với vehicle data - chỉ dùng khi bấm "Đặt lịch" từ MyCar
  const handleNavigateWithVehicle = (page, vehicleData) => {
    console.log('🔗 Navigate to:', page, 'with vehicle:', vehicleData);
    setSelectedVehicle(vehicleData);
    
    // ✅ Set hash và đảm bảo path luôn là /
    if (page.startsWith('#')) {
      window.location.hash = page.slice(1); // Bỏ # vì window.location.hash tự thêm
    } else {
      window.location.hash = page;
    }
  };

  const renderPage = () => {
    console.log('Current page:', currentPage);
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'booking':
        return <BookingPage onNavigate={handleNavigate} onNavigateToPayment={handleNavigateToPayment} prefilledVehicle={selectedVehicle} />;
      case 'payment':
        return <PaymentGatewayPage appointmentData={appointmentForPayment} onNavigate={handleNavigate} onPaymentComplete={handlePaymentComplete} />;
      case 'payment-return':
        return <PaymentReturnPage onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'mycar':
        return <MyCar onNavigate={handleNavigate} onNavigateWithVehicle={handleNavigateWithVehicle} />;
      case 'staff':
        return <StaffDashboard onNavigate={handleNavigate} />;
      case 'technician':
        return <TechnicianDashboard onNavigate={handleNavigate} />;
      case 'admin':
        console.log('Rendering AdminDashboard (deprecated - use manager)...');
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'manager':
        console.log('Rendering ManagerDashboard...');
        return <ManagerDashboard onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  // Check if current page should show Navbar and Footer
  const shouldShowNavbar = !['manager', 'admin', 'staff', 'technician'].includes(currentPage);
  const shouldShowFooter = !['manager', 'admin', 'staff', 'technician'].includes(currentPage);

  return (
    <div className="App">
      {shouldShowNavbar && (
        <Navbar 
          onNavigate={handleNavigate} 
          isLoggedIn={isLoggedIn} 
          onLogout={() => { 
            setIsLoggedIn(false); 
            setUser(null); 
            localStorage.removeItem('token'); 
            localStorage.removeItem('user');
            window.location.hash = 'home'; // ✅ Update hash
          }} 
          user={user} 
        />
      )}
      <main>
        {renderPage()}
      </main>
      {shouldShowFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
