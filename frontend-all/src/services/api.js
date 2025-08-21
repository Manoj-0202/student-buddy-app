import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // TODO: Move to environment variable

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateMcqs = (rawText) => {
  return api.post('/generate', { raw_text: rawText });
};

export const transcribeAudio = (audioBlob) => {
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'recording.webm');
  return api.post('/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const analyzeText = (sourceText, studentText) => {
  const formData = new FormData();
  formData.append('source_file', new Blob([sourceText], { type: 'text/plain' }), 'source.txt');
  formData.append('student_text', studentText);
  return api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateQuizMcqs = (rawText, numQuestions) => {
  return api.post('/generate_quiz_mcqs', { raw_text: rawText, num_questions: numQuestions });
};

export default api;
