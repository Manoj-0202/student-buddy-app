import React, { useState } from "react";
import "../styles/chemistry-upload.css";
import { useNavigate } from "react-router-dom";

const ChemistryUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload a TXT or PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("num_questions", questionCount);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to /chemistry-test with generated Q&A data
        navigate("/chemistry-test", { state: { qnaPairs: data } });
      } else {
        const errorData = await response.json();
        console.error("Backend Error:", errorData);
        alert(`Error: ${errorData.error || "Unknown backend error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chemistry-bg">
      <div className="upload-container">
        <h1 className="page-title">Upload Your Chemistry Notes</h1>
        <p className="page-subtitle">
          Ready to challenge yourself? Upload a <strong>PDF</strong> or <strong>TXT</strong> file and choose how many questions to generate.
        </p>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label className="upload-label">
            Select Your Questions File (.txt or .pdf)
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </label>

          <div className="question-select-section">
            <label className="question-label">Choose Number of Questions:</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="question-select"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={30}>30 Questions</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Generating..." : "Take your Test"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChemistryUpload;
