import torch
from sentence_transformers import SentenceTransformer, util
from nltk.tokenize import sent_tokenize, word_tokenize

def analyze_with_advanced_sentiment_v3_5(source_text, student_text, similarity_threshold=0.45):
    """
    Analyzes the student's text against the source text using semantic similarity and sentiment (negation) checks.
    Returns: (score, covered_points, missed_topics)
    """
    model_semantic = SentenceTransformer('all-mpnet-base-v2')
    source_sentences = sent_tokenize(source_text)
    student_sentences = sent_tokenize(student_text)
    if not source_sentences or not student_sentences:
        return 0, [], source_sentences
    source_embeddings = model_semantic.encode(source_sentences, convert_to_tensor=True)
    student_embeddings = model_semantic.encode(student_sentences, convert_to_tensor=True)
    cosine_scores = util.cos_sim(student_embeddings, source_embeddings)
    covered_points = []
    source_sentence_covered_flags = [False] * len(source_sentences)
    NEGATION_WORDS = {'no', 'not', 'none', 'cannot', "n't", 'without', 'never'}
    NEGATIVE_PREFIXES = ('non-', 'un-', 'in-', 'im-', 'ir-', 'il-', 'dis-')
    def count_negations(sentence):
        count = 0
        tokens = [word.lower() for word in word_tokenize(sentence)]
        for token in tokens:
            if token in NEGATION_WORDS:
                count += 1
            if token.startswith(NEGATIVE_PREFIXES) and len(token) > 4:
                count += 1
        return count
    for i in range(len(student_sentences)):
        student_sentence = student_sentences[i]
        max_score, max_idx = torch.max(cosine_scores[i], dim=0)
        if max_score.item() > similarity_threshold:
            source_sentence = source_sentences[max_idx.item()]
            student_negations = count_negations(student_sentence)
            source_negations = count_negations(source_sentence)
            if (student_negations % 2) == (source_negations % 2):
                covered_points.append({
                    "student_sentence": student_sentence, "source_match": source_sentence,
                    "score": max_score.item(), "type": "Direct Match"
                })
                source_sentence_covered_flags[max_idx.item()] = True
    missed_topics = [s for i, s in enumerate(source_sentences) if not source_sentence_covered_flags[i]]
    total_possible_score = sum(len(s.split()) for s in source_sentences)
    covered_source_matches = {point['source_match'] for point in covered_points}
    earned_score = sum(len(s.split()) for s in covered_source_matches)
    coverage_score = (earned_score / total_possible_score) * 100 if total_possible_score > 0 else 0
    sorted_covered_points = sorted(covered_points, key=lambda x: student_sentences.index(x['student_sentence']))
    unique_covered_points = []
    used_student_sentences = set()
    for point in sorted_covered_points:
        if point['student_sentence'] not in used_student_sentences:
            unique_covered_points.append(point)
            used_student_sentences.add(point['student_sentence'])
    return coverage_score, unique_covered_points, missed_topics
