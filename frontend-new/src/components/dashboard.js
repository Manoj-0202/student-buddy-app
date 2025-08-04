import React from 'react';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Study Buddy</h1>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Subjects</h2>
          <p>Explore content by subject: Maths, Science, English, Social, etc.</p>
        </div>
        <div className="dashboard-card">
          <h2>Recent Activity</h2>
          <p>See what you’ve studied recently and continue where you left off.</p>
        </div>
        <div className="dashboard-card">
          <h2>Progress</h2>
          <p>Track your learning progress and performance analytics.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
