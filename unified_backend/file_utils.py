import os
import PyPDF2

def extract_text_from_file(file_storage):
    """
    Extracts text from a .pdf or .txt file uploaded via Flask's request.files.
    Returns the extracted text as a string.
    """
    filename = file_storage.filename.lower()
    if filename.endswith('.txt'):
        text = file_storage.read().decode('utf-8')
        print(f"[Backend] Extracted text from TXT: {text[:100]}...") # Log extracted text
        return text
    elif filename.endswith('.pdf'):
        # Save to a temporary file
        temp_path = 'temp_uploaded.pdf'
        file_storage.save(temp_path)
        text = ''
        try:
            with open(temp_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() or ''
            print(f"[Backend] Extracted text from PDF: {text[:100]}...") # Log extracted text
        finally:
            os.remove(temp_path)
        return text
    else:
        raise ValueError('Unsupported file type. Only .pdf and .txt are allowed.')
