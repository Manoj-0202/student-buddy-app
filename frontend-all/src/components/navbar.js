import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import { homeConfig } from "../config";

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
      if (e.matches) {
        setIsVisible(true);
      }
    };

    setIsLargeScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    lastYRef.current = window.scrollY;
    if (!mediaQuery.matches) {
      setIsVisible(isHome ? true : false);
    }

    const onScroll = () => {
      if (isLargeScreen || isHome) return;

      const y = window.scrollY;
      const prev = lastYRef.current;
      const delta = y - prev;

      if (delta > 2 && y > 8) {
        setIsVisible(true);
      } else if (delta < -2) {
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
      ]
        .join(" ")
        .trim()}
    >
      <div className="navbar-logo" onClick={() => navigate("/")}>
        {homeConfig.navConfig.logo}
      </div>
      {homeConfig.navConfig.navItems.map((item, index) => (
        <div
          key={index}
          className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon className="nav-icon" />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
