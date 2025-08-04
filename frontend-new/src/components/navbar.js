import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Collapse from 'bootstrap/js/dist/collapse';
import '../styles/navbar.css';

const Navbar = () => {
  useEffect(() => {
    const handleCollapse = (event) => {
      if (event.target.closest('.dropdown-toggle')) return;
      const navbar = document.getElementById('navbarSupportedContent');
      const bsCollapse = Collapse.getInstance(navbar) || new Collapse(navbar, { toggle: false });
      if (window.innerWidth < 992) {
        bsCollapse.hide();
      }
    };

    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
    navLinks.forEach(link => {
      link.addEventListener('click', handleCollapse);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleCollapse);
      });
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar navbar-dark shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="user-brand nav-link" to="#">
          <i className="fa-solid fa-user"></i>
        </Link>
        <Link className="navbar-brand fw-bold" to="/">Study Buddy</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/learning">Start Learning</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                Subjects
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link className="dropdown-item" to="/subjects/biology">Biology</Link></li>
                <li><Link className="dropdown-item" to="/subjects/science">Science</Link></li>
                <li><Link className="dropdown-item" to="/subjects/maths">Maths</Link></li>
                <li><Link className="dropdown-item" to="/subjects/physics">Physics</Link></li>
                <li><Link className="dropdown-item" to="/subjects/chemistry">Chemistry </Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
