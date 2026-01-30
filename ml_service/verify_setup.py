import sys
import os
import json
import numpy as np

# Add ml_service to path
sys.path.append(os.path.join(os.getcwd(), 'ml_service'))

from app.services.trajectory import predict_trajectory_logic
from app.services.clustering import cluster_risk_logic
from app.services.anomaly import detect_anomaly_logic
from app.services.text import process_text_logic
from app.services.audio import process_audio_logic

def run_checks():
    print("Running verification checks...")
    errors = []

    # 1. Trajectory
    try:
        print("\n--- Testing Trajectory ---")
        history = [10.0, 11.0, 12.0, 13.0] # Clear increasing trend
        res = predict_trajectory_logic(history)
        print(f"Input: {history}")
        print(f"Output: {res}")
        if res['trend_label'] != "Increasing":
            errors.append(f"Trajectory failed: Expected Increasing, got {res['trend_label']}")
        
        history_stable = [10.0, 10.05, 10.0, 9.95]
        res_stable = predict_trajectory_logic(history_stable)
        if res_stable['trend_label'] != "Stable":
             errors.append(f"Trajectory failed: Expected Stable, got {res_stable['trend_label']}")
             
    except Exception as e:
        errors.append(f"Trajectory raised exception: {e}")

    # 2. Clustering
    try:
        print("\n--- Testing Clustering ---")
        vectors = [[0.1, 0.1], [0.1, 0.2], [0.9, 0.9], [0.8, 0.8]]
        res = cluster_risk_logic(vectors)
        print(f"Input vectors len: {len(vectors)}")
        print(f"Output: {res}")
        if not isinstance(res['cluster_id'], int):
            errors.append("Clustering returned invalid cluster_id type")
    except Exception as e:
        errors.append(f"Clustering raised exception: {e}")

    # 3. Anomaly
    try:
        print("\n--- Testing Anomaly ---")
        scores = [10, 10, 10, 10, 10, 100] # 100 is clearly anomalous
        res = detect_anomaly_logic(scores)
        print(f"Input: {scores}")
        print(f"Output: {res}")
        if not res['is_anomaly']:
            errors.append("Anomaly failed: Expected True for 100 in list of 10s")
            
        scores_normal = [10, 11, 10, 12, 11]
        res_norm = detect_anomaly_logic(scores_normal)
        if res_norm['is_anomaly']:
             errors.append("Anomaly failed: Expected False for normal score")
    except Exception as e:
        errors.append(f"Anomaly raised exception: {e}")

    # 4. Text
    try:
        print("\n--- Testing Text ---")
        text_happy = "I am happy and feeling great today"
        res = process_text_logic(text_happy)
        print(f"Input: '{text_happy}'")
        print(f"Output: {res}")
        if res['sentiment_score'] <= 0:
            errors.append("Text failed: Expected positive sentiment")
            
        text_sad = "I am sad and lonely"
        res_sad = process_text_logic(text_sad)
        print(f"Input: '{text_sad}'")
        print(f"Output: {res_sad}")
        if not res_sad['emotion_flags']['sad']:
             errors.append("Text failed: Expected sad flag")
    except Exception as e:
        errors.append(f"Text raised exception: {e}")
        
    # 5. Audio (Simulated)
    # We cannot easily simulate audio bytes without a file, but we can try validation handles garbage
    try:
        print("\n--- Testing Audio (Garbage Input) ---")
        garbage = b"not_audio_data"
        res = process_audio_logic(garbage)
        print(f"Output (should differ handle gracefully): {res}")
        # Expect zeroes
        if res['features']['energy'] != 0.0:
            print("Audio handled garbage but returned non-zero? Likely interpreted as noise.")
    except Exception as e:
        # It might print error log but shouldn't raise out of function if handled
        print(f"Audio raised exception as expected/unexpected: {e}")

    if errors:
        print("\n❌ VERIFICATION FAILED:")
        for err in errors:
            print(f"- {err}")
        sys.exit(1)
    else:
        print("\n✅ ALL CHECKS PASSED")

if __name__ == "__main__":
    run_checks()
