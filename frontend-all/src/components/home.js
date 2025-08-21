import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import "../styles/home.css";
import ActionCard from "./ActionCard";

const Home = () => {
  const navigate = useNavigate();
  const handleStartLearning = () => navigate("/upload");

  return (
    <div className="home-container">
      <header className="header">
        <h2 className="brand">StudyBuddy</h2>
        <button className="settings-btn" type="button" aria-label="Settings">
          <FiSettings />
        </button>
      </header>

      <section className="welcome-box">
        <h3 className="greeting">Welcome back, Alex!</h3>

        <div className="welcome-card">
          <img
            src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_4_Frame_0_pn6j2y.jpg"
            alt="AI learning illustration"
            className="welcome-img"
          />
          <div className="welcome-text">
            <h4 className="subhead">AI–Powered Learning</h4>
            <p className="muted">
              Get insights and track your academic growth. Unlock your full
              potential with personalized learning.
            </p>
          </div>
          <button className="start-btn" onClick={handleStartLearning}>
            Start Learning
          </button>
        </div>
      </section>

      <section>
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions">
          <ActionCard
            image="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_l8ygn0.jpg"
            title="Pre-Test"
          />

          <ActionCard
            image="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_1_sehooy.jpg"
            title="AI Understanding"
          />

          <ActionCard
            image="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_2_jv7zid.jpg"
            title="Final Test"
          />

          <ActionCard
            image="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590507/Depth_5_Frame_0_3_az9hct.jpg"
            title="Practice"
          />
        </div>
      </section>

      <section>
        <h3 className="section-title">Features</h3>
        <div className="features">
          <div className="feature-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_5_d9vrhi.jpg" alt="Instant Feedback" />
            <p className="feature-label">Instant Feedback</p>
            <p className="feature-muted">Get real-time feedback on your progress.</p>
          </div>

          <div className="feature-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_4_yidyz3.jpg" alt="Daily Feedback" />
            <p className="feature-label">Daily Feedback</p>
            <p className="feature-muted">Engage in daily practice sessions.</p>
          </div>

          <div className="feature-card">
            <img src="https://res.cloudinary.com/dq4zfh8nh/image/upload/v1755590769/Depth_5_Frame_0_4_yidyz3.jpg" alt="Growth Tracker" />
            <p className="feature-label">Growth Tracker</p>
            <p className="feature-muted">Track progress with simple visuals.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
