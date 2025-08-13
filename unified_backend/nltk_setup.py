# ===================================================================
# --- Automated NLTK Data Downloader for Unified Backend ---
# ===================================================================
# This module ensures all required NLTK data is downloaded at backend startup.
# It replaces the need to run download_nltk.py manually.
# ===================================================================
import nltk

def ensure_nltk_data():
    print("--- Ensuring all required NLTK resources are downloaded ---")
    try:
        # Download the comprehensive 'book' collection
        nltk.download('book')
        # Redundant/critical packages for safety
        nltk.download('punkt_tab')
        nltk.download('averaged_perceptron_tagger_eng')
        nltk.download('punkt')
        nltk.download('wordnet')
        nltk.download('omw-1.4')
        print("--- All NLTK resources are present. ---")
    except Exception as e:
        print(f"Error downloading NLTK data: {e}")

# Call this at backend startup
ensure_nltk_data()
