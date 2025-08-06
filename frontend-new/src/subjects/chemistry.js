import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/chemistry.css';

const Chemistry = () => {
  return (
    <div className="chemistry-container">
      <div className="container py-5">
        <h1 className="chemistry-title display-4 mb-3">Chemistry Hub</h1>
        <p className="lead text-muted mb-5">Dive deep into the world of elements, reactions, and compounds. Create quizzes from your chemistry notes or test your knowledge with pre-generated questions.</p>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card chemistry-card h-100 text-center p-4 shadow-sm">
              <div className="card-body">
                <i className="fas fa-file-upload fa-3x text-primary mb-3"></i>
                <h5 className="card-title">Create a Quiz</h5>
                <p className="card-text">Generate a new quiz from your notes.</p>
                <Link to="/chemistry-upload-mcq" className="btn btn-primary">Create Quiz</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chemistry;
