import React from "react";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-background">
      <div className="home-overlay">
        <div className="home-content">
          <h1 className="home-title">Welcome to Study Buddy</h1>
          <p className="home-subtitle">Your Smart Companion for Learning</p>
          <div className="home-buttons">
            <button className="home-button">Get Started</button>
            <button className="home-button secondary">Explore Subjects</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
