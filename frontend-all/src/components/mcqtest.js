import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateQuizMcqs } from "../services/api";
import "../styles/mcqtest.css";

import { FaArrowLeft } from "react-icons/fa";

const McqTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sourceText = location.state?.sourceText || "";

  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const autoStart = async () => {
      if (!sourceText) {
        setError("Source text not available to generate quiz.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await generateQuizMcqs(sourceText, 5);
        setMcqs(res.data || []);
        setCurrentIdx(0);
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
      } catch (err) {
        console.error("Generate MCQs error:", err);
        setError("Failed to generate quiz MCQs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    autoStart();
  }, [sourceText]);

  const handleOptionSelect = (questionNumber, selectedOptionLetter) => {
    setUserAnswers((prev) => ({ ...prev, [questionNumber]: selectedOptionLetter }));
  };

  const goNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx((i) => i + 1);
      return;
    }
    let correct = 0;
    mcqs.forEach((q) => {
      if (userAnswers[q.question_number] === q.answer) correct += 1;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const restart = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setSubmitted(false);
    setScore(0);
  };

  const q = mcqs[currentIdx];

  return (
    <div className="mcq-root">
      {/* Top bar */}
      <div className="topbar">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
          <FaArrowLeft />
        </button>
        <h2>Final Test</h2>
      </div>

      {loading && (
        <div className="loading-overlay">
          <p className="subtle">
            Generating insightful questions...
            <br />
            Please wait a moment.
          </p>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      {!loading && !error && mcqs.length > 0 && !submitted && (
        <>
          <h3 className="q-progress">
            Question {currentIdx + 1}/{mcqs.length}
          </h3>
          <p className="q-text">{q.question}</p>

          <div className="options">
            {q.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const selected = userAnswers[q.question_number] === letter;
              return (
                <button
                  key={letter}
                  className={`option ${selected ? "selected" : ""}`}
                  onClick={() => handleOptionSelect(q.question_number, letter)}
                >
                  <span className={`radio ${selected ? "on" : ""}`} />
                  <span className="label">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="cta-row">
            <button
              className="primary-btn"
              onClick={goNext}
              disabled={!userAnswers[q.question_number]}
            >
              Next
            </button>
          </div>
        </>
      )}

      {submitted && (
        <div className="result-card">
          <div className="result-title">Your Score</div>
          <div className="result-score">
            {score} / {mcqs.length}
          </div>

          <div className="answers-review">
            {mcqs.map((item) => {
              const picked = userAnswers[item.question_number];
              const correct = item.answer;
              const isCorrect = picked === correct;
              return (
                <div
                  className={`review-row ${isCorrect ? "ok" : "bad"}`}
                  key={item.question_number}
                >
                  <div className="review-q">
                    {item.question_number}. {item.question}
                  </div>
                  <div className="review-a">
                    Your: {picked || "-"} {isCorrect ? "(Correct)" : `(Correct: ${correct})`}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="result-ctas">
            <button className="ghost-btn" onClick={restart}>
              Retake
            </button>
            <button className="primary-btn" onClick={() => navigate("/")}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default McqTest;
