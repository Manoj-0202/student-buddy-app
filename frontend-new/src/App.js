import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap's JavaScript
import './App.css';

import Navbar from './components/navbar';
import Home from './components/home';
import Dashboard from './components/dashboard';
import Chemistry from './subjects/chemistry';
import ChemistryUpload from './uploads/chemistry-upload';
import ChemistryTest from './tests/chemistry-test';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects/chemistry" element={<Chemistry />} />
            <Route path="/chemistry-upload-mcq" element={<ChemistryUpload />} />
            <Route path="/chemistry-test" element={<ChemistryTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
