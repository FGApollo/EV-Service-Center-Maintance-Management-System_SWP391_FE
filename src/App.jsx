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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <Login onNavigate={setCurrentPage} onLogin={setIsLoggedIn} />;
      case 'booking':
        return <BookingPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      case 'mycar':
        return <MyCar onNavigate={setCurrentPage} />;
      case 'staff':
        return <StaffDashboard onNavigate={setCurrentPage} />;
      case 'home':
      default:
        return (
          <>
            <Navbar onNavigate={setCurrentPage} isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
            <main>
              <Home onNavigate={setCurrentPage} />
            </main>
            <Footer onNavigate={setCurrentPage} />
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
