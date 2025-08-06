
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/chemistry-upload.css';

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
      alert('Please select a file.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('num_questions', questionCount);

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/chemistry-test', { state: { qnaPairs: data } });
      } else {
        const errorData = await response.json();
        console.error('Backend Error:', errorData);
        alert(`Error: ${errorData.error || 'Unknown backend error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred while uploading. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card upload-card p-4 shadow-sm">
              <div className="card-body">
                <h1 className="card-title text-center mb-2">Create a Test</h1>
                <p className="text-center text-muted mb-4">Upload your notes (PDF or TXT) and let generate custom MCQ's for you!</p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="file-upload" className="form-label">Upload Your Notes</label>
                    <input type="file" className="form-control form-control-lg" id="file-upload" accept=".txt,.pdf" onChange={handleFileChange} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="question-count" className="form-label">Number of Questions</label>
                    <select className="form-select form-select-lg" id="question-count" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                    </select>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? 'Generating Quiz...' : 'Generate Quiz'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistryUpload;

