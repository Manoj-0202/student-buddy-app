import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/analysing.css";

import { FaArrowLeft } from "react-icons/fa";

const Analyze = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sourceText = location.state?.sourceText || "";

  const [inputMode, setInputMode] = useState("audio"); // 'audio' or 'text'
  const [typedText, setTypedText] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- Audio Recording Functions ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript("");
      setError(null);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(
        "Could not access microphone. Please ensure it's connected and permissions are granted."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioForTranscription = async () => {
    if (!audioBlob) {
      setError("No audio recorded to send.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm");

    try {
      const response = await axios.post(
        "http://localhost:5000/transcribe",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const transcribedText = response.data.transcript;
      setTranscript(transcribedText);
      handleAnalyze(transcribedText);
    } catch (err) {
      console.error("Error transcribing audio:", err);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Analysis Function ---
  const handleAnalyze = async (studentText) => {
    if (!sourceText) {
      setError("Source text not available for analysis.");
      return;
    }
    if (!studentText.trim()) {
      setError("No student text provided for analysis.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    const sourceFileBlob = new Blob([sourceText], { type: "text/plain" });
    formData.append("source_file", sourceFileBlob, "source.txt");
    formData.append("student_text", studentText);

    try {
      const response = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysisResult(response.data);
    } catch (err) {
      console.error("Error analyzing text:", err);
      setError("Failed to analyze text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analyze-root">
      {/* Header */}
      <div className="header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2>AI Analysis</h2>
        <p>How well do you understand this text?</p>
      </div>

      {/* Input Mode Selection */}
      <div className="input-mode-btns">
        <button
          className={inputMode === "audio" ? "active" : ""}
          onClick={() => setInputMode("audio")}
        >
          Audio Input
        </button>
        <button
          className={inputMode === "text" ? "active" : ""}
          onClick={() => setInputMode("text")}
        >
          Text Input
        </button>
      </div>

      {/* Input Sections */}
      {inputMode === "audio" ? (
        <div className="audio-section">
          <div className="record-btns">
            <button onClick={startRecording} disabled={isRecording || loading}>
              {isRecording ? "Recording..." : "Start Recording"}
            </button>
            <button onClick={stopRecording} disabled={!isRecording || loading}>
              Stop Recording
            </button>
          </div>

          {audioBlob && (
            <div className="audio-preview">
              <audio src={URL.createObjectURL(audioBlob)} controls />
              <button onClick={sendAudioForTranscription} disabled={loading}>
                {loading ? "Transcribing & Analyzing..." : "Transcribe & Analyze Audio"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-section">
          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type your text here for analysis..."
          ></textarea>
          <button
            onClick={() => handleAnalyze(typedText)}
            disabled={loading || !typedText.trim()}
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {transcript && inputMode === "audio" && (
        <div className="transcript-box">
          <h3>Transcribed Text:</h3>
          <p>{transcript}</p>
        </div>
      )}

      {analysisResult && (
        <div className="analysis-box">
          <h3>Analysis Results:</h3>
          <p>
            <strong>Score:</strong> {analysisResult.score}
          </p>

          <h4>Covered Points:</h4>
          {analysisResult.covered_points && analysisResult.covered_points.length > 0 ? (
            <ul>
              {analysisResult.covered_points.map((point, idx) => (
                <li key={idx}>
                  <strong>Your Sentence:</strong> {point.student_sentence}
                  <br />
                  <strong>Matched Source:</strong> {point.source_match}
                </li>
              ))}
            </ul>
          ) : (
            <p>No points covered.</p>
          )}

          <h4>Missed Topics:</h4>
          {analysisResult.missed_topics && analysisResult.missed_topics.length > 0 ? (
            <ul>
              {analysisResult.missed_topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p>No missed topics.</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="nav-btns">
        <button onClick={() => navigate("/preqna")}>Previous</button>
        <button onClick={() => navigate("/mcqtest", { state: { sourceText } })}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Analyze;
