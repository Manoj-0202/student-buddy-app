import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavLinkClick = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>Study Buddy</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={handleNavLinkClick}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard" onClick={handleNavLinkClick}>Dashboard</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Subjects
              </a>
              <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/subjects/chemistry" onClick={handleNavLinkClick}>Chemistry</Link></li>
                <li><Link className="dropdown-item" to="/subjects/physics" onClick={handleNavLinkClick}>Physics</Link></li>
                <li><Link className="dropdown-item" to="/subjects/maths" onClick={handleNavLinkClick}>Maths</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="btn btn-primary" to="/chemistry-upload-mcq" onClick={handleNavLinkClick}>Create Quiz</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
