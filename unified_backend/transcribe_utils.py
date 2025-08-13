import whisper
import tempfile
import os

# Load Whisper ASR model once
model_asr = whisper.load_model("small")

def transcribe_audio_file(audio_file):
    """
    Transcribes an uploaded audio file using Whisper and returns the transcript.
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        temp_path = temp_audio.name
        audio_file.save(temp_path)
    try:
        result = model_asr.transcribe(temp_path)
        transcribed_text = result['text']
        print(f"[Backend] Transcription successful: {transcribed_text[:50]}...")
        return transcribed_text
    except Exception as e:
        print(f"[Backend Error] Error during transcription: {e}")
        raise # Re-raise the exception to be caught by Flask
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
