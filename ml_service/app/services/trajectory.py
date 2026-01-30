import numpy as np
from sklearn.linear_model import LinearRegression
from app.utils.logger import logger

# Constants
MIN_HISTORY_FOR_PREDICTION = 2

def predict_trajectory_logic(history: list[float]) -> dict:
    """
    Fits a linear regression model to the mental health history scores.
    Returns the predicted next index score and a qualitative trend label.
    """
    try:
        n_samples = len(history)
        if n_samples < MIN_HISTORY_FOR_PREDICTION:
            # Fallback for insufficient data, though schema validation should catch < 2
            logger.warning("Insufficient history for trajectory prediction.")
            return {
                "predicted_mh_index": history[-1] if history else 0.0,
                "trend_label": "Stable"
            }

        # X is time steps [0, 1, ... n-1]
        X = np.arange(n_samples).reshape(-1, 1)
        y = np.array(history)

        model = LinearRegression()
        model.fit(X, y)

        # Predict next step (n)
        next_step = np.array([[n_samples]])
        prediction = model.predict(next_step)[0]

        # Determine trend
        slope = model.coef_[0]
        
        # Thresholds for trend labeling - defined here for explainability
        STABLE_THRESHOLD = 0.05 

        if slope > STABLE_THRESHOLD:
            trend = "Increasing"
        elif slope < -STABLE_THRESHOLD:
            trend = "Decreasing"
        else:
            trend = "Stable"

        logger.info(f"Trajectory prediction: history_len={n_samples}, slope={slope:.4f}, trend={trend}")
        
        return {
            "predicted_mh_index": float(prediction),
            "trend_label": trend
        }

    except Exception as e:
        logger.error(f"Error in trajectory prediction: {str(e)}")
        # In a real service we might raise HTTP exception, but here we return safe default or re-raise
        # The caller (router) should handle exceptions if needed.
        # But per requirements "Never throw unhandled exceptions", we should handle typically in the router.
        # However, for pure logic function, raising is okay if caught upstream.
        # I will re-raise to catch in the endpoint.
        raise e
