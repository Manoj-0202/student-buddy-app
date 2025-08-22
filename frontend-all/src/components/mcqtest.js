import React, { useEffect, useReducer, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateQuizMcqs } from "../services/api";
import "../styles/mcqtest.css";
import { FaArrowLeft } from "react-icons/fa";

const initialState = {
  mcqs: [],
  loading: false,
  error: null,
  userAnswers: {},
  currentIdx: 0,
  submitted: false,
  score: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MCQS":
      return { ...state, mcqs: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_USER_ANSWERS":
      return { ...state, userAnswers: action.payload };
    case "SET_CURRENT_INDEX":
      return { ...state, currentIdx: action.payload };
    case "SET_SUBMITTED":
      return { ...state, submitted: action.payload };
    case "SET_SCORE":
      return { ...state, score: action.payload };
    case "RESTART":
      return {
        ...state,
        userAnswers: {},
        currentIdx: 0,
        submitted: false,
        score: 0,
      };
    default:
      throw new Error();
  }
}

const McqTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sourceText = location.state?.sourceText || "";

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    mcqs,
    loading,
    error,
    userAnswers,
    currentIdx,
    submitted,
    score,
  } = state;

  useEffect(() => {
    const autoStart = async () => {
      if (!sourceText) {
        dispatch({ type: "SET_ERROR", payload: "Source text not available to generate quiz." });
        return;
      }
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      try {
        const res = await generateQuizMcqs(sourceText, 5);
        const data = Array.isArray(res?.data) ? res.data : [];
        dispatch({ type: "SET_MCQS", payload: data });
        dispatch({ type: "RESTART" });
      } catch (err) {
        console.error("Generate MCQs error:", err);
        dispatch({ type: "SET_ERROR", payload: "Failed to generate quiz MCQs. Please try again." });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
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
    dispatch({ type: "SET_USER_ANSWERS", payload: { ...userAnswers, [questionNumber]: selectedLetter } });
  };

  const goNext = () => {
    if (currentIdx < mcqs.length - 1) {
      dispatch({ type: "SET_CURRENT_INDEX", payload: currentIdx + 1 });
      return;
    }
    let correct = 0;
    mcqs.forEach((item) => {
      if (userAnswers[item.question_number] === item.answer) correct += 1;
    });
    dispatch({ type: "SET_SCORE", payload: correct });
    dispatch({ type: "SET_SUBMITTED", payload: true });
  };

  const restart = () => {
    dispatch({ type: "RESTART" });
  };

  return (
    <div className="mcq-root">
      <div className="topbar">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
          <FaArrowLeft />
        </button>
        <h2>Final Test</h2>
        <span />
      </div>

      {loading && (
        <div className="loading-overlay">
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
                  const letter = String.fromCharCode(65 + i);
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
