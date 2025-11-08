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
import AdminDashboard from './pages/AdminDashboard.jsx';

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
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    try { localStorage.setItem('user', JSON.stringify(userData)); } catch (e) {}
  };

  // Navigate to payment với appointment data
  const handleNavigateToPayment = (appointmentData) => {
    setAppointmentForPayment(appointmentData);
    setCurrentPage('payment');
  };

  // Handle payment complete
  const handlePaymentComplete = (paymentData) => {
    console.log('✅ Payment completed:', paymentData);
    setAppointmentForPayment(null);
    setCurrentPage('home');
    alert('✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
  };

  // Navigate thông thường - clear vehicle data
  const handleNavigate = (page) => {
    setSelectedVehicle(null); // Reset thông tin xe khi navigate thông thường
    setCurrentPage(page);
  };

  // Navigate với vehicle data - chỉ dùng khi bấm "Đặt lịch" từ MyCar
  const handleNavigateWithVehicle = (page, vehicleData) => {
    setSelectedVehicle(vehicleData);
    setCurrentPage(page);
  };

  const renderPage = () => {
    console.log('Current page:', currentPage);
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'booking':
        return <BookingPage onNavigate={handleNavigate} onNavigateToPayment={handleNavigateToPayment} prefilledVehicle={selectedVehicle} />;
      case 'payment':
        return <PaymentGatewayPage appointmentData={appointmentForPayment} onNavigate={handleNavigate} onPaymentComplete={handlePaymentComplete} />;
      case 'payment-return':
        return <PaymentReturnPage onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      case 'mycar':
        return <MyCar onNavigate={setCurrentPage} />;
      case 'staff':
        return <StaffDashboard onNavigate={setCurrentPage} />;
      case 'technician':
        return <TechnicianDashboard onNavigate={setCurrentPage} />;
      case 'admin':
        console.log('Rendering AdminDashboard...');
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'home':
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        onNavigate={setCurrentPage} 
        isLoggedIn={isLoggedIn} 
        onLogout={() => { 
          setIsLoggedIn(false); 
          setUser(null); 
          localStorage.removeItem('token'); 
          localStorage.removeItem('user');
          setCurrentPage('home');
        }} 
        user={user} 
      />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
