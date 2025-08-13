import re
import random
from ml_models import (
    load_question_generator,
    load_answer_extractor,
    generate_mcq
)

# Load models once at startup
question_model = load_question_generator()
answer_model = load_answer_extractor()


def generate_mcqs_from_text(raw_text, num_questions=5, excluded_questions=None):
    """
    Generate MCQs from raw text using the loaded models.
    """
    if excluded_questions is None:
        excluded_questions = []
    sentences = re.split(r'[.?!]\s*', raw_text)
    sentences = [s.strip() for s in sentences if 30 < len(s.strip()) < 500]
    random.shuffle(sentences)
    mcqs = []
    used_contexts = set()
    generated_questions = set()
    for context in sentences:
        if len(mcqs) >= num_questions:
            break
        if context in used_contexts:
            continue
        used_contexts.add(context)
        mcq = generate_mcq(question_model, answer_model, context)
        if mcq:
            question_text = mcq['question'].strip()
            if not question_text or question_text in generated_questions or question_text in excluded_questions:
                continue
            mcqs.append(mcq)
            generated_questions.add(question_text)
    final_mcqs = []
    for i, mcq in enumerate(mcqs):
        mcq_with_number = {
            'question_number': i + 1,
            'question': mcq['question'],
            'options': mcq['options'],
            'answer': mcq['answer']
        }
        final_mcqs.append(mcq_with_number)
    return final_mcqs
