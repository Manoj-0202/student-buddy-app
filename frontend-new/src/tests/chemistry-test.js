import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/chemistry-test.css";

const ChemistryTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qnaPairs } = location.state || { qnaPairs: [] };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = qnaPairs[currentIndex];

  const handleOptionClick = (key) => {
    if (!isAnswered) {
      setSelectedOption(key);
      setIsAnswered(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < qnaPairs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleBack = () => {
    navigate("/chemistry-upload-mcq");
  };

  return (
    <div className="chemistry-test-container">
      <div className="chemistry-test-box">
        <div className="test-header">
          <h3 className="chemistry-test-title"> Chemistry Test</h3>
          <button onClick={handleBack} className="back-button">
            ← Back
          </button>
        </div>

        {qnaPairs.length > 0 ? (
          <div className="qna-card">
            <p className="question-text">
              <strong>Q{currentQuestion.question_number}:</strong> {currentQuestion.question}
            </p>

            <div className="options-list">
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const isCorrect = key === currentQuestion.answer;
                const isSelected = key === selectedOption;

                let optionClass = "option-item";
                if (isAnswered && isSelected && isCorrect) {
                  optionClass += " correct-answer";
                } else if (isAnswered && isSelected && !isCorrect) {
                  optionClass += " wrong-answer";
                }

                return (
                  <p
                    key={key}
                    className={optionClass}
                    onClick={() => handleOptionClick(key)}
                  >
                    {key}. {value}
                  </p>
                );
              })}
            </div>

            {isAnswered && selectedOption !== currentQuestion.answer && (
              <p className="answer-label">
                ✅ Correct Answer: <strong>{currentQuestion.answer}</strong> —{" "}
                {currentQuestion.options[currentQuestion.answer]}
              </p>
            )}

            <div className="button-group">
              <button onClick={handlePrev} disabled={currentIndex === 0}>
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === qnaPairs.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          <p className="no-data-text">
            No Q&A pairs available. Please upload a file first.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChemistryTest;