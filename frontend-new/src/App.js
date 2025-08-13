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
import Physics from './subjects/physics';
import Maths from './subjects/maths';
import Context from './subjects/context';
import PreQnA from './components/preqna';
import Transcript from './components/transcript';
import McqTest from './tests/mcqtest';

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
            <Route path='/subjects/physics' element = {<Physics/>} />
            <Route path='/subjects/maths' element = {<Maths/>} />
            <Route path="/subjects/context" element={<Context />} /> 
            <Route path="/preqna" element={<PreQnA />} /> 
            <Route path="/transcript" element={<Transcript />} /> 
            <Route path="/mcqtest" element={<McqTest />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
