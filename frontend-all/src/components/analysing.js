import React, { useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { FiMic, FiMicOff } from "react-icons/fi";
import "../styles/analysing.css";

const Analyze = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const sourceText = state?.sourceText || "";

  // single source of truth (typed or spoken)
  const [studentText, setStudentText] = useState("");

  // audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ui/data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // ---- audio recording ----
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
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      setAnalysisResult(null);
    } catch (err) {
      console.error(err);
      setError("Microphone permission blocked or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAndAnalyze = async () => {
    if (!audioBlob) {
      setError("No audio recorded.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const fd = new FormData();
      fd.append("audio_file", audioBlob, "recording.webm");
      const tr = await axios.post("http://localhost:5000/transcribe", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const transcribed = tr?.data?.transcript || "";
      setStudentText(transcribed);
      await handleAnalyze(transcribed);
    } catch (err) {
      console.error(err);
      setError("Transcription failed.");
    } finally {
      setLoading(false);
    }
  };

  // ---- analyze ----
  const handleAnalyze = async (textArg) => {
    const text = (textArg ?? studentText ?? "").trim();
    if (!sourceText) return setError("Source text not available.");
    if (!text) return setError("Please speak or type your answer first.");

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const fd = new FormData();
      fd.append("source_file", new Blob([sourceText], { type: "text/plain" }), "source.txt");
      fd.append("student_text", text);

      const res = await axios.post("http://localhost:5000/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Analyze response:", res.data);
      setAnalysisResult(res.data || {});
    } catch (err) {
      console.error(err);
      setError("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // helper: normalize score display without inventing values
  const renderScore = (score) => {
    if (score === null || score === undefined || score === "") return "—";
    if (typeof score === "number") {
      const val = score <= 1 ? Math.round(score * 100) : Math.round(score);
      return `${val}%`;
    }
    return String(score);
  };

  // generic renderer so ALL API data is visible without hardcoding keys
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

  // memoize plain list of top-level keys (for quick visibility)
  const topLevelKeys = useMemo(
    () => (analysisResult ? Object.keys(analysisResult) : []),
    [analysisResult]
  );

  return (
    <div className="an-root">
      {/* top bar */}
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
          onChange={(e) => setStudentText(e.target.value)}
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

      {/* ===== RESULTS ===== */}
      <h3 className="an-section">Analysis Results</h3>

      {/* Score card */}
      {analysisResult?.score !== undefined && (
        <div className="an-card an-score">
          <div className="an-score-label">Match Score</div>
          <div className="an-score-value">{renderScore(analysisResult.score)}</div>
        </div>
      )}

      {/* Suggestions (only if backend returns analysisResult.suggestions) */}
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

      {/* Covered Points */}
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

      {/* Missed Topics */}
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

      {/* Feedback */}
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
