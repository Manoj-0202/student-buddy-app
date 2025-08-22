import React, { useEffect, useState, useMemo } from "react";
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

  // fetch questions
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
        const data = Array.isArray(res?.data) ? res.data : [];
        setMcqs(data);
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

  const q = mcqs[currentIdx];

  const progressPct = useMemo(() => {
    if (!mcqs.length) return 0;
    return Math.round(((currentIdx) / mcqs.length) * 100);
  }, [currentIdx, mcqs.length]);

  const handleOptionSelect = (questionNumber, selectedLetter) => {
    setUserAnswers((prev) => ({ ...prev, [questionNumber]: selectedLetter }));
  };

  const goNext = () => {
    if (currentIdx < mcqs.length - 1) {
      setCurrentIdx((i) => i + 1);
      return;
    }
    // submit
    let correct = 0;
    mcqs.forEach((item) => {
      if (userAnswers[item.question_number] === item.answer) correct += 1;
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

  return (
    <div className="mcq-root">
      {/* Top bar */}
      <div className="topbar">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
          <FaArrowLeft />
        </button>
        <h2>Final Test</h2>
        {/* spacer to keep title centered */}
        <span />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <button className="icon-btn back-from-loading" onClick={() => navigate(-1)} aria-label="Back">
            <FaArrowLeft />
          </button>
          <div className="loading-box">
            <div className="spinner" />
            <p className="subtle">
              Generating insightful questions...
              <br />
              Please wait a moment.
            </p>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="stage">
        <div className="card" role="region" aria-live="polite">
          {error && <p className="error">{error}</p>}

          {!loading && !error && mcqs.length > 0 && !submitted && q && (
            <>
              <div className="q-progress">Question {currentIdx + 1}/{mcqs.length}</div>

              <div className="progress-wrap" aria-hidden>
                <div className="progress-rail">
                  <div
                    className="progress-bar"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <p className="q-text">{q.question}</p>

              <div className="options">
                {q.options.map((option, i) => {
                  const letter = String.fromCharCode(65 + i); // A, B, C...
                  const selected = userAnswers[q.question_number] === letter;
                  return (
                    <button
                      key={letter}
                      className={`option ${selected ? "selected" : ""}`}
                      onClick={() => handleOptionSelect(q.question_number, letter)}
                      aria-pressed={selected}
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
                  {currentIdx < mcqs.length - 1 ? "Next" : "Submit"}
                </button>
              </div>
            </>
          )}

          {!loading && !error && submitted && (
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
                <button className="ghost-btn" onClick={restart}>Retake</button>
                <button className="primary-btn" onClick={() => navigate("/")}>Done</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default McqTest;
