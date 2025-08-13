import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Transcript = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sourceText = location.state?.sourceText || '';

  const [inputMode, setInputMode] = useState('audio'); // 'audio' or 'text'
  const [typedText, setTypedText] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');

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
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
      setError(null);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please ensure it's connected and permissions are granted.");
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
    formData.append('audio_file', audioBlob, 'recording.webm');

    try {
      const response = await axios.post('http://localhost:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const transcribedText = response.data.transcript;
      setTranscript(transcribedText);
      // After transcription, send for analysis
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
    // Create a Blob from sourceText to simulate a file upload
    const sourceFileBlob = new Blob([sourceText], { type: 'text/plain' });
    formData.append('source_file', sourceFileBlob, 'source.txt');
    formData.append('student_text', studentText);

    try {
      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', textAlign: 'center' }}>
      <h2>Analysis Page</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setInputMode('audio')}
          style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: inputMode === 'audio' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Audio Input
        </button>
        <button
          onClick={() => setInputMode('text')}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: inputMode === 'text' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Text Input
        </button>
      </div>

      {inputMode === 'audio' ? (
        // Audio Input Section
        <>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={startRecording}
              disabled={isRecording || loading}
              style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
              {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording || loading}
              style={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Stop Recording
            </button>
          </div>

          {audioBlob && (
            <div style={{ marginBottom: '20px' }}>
              <audio src={URL.createObjectURL(audioBlob)} controls style={{ width: '100%' }} />
              <button
                onClick={sendAudioForTranscription}
                disabled={loading}
                style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
              >
                {loading ? 'Transcribing & Analyzing...' : 'Transcribe & Analyze Audio'}
              </button>
            </div>
          )}
        </>
      ) : (
        // Text Input Section
        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type your text here for analysis..."
            rows="10"
            style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }}
          ></textarea>
          <button
            onClick={() => handleAnalyze(typedText)}
            disabled={loading || !typedText.trim()}
            style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
          >
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {transcript && inputMode === 'audio' && (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px', textAlign: 'left', backgroundColor: '#f0f0f0' }}>
          <h3>Transcribed Text:</h3>
          <p>{transcript}</p>
        </div>
      )}

      {analysisResult && (
        <div style={{ border: '1px solid #28a745', padding: '15px', marginTop: '20px', textAlign: 'left', backgroundColor: '#e6ffe6' }}>
          <h3>Analysis Results:</h3>
          <p><strong>Score:</strong> {analysisResult.score}</p>
          
          <h4>Covered Points:</h4>
          {analysisResult.covered_points && analysisResult.covered_points.length > 0 ? (
            <ul>
              {analysisResult.covered_points.map((point, index) => (
                <li key={index}>
                  <strong>Your Sentence:</strong> {point.student_sentence}<br/>
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
              {analysisResult.missed_topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p>No missed topics.</p>
          )}
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/preqna')} style={{ marginRight: '10px' }}>Previous</button>
        <button className="btn btn-primary" onClick={() => navigate('/mcqtest', { state: { sourceText: sourceText } })}>Next</button>
      </div>
    </div>
  );
};

export default Transcript;