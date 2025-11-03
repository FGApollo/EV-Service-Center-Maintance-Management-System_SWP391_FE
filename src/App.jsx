import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import Profile from "./pages/Profile.jsx";
import MyCar from "./pages/MyCar.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import Footer from "./components/Footer.jsx";

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

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    try { localStorage.setItem('user', JSON.stringify(userData)); } catch (e) {}
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
    switch(currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'booking':
        return <BookingPage onNavigate={handleNavigate} prefilledVehicle={selectedVehicle} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'mycar':
        return <MyCar onNavigate={handleNavigate} onNavigateWithVehicle={handleNavigateWithVehicle} />;
      case 'staff':
        return <StaffDashboard onNavigate={handleNavigate} />;
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
    </div>
  );
}

export default App;
