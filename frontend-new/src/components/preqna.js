import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/preqna.css";

const PreQnA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mcqs = location.state?.mcqs || [];
  const sourceText = location.state?.sourceText || '';

  // Log the generated MCQs to the console for verification
  console.log("Generated MCQs received in PreQnA:", mcqs);

  if (mcqs.length === 0) {
    return <div className="preqna-container"><h2>No MCQs available.</h2><p>Please go back and generate MCQs from a file.</p></div>;
  }

  return (
    <div className="preqna-container">
      <h2>Generated MCQs</h2>
      {mcqs.map((mcq, index) => (
        <div key={index} className="mcq-item">
          <h3>{mcq.question_number}. {mcq.question}</h3>
          <ul>
            {mcq.options.map((option, i) => {
              const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
              const isCorrect = optionLetter === mcq.answer;
              return (
                <li key={i} className={isCorrect ? 'correct-answer' : ''}>
                  {optionLetter}. {option}
                </li>
              );
            })}
          </ul>
          <p><strong>Answer:</strong> {mcq.answer}</p>
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/subjects/context')} style={{ marginRight: '10px' }}>Previous</button>
        <button className="btn btn-primary" onClick={() => navigate('/transcript', { state: { sourceText: sourceText } })}>Next</button>
      </div>
    </div>
  );
};

export default PreQnA;