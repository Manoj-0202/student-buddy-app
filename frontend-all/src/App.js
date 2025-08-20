import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./components/home";
import Upload from "./components/upload";
import PreQnA from "./components/preqna";
import Analyze from "./components/analysing";
import McqTest from "./components/mcqtest";

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/analysing';

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/preqna" element={<PreQnA />} /> 
        <Route path="/analysing" element={<Analyze />} /> 
        <Route path="/mcqtest" element={<McqTest />} />
      </Routes>
      {showNavbar && <Navbar />}
    </div>
  );
};

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
};

export default App;
