
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/chemistry-test.css';

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
    navigate('/chemistry-upload-mcq');
  };

  return (
    <div className="test-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card test-card p-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="card-title">Chemistry Test</h1>
                  <button className="btn btn-light" onClick={handleBack}>Back</button>
                </div>

                {qnaPairs.length > 0 ? (
                  <div>
                    <p className="text-muted text-center mb-3">Question {currentIndex + 1} of {qnaPairs.length}</p>
                    <p className="question-text">{currentQuestion.question}</p>
                    <div className="options-list list-group">
                      {Object.entries(currentQuestion.options).map(([key, value]) => {
                        const isCorrect = key === currentQuestion.answer;
                        const isSelected = key === selectedOption;
                        let optionClass = 'list-group-item list-group-item-action';
                        if (isAnswered) {
                          if (isCorrect) {
                            optionClass += ' correct-answer';
                          } else if (isSelected) {
                            optionClass += ' wrong-answer';
                          }
                        }

                        return (
                          <button key={key} className={optionClass} onClick={() => handleOptionClick(key)} disabled={isAnswered}>
                            {key}. {value}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && selectedOption !== currentQuestion.answer && (
                      <div className="alert alert-info mt-3 correct-answer-info">
                        Correct Answer: <strong>{currentQuestion.answer}</strong>. {currentQuestion.options[currentQuestion.answer]}
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIndex === 0}> <i className='fa-solid fa-angle-left'></i> Previous</button>
                      <button className="btn btn-primary" onClick={handleNext} disabled={currentIndex === qnaPairs.length - 1}>Next <i className='fa-solid fa-angle-right'></i></button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p>No questions available. Please create a quiz first.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/chemistry-upload-mcq')}>Create Quiz</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryTest;
