
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
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showScorecard, setShowScorecard] = useState(false);

  const currentQuestion = qnaPairs[currentIndex];

  const handleOptionClick = (key) => {
    if (!isAnswered) {
      setSelectedOption(key);
      setIsAnswered(true);
      setUserAnswers(prev => ({ ...prev, [currentIndex]: key }));
      if (key === currentQuestion.answer) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < qnaPairs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScorecard(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers({});
    setShowScorecard(false);
  };

  const handleBack = () => {
    navigate('/chemistry-upload-mcq');
  };

  if (showScorecard) {
    return (
      <div className="test-container py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card test-card p-4 shadow-sm">
                <div className="card-body text-center">
                  <h1 className="card-title">Test Complete!</h1>
                  <h2 className="mb-4">Your Score: {score} / {qnaPairs.length}</h2>
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-primary me-3" onClick={handleRestart}>Retake Test</button>
                    <button className="btn btn-secondary" onClick={handleBack}>Create Another Quiz</button>
                  </div>
                  <hr />
                  <h3 className="mt-4">Review Your Answers</h3>
                  <div className="text-start">
                    {qnaPairs.map((q, index) => (
                      <div key={index} className="mb-3 p-2 border rounded">
                        <p><strong>Q{index + 1}: {q.question}</strong></p>
                        <p className={userAnswers[index] === q.answer ? 'text-success' : 'text-danger'}>
                          Your answer: {q.options[userAnswers[index]]}
                        </p>
                        {userAnswers[index] !== q.answer && (
                          <p className="text-success">Correct answer: {q.options[q.answer]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                      <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIndex === 0 || isAnswered}> <i className='fa-solid fa-angle-left'></i> Previous</button>
                      <button className="btn btn-primary" onClick={handleNext}>
                        {currentIndex === qnaPairs.length - 1 ? 'Finish' : 'Next'} <i className='fa-solid fa-angle-right'></i>
                      </button>
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
