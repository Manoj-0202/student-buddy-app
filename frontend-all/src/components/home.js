import React from "react";
import { FaHome, FaUser, FaBookOpen, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  // ✅ import navigate
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate(); // ✅ hook for navigation

  const handleStartLearning = () => {
    navigate("/upload"); // ✅ go to Upload page
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h2>StudyBuddy</h2>
        <button className="settings-btn">⚙️</button>
      </header>

      {/* Welcome Section */}
      <section className="welcome-box">
        <h3>Welcome back, Alex!</h3>
        <div className="welcome-card">
          <img
            src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_4_Frame_0_pn6j2y.jpg"
            alt="Learning"
            className="welcome-img"
          />
          <div className="welcome-text">
            <h4>AI-Powered Learning</h4>
            <p>
              Get insights and track your academic growth. Unlock your full
              potential with personalized learning.
            </p>
          </div>
          {/* ✅ Button now navigates */}
          <button className="start-btn" onClick={handleStartLearning}>
            Start Learning
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions">
          <div className="action-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_l8ygn0.jpg" alt="Pre-Test" />
            <p>Pre-Test</p>
          </div>
          <div className="action-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_1_sehooy.jpg" alt="AI Understanding" />
            <p>AI Understanding</p>
          </div>
          <div className="action-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_2_jv7zid.jpg" alt="Final Test" />
            <p>Final Test</p>
          </div>
          <div className="action-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_3_az9hct.jpg" alt="Practice" />
            <p>Practice</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h3 className="section-title">Features</h3>
        <div className="features">
          <div className="feature-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_5_d9vrhi.jpg" alt="Instant Feedback" />
            <p>Instant Feedback</p>
          </div>
          <div className="feature-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_4_yidyz3.jpg" alt="Daily Feedback" />
            <p>Daily Feedback</p>
          </div>
          <div className="feature-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_4_yidyz3.jpg" alt="Growth Tracker" />
            <p>Growth Tracker</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
