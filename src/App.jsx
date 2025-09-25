import React from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="pt-20"> {/* Padding top để tránh bị che bởi fixed navbar */}
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
