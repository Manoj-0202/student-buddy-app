
import React, { useReducer, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { transcribeAudio, analyzeText } from "../services/api";
import { FaArrowLeft } from "react-icons/fa";
import { FiMic, FiMicOff } from "react-icons/fi";
import "../styles/analysing.css";

const initialState = {
  studentText: "",
  isRecording: false,
  audioBlob: null,
  loading: false,
  error: null,
  analysisResult: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_STUDENT_TEXT":
      return { ...state, studentText: action.payload };
    case "SET_IS_RECORDING":
      return { ...state, isRecording: action.payload };
    case "SET_AUDIO_BLOB":
      return { ...state, audioBlob: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ANALYSIS_RESULT":
      return { ...state, analysisResult: action.payload };
    case "RESET_ANALYSIS":
      return {
        ...state,
        loading: false,
        error: null,
        analysisResult: null,
      };
    default:
      throw new Error();
  }
}

const Analyze = () => {
  const navigate = useNavigate();
  const { state: routeState } = useLocation();
  const sourceText = routeState?.sourceText || "";

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    studentText,
    isRecording,
    audioBlob,
    loading,
    error,
    analysisResult,
  } = state;

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data?.size) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        dispatch({ type: "SET_AUDIO_BLOB", payload: blob });
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      dispatch({ type: "SET_IS_RECORDING", payload: true });
      dispatch({ type: "RESET_ANALYSIS" });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: "Microphone permission blocked or unavailable." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      dispatch({ type: "SET_IS_RECORDING", payload: false });
    }
  };

  const transcribeAndAnalyze = async () => {
    if (!audioBlob) {
      dispatch({ type: "SET_ERROR", payload: "No audio recorded." });
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ANALYSIS" });

    try {
      const fd = new FormData();
      fd.append("audio_file", audioBlob, "recording.webm");
      const tr = await transcribeAudio(fd);
      const transcribed = tr?.data?.transcript || "";
      dispatch({ type: "SET_STUDENT_TEXT", payload: transcribed });
      await handleAnalyze(transcribed);
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: "Transcription failed." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleAnalyze = async (textArg) => {
    const text = (textArg ?? studentText ?? "").trim();
    if (!sourceText) return dispatch({ type: "SET_ERROR", payload: "Source text not available." });
    if (!text) return dispatch({ type: "SET_ERROR", payload: "Please speak or type your answer first." });

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ANALYSIS" });

    try {
      const res = await analyzeText(sourceText, text);

      console.log("Analyze response:", res.data);
      dispatch({ type: "SET_ANALYSIS_RESULT", payload: res.data || {} });
    } catch (err) {
      console.error(err);
      dispatch({ type: "SET_ERROR", payload: "Analysis failed." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const renderScore = (score) => {
    if (score === null || score === undefined || score === "") return "—";
    if (typeof score === "number") {
      const val = score <= 1 ? Math.round(score * 100) : Math.round(score);
      return `${val}%`;
    }
    return String(score);
  };

  const renderValue = (val, depth = 0) => {
    if (val === null || val === undefined) return <span className="an-kv-null">null</span>;
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      return <span className="an-kv-primitive">{String(val)}</span>;
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="an-kv-empty">[]</span>;
      return (
        <ul className="an-kv-list">
          {val.map((item, idx) => (
            <li key={idx}>{renderValue(item, depth + 1)}</li>
          ))}
        </ul>
      );
    }
    if (typeof val === "object") {
      const entries = Object.entries(val);
      if (!entries.length) return <span className="an-kv-empty">{{}}</span>;
      return (
        <div className="an-kv-object">
          {entries.map(([k, v]) => (
            <div className="an-kv-row" key={k}>
              <div className="an-kv-key">{k}</div>
              <div className="an-kv-val">{renderValue(v, depth + 1)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <span className="an-kv-primitive">{String(val)}</span>;
  };

  const topLevelKeys = useMemo(
    () => (analysisResult ? Object.keys(analysisResult) : []),
    [analysisResult]
  );

  return (
    <div className="an-root">
      <div className="an-top">
        <button className="an-back" onClick={() => navigate(-1)} aria-label="Back">
          <FaArrowLeft />
        </button>
        <h2>AI Analysis</h2>
      </div>

      <p className="an-sub">How well do you understand this text?</p>

      <div className="an-card an-input">
        <textarea
          value={studentText}
          onChange={(e) => dispatch({ type: "SET_STUDENT_TEXT", payload: e.target.value })}
          placeholder="Speak or type your understanding here…"
        />
      </div>

      <div className="an-row an-actions">
        <button
          className="an-btn an-btn-muted"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {isRecording ? <FiMicOff /> : <FiMic />}
          {isRecording ? "Stop" : "Speak"}
        </button>

        <button
          className="an-btn an-btn-accent"
          onClick={() => handleAnalyze()}
          disabled={loading || !studentText.trim()}
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {isRecording && (
        <div className="an-chip">
          <span className="an-pulse" />
          Listening…
        </div>
      )}

      {audioBlob && (
        <div className="an-audio">
          <audio src={URL.createObjectURL(audioBlob)} controls />
          <button className="an-btn an-btn-soft" onClick={transcribeAndAnalyze} disabled={loading}>
            {loading ? "Working…" : "Transcribe & Analyze Audio"}
          </button>
        </div>
      )}

      {error && <p className="an-error">{error}</p>}

      <h3 className="an-section">Analysis Results</h3>

      {analysisResult?.score !== undefined && (
        <div className="an-card an-score">
          <div className="an-score-label">Match Score</div>
          <div className="an-score-value">{renderScore(analysisResult.score)}</div>
        </div>
      )}

      {Array.isArray(analysisResult?.suggestions) &&
        analysisResult.suggestions.length > 0 && (
          <>
            <h3 className="an-section">Suggestions</h3>
            <div className="an-suggestions">
              {analysisResult.suggestions.map((s, i) => (
                <div className="an-suggestion" key={i}>
                  {s?.grade ? <div className="an-grade">{s.grade}</div> : <div />}
                  <div className="an-suggestion-body">
                    {s?.title && <div className="an-suggestion-title">{s.title}</div>}
                    {s?.note && <div className="an-suggestion-note">{s.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      {Array.isArray(analysisResult?.covered_points) &&
        analysisResult.covered_points.length > 0 && (
          <>
            <h3 className="an-section">Covered Points</h3>
            <div className="an-card">
              <ul className="an-list">
                {analysisResult.covered_points.map((p, idx) => (
                  <li key={idx}>
                    {p?.student_sentence && (
                      <>
                        <strong>Your:</strong> {p.student_sentence}
                        <br />
                      </>
                    )}
                    {p?.source_match && (
                      <>
                        <strong>Source:</strong> {p.source_match}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

      {Array.isArray(analysisResult?.missed_topics) &&
        analysisResult.missed_topics.length > 0 && (
          <>
            <h3 className="an-section">Missed Topics</h3>
            <div className="an-card">
              <ul className="an-list">
                {analysisResult.missed_topics.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </>
        )}

      {analysisResult?.feedback && (analysisResult.feedback.title || analysisResult.feedback.note) && (
        <>
          <h3 className="an-section">Feedback</h3>
          <div className="an-card an-feedback">
            <div className="an-feedback-icon">🎧</div>
            <div className="an-feedback-body">
              {analysisResult.feedback.title && (
                <div className="an-feedback-title">{analysisResult.feedback.title}</div>
              )}
              {analysisResult.feedback.note && (
                <div className="an-feedback-note">{analysisResult.feedback.note}</div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="an-bottom-row">
        <button className="an-btn an-btn-soft" onClick={() => navigate("/preqna")}>
          Previous
        </button>
        <button
          className="an-btn an-btn-accent"
          onClick={() => navigate("/mcqtest", { state: { sourceText } })}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Analyze;

