import numpy as np
from app.utils.logger import logger

# Constants
Z_SCORE_THRESHOLD = 2.5 # Standard deviation threshold

def detect_anomaly_logic(recent_scores: list[float]) -> dict:
    """
    Detects anomaly using Z-score method. 
    Checks if the LAST score is anomalous compared to the history of scores provided.
    """
    try:
        if len(recent_scores) < 3:
             # Not enough data to compute meaningful calc
             return { "is_anomaly": False, "deviation_metric": 0.0 }
             
        data = np.array(recent_scores)
        history = data[:-1]
        target = data[-1]
        
        mean = np.mean(history)
        std = np.std(history)
        
        if std == 0:
            deviation = 0.0 if target == mean else float('inf') # Or large number
        else:
            deviation = abs(target - mean) / std
            
        is_anomaly = deviation > Z_SCORE_THRESHOLD
        
        logger.info(f"Anomaly check: score={target}, mean={mean:.2f}, std={std:.2f}, z={deviation:.2f}, anomaly={is_anomaly}")
        
        return {
            "is_anomaly": is_anomaly,
            "deviation_metric": float(deviation)
        }
        
    except Exception as e:
        logger.error(f"Error in anomaly detection: {str(e)}")
        raise e
