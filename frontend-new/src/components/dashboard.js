import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="container py-5">
        <h1 className="dashboard-title display-4 mb-5">Your Learning Hub</h1>
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card dashboard-card h-100 text-center p-4 shadow-sm">
              <div className="card-body">
                <i className="fas fa-book-open fa-3x text-primary mb-3"></i>
                <h5 className="card-title">Subjects</h5>
                <p className="card-text">Explore and manage your subjects.</p>
                <Link to="/subjects/chemistry" className="btn btn-outline-primary">Go to Subjects</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card dashboard-card h-100 text-center p-4 shadow-sm">
              <div className="card-body">
                <i className="fas fa-plus-circle fa-3x text-success mb-3"></i>
                <h5 className="card-title">Create a Quiz</h5>
                <p className="card-text">Generate a new quiz from your notes.</p>
                <Link to="/chemistry-upload-mcq" className="btn btn-success">Create Quiz</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card dashboard-card h-100 text-center p-4 shadow-sm">
              <div className="card-body">
                <i className="fas fa-lightbulb fa-3x text-warning mb-3"></i>
                <h5 className="card-title">Study Tip</h5>
                <p className="card-text">Break down large topics into smaller, manageable chunks. This makes learning less overwhelming and more effective!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
