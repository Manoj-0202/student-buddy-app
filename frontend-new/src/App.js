import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import Chemistry from './subjects/chemistry';
import Home from './components/home';
import ChemistryUpload from './uploads/chemistry-upload';
import ChemistryTest from './tests/chemistry-test';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/dashboard' element={< Dashboard/>} />
        <Route path="/subjects/chemistry" element={<Chemistry />} />
        <Route path="/chemistry-upload-mcq" element={<ChemistryUpload />} />
        <Route path="/chemistry-test" element={<ChemistryTest />} />
      </Routes>
    </Router>
  );
}

export default App;
