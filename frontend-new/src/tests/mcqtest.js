import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const McqTest = () => {
  const location = useLocation();
  const sourceText = location.state?.sourceText || '';

  console.log("McqTest: sourceText received:", sourceText);

  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = async () => {
    if (!sourceText) {
      setError("Source text not available to generate quiz.");
      return;
    }

    setLoading(true);
    setError(null);
    setMcqs([]);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      const response = await axios.post('http://api.local/generate_quiz_mcqs', {
        raw_text: sourceText,
        num_questions: 5, // You can make this dynamic if needed
      });
      console.log("McqTest: API response:", response.data);
      setMcqs(response.data);
    } catch (err) {
      console.error("McqTest: Error generating quiz MCQs:", err);
      setError("Failed to generate quiz MCQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionNumber, selectedOptionLetter) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionNumber]: selectedOptionLetter,
    }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    mcqs.forEach(mcq => {
      if (userAnswers[mcq.question_number] === mcq.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
      <h2>MCQ Test Page</h2>

      {!mcqs.length ? (
        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '18px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Generating Test...' : 'Take the Test'}
        </button>
      ) : null}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {mcqs.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>Your Quiz:</h3>
          {mcqs.map((mcq) => (
            <div key={mcq.question_number} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <p><strong>{mcq.question_number}. {mcq.question}</strong></p>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                {mcq.options.map((option, i) => {
                  const optionLetter = String.fromCharCode(65 + i);
                  const isSelected = userAnswers[mcq.question_number] === optionLetter;
                  const isCorrect = mcq.answer === optionLetter;

                  let optionStyle = {
                    padding: '8px 0',
                    borderBottom: '1px dashed #ddd',
                    cursor: submitted ? 'default' : 'pointer',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                  };

                  if (submitted) {
                    if (isCorrect) {
                      optionStyle.backgroundColor = '#d4edda'; // Correct answer background
                      optionStyle.fontWeight = 'bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle.backgroundColor = '#f8d7da'; // Incorrect selected answer background
                    }
                  } else if (isSelected) {
                    optionStyle.backgroundColor = '#e0f7fa'; // Selected but not submitted
                  }

                  return (
                    <li
                      key={optionLetter}
                      style={optionStyle}
                    >
                      <input
                        type="radio"
                        id={`q${mcq.question_number}-${optionLetter}`}
                        name={`question-${mcq.question_number}`}
                        value={optionLetter}
                        checked={isSelected}
                        onChange={() => !submitted && handleOptionSelect(mcq.question_number, optionLetter)}
                        disabled={submitted}
                        style={{ marginRight: '10px' }}
                      />
                      <label htmlFor={`q${mcq.question_number}-${optionLetter}`}>
                        {optionLetter}. {option}
                      </label>
                    </li>
                  );
                })}
              </ul>
              {submitted && (
                <p style={{ marginTop: '10px', fontWeight: 'bold', color: userAnswers[mcq.question_number] === mcq.answer ? '#28a745' : '#dc3545' }}>
                  Your Answer: {userAnswers[mcq.question_number]} {userAnswers[mcq.question_number] === mcq.answer ? '(Correct)' : '(Incorrect)'}
                  {! (userAnswers[mcq.question_number] === mcq.answer) && ` (Correct Answer: ${mcq.answer})`}
                </p>
              )}
            </div>
          ))}
          {!submitted && (
            <button
              onClick={handleSubmitTest}
              style={{ padding: '10px 20px', fontSize: '18px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
            >
              Submit Test
            </button>
          )}
          {submitted && (
            <div style={{ marginTop: '20px', fontSize: '20px', fontWeight: 'bold' }}>
              Your Score: {score} / {mcqs.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default McqTest;
