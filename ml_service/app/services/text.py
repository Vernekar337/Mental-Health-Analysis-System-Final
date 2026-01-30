from app.utils.logger import logger

# Simple Sentiment Lexicon (Minimalist for demonstration & 'Classical ML' requirement compliance without external libs)
POSITIVE_WORDS = {
    "happy", "good", "great", "excellent", "joy", "love", "wonderful", "excited", "calm", "peaceful", "positive",
    "better", "best", "hope", "optimistic", "satisfied", "content", "delighted"
}

NEGATIVE_WORDS = {
    "sad", "bad", "terrible", "awful", "hate", "angry", "anxious", "nervous", "depressed", "upset", "pain",
    "worry", "fear", "scared", "worthless", "tired", "hopeless", "lonely", "stress", "stressed"
}

ANXIOUS_WORDS = {
    "anxious", "nervous", "worry", "fear", "scared", "stress", "stressed", "panic", "tense", "uneasy"
}

SAD_WORDS = {
    "sad", "depressed", "lonely", "hopeless", "crying", "grief", "gloomy", "melancholy", "down"
}

def process_text_logic(text: str) -> dict:
    """
    Analyzes text sentiment and emotion flags using a rule-based word count approach.
    Deterministic and stateless.
    """
    try:
        text_lower = text.lower()
        words = text_lower.split()
        
        pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
        neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)
        
        total_matched = pos_count + neg_count
        
        # Simple sentiment score: (pos - neg) / total_matched (normalized -1 to 1)
        # If no matches, 0.0
        if total_matched > 0:
            sentiment_score = (pos_count - neg_count) / total_matched
        else:
            sentiment_score = 0.0
            
        # Emotion flags
        anxious_count = sum(1 for w in words if w in ANXIOUS_WORDS)
        sad_count = sum(1 for w in words if w in SAD_WORDS)
        
        is_anxious = anxious_count > 0
        is_sad = sad_count > 0
        is_neutral = (not is_anxious) and (not is_sad) and (sentiment_score == 0.0) # Simplification
        
        logger.info(f"Text analysis: score={sentiment_score:.2f}, sad={is_sad}, anxious={is_anxious}")

        return {
            "sentiment_score": float(sentiment_score),
            "emotion_flags": {
                "sad": is_sad,
                "anxious": is_anxious,
                "neutral": is_neutral
            }
        }
    except Exception as e:
        logger.error(f"Error in text processing: {str(e)}")
        # Fail safe
        return {
            "sentiment_score": 0.0,
            "emotion_flags": {
                "sad": False,
                "anxious": False,
                "neutral": True
            }
        }
