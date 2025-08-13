import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="container text-center text-white">
        <h1 className="home-title display-3">Master Your Knowledge</h1>
        <p className="home-subtitle lead">Unlock your full potential with AI-powered quizzes, personalized learning paths, and insightful progress tracking. Your journey to academic excellence starts here.</p>
        <div className="home-buttons">
          <Link to="/dashboard" className="btn btn-lg btn-primary me-3">Get Started</Link>
          <Link to="/subjects/context" className="btn btn-lg btn-outline-light">Read the context and take test</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
