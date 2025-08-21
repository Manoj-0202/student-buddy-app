import React, { useState } from "react";
import { FaArrowLeft, FaUpload, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { uploadFile, generateMcqs } from "../services/api";
import "../styles/upload.css";

const Upload = () => {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [inputType, setInputType] = useState("file"); // 'file' or 'text'
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedMcqs, setGeneratedMcqs] = useState(null);
  const [generatedSourceText, setGeneratedSourceText] = useState(null);

  const handleBack = () => navigate("/");

  const handleUpload = async () => {
    if ((inputType === "file" && !file) || (inputType === "text" && !text.trim())) {
      setError("Please provide a file or enter text!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let rawText = "";

      if (inputType === "file") {
        const uploadRes = await uploadFile(file);
        rawText = uploadRes.data.text;
      } else {
        rawText = text;
      }

      const generateRes = await generateMcqs(rawText);
      const mcqs = generateRes.data;

      setGeneratedMcqs(mcqs);
      setGeneratedSourceText(rawText);
      setUploaded(true);
    } catch (err) {
      console.error("Error during process:", err);
      setError("An error occurred during upload or MCQ generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (generatedMcqs && generatedSourceText) {
      navigate("/preqna", { state: { mcqs: generatedMcqs, sourceText: generatedSourceText } });
    } else {
      // This case should ideally not be reached if 'uploaded' is true
      setError("No generated content to proceed with.");
    }
  };

  return (
    <div className="upload-container">
      <header className="upload-header">
        <button className="back-btn" onClick={handleBack} aria-label="Back">
          <FaArrowLeft />
        </button>
        <h2 className="upload-title">StudyBuddy</h2>
      </header>

      <div className="upload-card">
        <h3 className="card-heading">Upload Your Study Materials or Enter Text </h3>
        <p className="card-sub">
          Enhance your learning experience by uploading your study materials
          or entering text directly for analysis and insights.
        </p>

        <div className="upload-tabs">
          <button
            className={inputType === "file" ? "active-tab" : ""}
            onClick={() => setInputType("file")}
            type="button"
          >
            Upload File
          </button>
          <button
            className={inputType === "text" ? "active-tab" : ""}
            onClick={() => setInputType("text")}
            type="button"
          >
            Enter Text
          </button>
        </div>

        {inputType === "file" && (
          <div className="upload-section">
            <div className={`upload-box ${file ? 'file-selected' : ''}`}>
              <FaUpload className="upload-icon" aria-hidden="true" />
              <p>{file ? file.name : "Drag & drop your file here"}</p>
              <span>or browse from your device</span>
              <input
                type="file"
                className="browse-input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt,.md,.rtf,.ppt,.pptx,.png,.jpg,.jpeg"
              />
            </div>
          </div>
        )}

        {inputType === "text" && (
          <div className="text-section">
            <textarea
              placeholder="Type or paste your study material here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        )}

        <button
          className={uploaded ? "next-btn" : "upload-btn"}
          onClick={uploaded ? handleNext : handleUpload}
          disabled={loading}
          type="button"
        >
          {loading
            ? (<><FaSpinner className="spinner" /> Uploading...</>)
            : uploaded
            ? "Next"
            : "Upload"}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default Upload;
