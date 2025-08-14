import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaBookOpen, FaRobot, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/context.css";

const Context = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { icon: <FaUpload />, title: "Upload Context File", desc: "Start by uploading your file to begin." },
    { icon: <FaBookOpen />, title: "Read Pre-Generated Q&A", desc: "Go through the provided questions and answers." },
    { icon: <FaRobot />, title: "Revise with AI", desc: "Improve your understanding with AI assistance." },
    { icon: <FaQuestionCircle />, title: "Take MCQ Test", desc: "Test yourself with multiple-choice questions." },
  ];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Step 1: Upload file and extract text
      // const uploadRes = await axios.post("http://localhost:5000/upload", formData, {
      const uploadRes = await axios.post("http://api.local/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const rawText = uploadRes.data.text;
      console.log("File uploaded successfully! Extracted text:", rawText);

      // Step 2: Generate MCQs from the extracted text
      // const generateRes = await axios.post('http://localhost:5000/generate', { raw_text: rawText });
      const generateRes = await axios.post('http://api.local/generate', { raw_text: rawText });
      const mcqs = generateRes.data;
      console.log("MCQs generated successfully:", mcqs);

      // Step 3: Navigate to PreQnA page with generated MCQs
      navigate('/preqna', { state: { mcqs: mcqs, sourceText: rawText } });

    } catch (err) {
      console.error("Error during process:", err);
      setError("An error occurred during file upload or MCQ generation. Please try again.");
      alert("An error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workflow-container">
      <h3 className="workflow-title">Learning Workflow</h3>

      {/* Workflow steps */}
      <div className="workflow-steps">
        {steps.map((step, index) => (
          <div className="workflow-step" key={index}>
            <div className="workflow-icon">{step.icon}</div>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload section */}
      <div className="upload-section">
        <p className="upload-instruction">
          To begin, upload the <strong>.txt</strong> or <strong>.pdf</strong> file containing the context you want to learn.
        </p>
        <input
          type="file"
          accept=".txt,.pdf"
          className="form-control"
          onChange={handleFileChange}
        />
        <button className="btn upload-btn" onClick={handleUpload} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="btn-icon" /> Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Context;
