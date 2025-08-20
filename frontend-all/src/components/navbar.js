import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FaHome, FaUser, FaPlay, FaChartBar } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="nav-item" onClick={() => navigate("/")}>
        <FaHome className="nav-icon" />
        <span>Home</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/dashboard")}>
        <FaChartBar className="nav-icon" />
        <span>Dashboard</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/upload")}>
        <FaPlay className="nav-icon" />
        <span>Start Learning</span>
      </div>
      <div className="nav-item" onClick={() => navigate("/profile")}>
        <FaUser className="nav-icon" />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Navbar;
