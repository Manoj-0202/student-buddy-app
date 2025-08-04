import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/chemistry-test.css";
 
const ChemistryTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qnaPairs } = location.state || { qnaPairs: [] };
 
  const handleBack = () => {
    navigate("/chemistry-upload"); // Change if your upload page route is different
  };
 
  return (
<div className="chemistry-test-container">
<div className="chemistry-test-box">
<h3 className="chemistry-test-title">🧪 Chemistry Test</h3>
 
        {qnaPairs.length > 0 ? (
<div className="qna-list">
            {qnaPairs.map((item, index) => (
<div key={index} className="qna-card">
<p><strong>Question {item.question_number}:</strong> {item.question}</p>
<div className="options-list">
                  {Object.entries(item.options).map(([key, value]) => (
<p
                      key={key}
                      className={`option-item ${
                        key === item.answer ? "correct-answer" : ""
                      }`}
>
                      {key}. {value}
</p>
                  ))}
</div>
<p className="answer-label">
<strong>Correct Answer:</strong> {item.answer} — {item.options[item.answer]}
</p>
</div>
            ))}
</div>
        ) : (
<p className="no-data-text">No Q&A pairs available. Please upload a file first.</p>
        )}
 
        <button onClick={handleBack} className="back-button">
          ⬅ Go Back
</button>
</div>
</div>
  );
};
 
export default ChemistryTest;