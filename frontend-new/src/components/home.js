import React from "react";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-background">
      <div className="home-overlay">
        <div className="home-content">
          <h1 className="home-title">Welcome to Study Buddy</h1>
          <p className="home-subtitle">
            Empowering students with smart tools to learn, revise, and grow.
          </p>
          <div className="home-buttons">
            <button className="home-button">Start Learning</button>
            <button className="home-button secondary">Browse Subjects</button>
          </div>
          <div className="home-extra">
            <p className="home-tagline">🚀 Interactive lessons, quizzes & progress tracking – all in one place!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
