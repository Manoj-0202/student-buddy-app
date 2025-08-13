import nltk_setup  # Ensures NLTK data is downloaded at startup
from flask import Flask, request, jsonify
from flask_cors import CORS
from file_utils import extract_text_from_file
from mcq_utils import generate_mcqs_from_text
from transcribe_utils import transcribe_audio_file
from analysis_utils import analyze_with_advanced_sentiment_v3_5

app = Flask(__name__)

# ✅ CORS configuration to allow React frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# 1. File Upload: Accepts .pdf or .txt, extracts text
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    try:
        text = extract_text_from_file(file)
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 2. MCQ Generation
@app.route('/generate', methods=['POST'])
def generate_mcqs_endpoint():
    data = request.get_json()
    raw_text = data.get('raw_text')
    num_questions = int(data.get('num_questions', 5))
    if not raw_text:
        return jsonify({'error': 'No text provided'}), 400
    mcqs = generate_mcqs_from_text(raw_text, num_questions)
    return jsonify(mcqs)

# 3. Audio Transcription
@app.route('/transcribe', methods=['POST'])
def transcribe_audio_endpoint():
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No audio file found'}), 400
    audio_file = request.files['audio_file']
    try:
        transcript = transcribe_audio_file(audio_file)
        return jsonify({'transcript': transcript})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 4. Analysis
@app.route('/analyze', methods=['POST'])
def analyze_endpoint():
    if 'source_file' not in request.files or 'student_text' not in request.form:
        return jsonify({'error': 'Missing file or student text'}), 400
    file = request.files['source_file']
    student_text = request.form['student_text']
    if file.filename == '' or not student_text.strip():
        return jsonify({'error': 'Missing file or student text'}), 400
    try:
        source_text = extract_text_from_file(file)
        if not source_text.strip():
            return jsonify({'error': 'Could not extract text from the file.'}), 400
        score, covered, missing = analyze_with_advanced_sentiment_v3_5(source_text, student_text)
        return jsonify({
            'score': round(score),
            'covered_points': covered,
            'missed_topics': missing,
            'source_text': source_text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 5. Quiz/Test Generation
@app.route('/generate_quiz_mcqs', methods=['POST'])
def generate_quiz_mcqs_endpoint():
    data = request.get_json()
    raw_text = data.get('raw_text')
    num_questions = int(data.get('num_questions', 5))
    excluded_questions = data.get('excluded_questions', [])
    if not raw_text:
        return jsonify({'error': 'No text provided'}), 400
    mcqs = generate_mcqs_from_text(raw_text, num_questions, excluded_questions)
    return jsonify(mcqs)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
