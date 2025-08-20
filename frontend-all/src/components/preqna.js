import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import icon
import "../styles/preqna.css";

const getLetter = (index) => String.fromCharCode(65 + index);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const resolveCorrectLetter = (q) => {
  if (!q || !Array.isArray(q.options)) return "A";
  const options = q.options;

  const pickByIndex = (idxLike) => {
    if (typeof idxLike !== "number" || Number.isNaN(idxLike)) return null;
    let idx = idxLike >= 1 && idxLike <= options.length ? idxLike - 1 : idxLike;
    idx = clamp(idx, 0, options.length - 1);
    return getLetter(idx);
  };

  const fields = [
    q.answer,
    q.correctAnswer,
    q.correct,
    q.answerLetter,
  ].filter((v) => v !== undefined && v !== null);

  for (const val of fields) {
    if (typeof val === "string") {
      const s = val.trim();
      const upper = s.toUpperCase();
      if (/^[A-Z]$/.test(upper)) {
        const idx = upper.charCodeAt(0) - 65;
        if (idx >= 0 && idx < options.length) return upper;
      }
      const foundIdx = options.findIndex(
        (o) => String(o).trim().toLowerCase() === s.toLowerCase()
      );
      if (foundIdx !== -1) return getLetter(foundIdx);
    }
  }

  const numeric =
    q.answerIndex ?? q.correctIndex ?? q.correctOptionIndex ?? null;
  const letterByIndex = pickByIndex(numeric);
  if (letterByIndex) return letterByIndex;

  return "A";
};

const PreQnA = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mcqs = location.state?.mcqs || [];
  const sourceText = location.state?.sourceText || "";

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  const question = useMemo(() => mcqs[currentQ] || {}, [mcqs, currentQ]);

  useEffect(() => {
    setSelectedOption(resolveCorrectLetter(question));
  }, [question]);

  if (mcqs.length === 0) {
    return (
      <div className="preqna-page">
        <div className="preqna-header">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <h3 className="pretest-title">Pre–Test</h3>
          <div></div>
        </div>
        <div className="preqna-empty">
          <h2>No MCQs available</h2>
          <p>Please go back and generate MCQs from a file.</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentQ < mcqs.length - 1) {
      setCurrentQ((n) => n + 1);
    } else {
      navigate("/analysing", { state: { sourceText } });
    }
  };

  return (
    <div className="preqna-page">
      <div className="preqna-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <h3 className="pretest-title">Pre-Test</h3>
        <div></div>
      </div>

      <div className="preqna-card">
        <div className="progress-section">
          <span>
            Question {currentQ + 1} of {mcqs.length}
          </span>
          <div className="progress-bar">
            <div
              className="progress-filled"
              style={{ width: `${((currentQ + 1) / mcqs.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-section">
          <h4>{question?.question || ""}</h4>

          <ul className="options-list">
            {(question?.options || []).map((option, i) => {
              const optionLetter = getLetter(i);
              const isSelected = selectedOption === optionLetter;
              return (
                <li
                  key={i}
                  className={isSelected ? "selected" : ""}
                  onClick={() => setSelectedOption(optionLetter)}
                >
                  <span className="radio-btn">
                    {isSelected && <span className="inner-circle" />}
                  </span>
                  <span className="option-text">{option}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <button className="next-btn" onClick={handleNext}>
          {currentQ === mcqs.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default PreQnA;
