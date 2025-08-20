import React, { useState } from "react";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/upload.css";

const Upload = () => {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [inputType, setInputType] = useState("file"); // 'file' or 'text'
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBack = () => navigate("/");

  const handleUpload = async () => {
    if ((inputType === "file" && !file) || (inputType === "text" && !text.trim())) {
      alert("Please provide a file or enter text!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let rawText = "";

      if (inputType === "file") {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post("http://localhost:5000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        rawText = uploadRes.data.text;
      } else {
        rawText = text;
      }

      const generateRes = await axios.post("http://localhost:5000/generate", { raw_text: rawText });
      const mcqs = generateRes.data;

      setUploaded(true);
      navigate("/preqna", { state: { mcqs, sourceText: rawText } });
    } catch (err) {
      console.error("Error during process:", err);
      setError("An error occurred during upload or MCQ generation.");
      alert("An error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => navigate("/learning");

  return (
    <div className="upload-container">
      <header className="upload-header">
        <button className="back-btn" onClick={handleBack} aria-label="Back">
          <FaArrowLeft />
        </button>
        <h2 className="upload-title">StudyBuddy</h2>
      </header>

      <div className="upload-card">
        <h3 className="card-heading">Upload Your Study Materials</h3>
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
            <div className="upload-box">
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
            ? "Uploading..."
            : uploaded
            ? "Next"
            : (
              <>
                <FaUpload style={{ marginRight: 6 }} aria-hidden="true" /> Upload
              </>
            )}
        </button>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default Upload;
