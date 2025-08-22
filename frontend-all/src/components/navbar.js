import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import { FaHome, FaUser, FaPlay, FaChartBar } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const lastYRef = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const isHome = location.pathname === "/";
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = (e) => {
      setIsLargeScreen(e.matches);
      // If it becomes a large screen, ensure navbar is visible
      if (e.matches) {
        setIsVisible(true);
      }
    };

    // Initial check
    setIsLargeScreen(mediaQuery.matches);
    // Add listener for changes
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // On route change: fixed & visible on home, hidden by default elsewhere
    lastYRef.current = window.scrollY;
    // Only set visibility based on home if not large screen
    if (!mediaQuery.matches) {
      setIsVisible(isHome ? true : false);
    }

    const onScroll = () => {
      // If it's a large screen, or on home page, do not hide/show based on scroll
      if (isLargeScreen || isHome) return;

      const y = window.scrollY;
      const prev = lastYRef.current;
      const delta = y - prev;

      // Reveal when scrolling down (beyond a tiny threshold)
      if (delta > 2 && y > 8) {
        setIsVisible(true);
      }
      // Hide when scrolling up
      else if (delta < -2) {
        setIsVisible(false);
      }
      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, [isHome, isLargeScreen]);

  return (
    <div
      className={[
        "navbar",
        isHome ? "fixed" : "",
        isVisible ? "visible" : "hidden",
      ].join(" ").trim()}
    >
      <div className="navbar-logo" onClick={() => navigate("/")}>
        StudyBuddy
      </div>
      <div
        className={`nav-item ${isActive("/") ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <FaHome className="nav-icon" />
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        onClick={() => navigate("/dashboard")}
      >
        <FaChartBar className="nav-icon" />
        <span>Dashboard</span>
      </div>

      <div
        className={`nav-item ${isActive("/upload") ? "active" : ""}`}
        onClick={() => navigate("/upload")}
      >
        <FaPlay className="nav-icon" />
        <span>Start Learning</span>
      </div>

      <div
        className={`nav-item ${isActive("/profile") ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <FaUser className="nav-icon" />
        <span>Profile</span>
      </div>
    </div>
  );
};

export default Navbar;
