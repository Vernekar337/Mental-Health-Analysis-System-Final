from pydantic import BaseModel, Field, validator
from typing import List, Optional

# --- Shared / Utilities ---

# --- Trajectory ---
class TrajectoryInput(BaseModel):
    mh_history: List[float] = Field(..., description="List of historical mental health scores", min_items=2)

    @validator('mh_history')
    def check_inputs_not_empty(cls, v):
        if not v:
            raise ValueError("History cannot be empty")
        return v

class TrajectoryOutput(BaseModel):
    predicted_mh_index: float
    trend_label: str = Field(..., description="Increasing | Stable | Decreasing")

# --- Clustering ---
class ClusterInput(BaseModel):
    feature_vectors: List[List[float]] = Field(..., description="List of feature vectors for clustering", min_items=1)
    
    @validator('feature_vectors')
    def check_vectors(cls, v):
        if not v:
            raise ValueError("Feature vectors cannot be empty")
        # Ensure all vectors have same length
        first_len = len(v[0])
        if any(len(vec) != first_len for vec in v):
            raise ValueError("All feature vectors must have the same dimension")
        return v

class ClusterOutput(BaseModel):
    cluster_id: int
    cluster_explanation: str

# --- Anomaly ---
class AnomalyInput(BaseModel):
    recent_scores: List[float] = Field(..., description="List of recent scores to check for anomalies", min_items=1)

class AnomalyOutput(BaseModel):
    is_anomaly: bool
    deviation_metric: float

# --- Audio ---
# Input is multipart/form-data, so not defined as a Pydantic model for the body,
# but the output structure is needed.

class AudioFeatures(BaseModel):
    pitch_mean: float
    pitch_variance: float
    energy: float
    pause_ratio: float

class AudioIndicators(BaseModel):
    low_energy: bool
    high_pitch_variability: bool
    reduced_speech_rate: bool

class AudioOutput(BaseModel):
    features: AudioFeatures
    indicators: AudioIndicators

# --- Text ---
class TextInput(BaseModel):
    text: str = Field(..., description="Text input for analysis", min_length=1)

class EmotionFlags(BaseModel):
    sad: bool
    anxious: bool
    neutral: bool

class TextOutput(BaseModel):
    sentiment_score: float
    emotion_flags: EmotionFlags
