from fastapi import FastAPI, HTTPException, UploadFile, File
from app.schemas.api_models import (
    TrajectoryInput, TrajectoryOutput,
    ClusterInput, ClusterOutput,
    AnomalyInput, AnomalyOutput,
    TextInput, TextOutput,
    AudioOutput
)
from app.services import trajectory, clustering, anomaly, audio, text
from app.utils.logger import logger
import uvicorn
import os

app = FastAPI(title="Mental Health ML Microservice", version="1.0.0")

@app.post("/predict_trajectory", response_model=TrajectoryOutput)
async def predict_trajectory_endpoint(data: TrajectoryInput):
    """
    Predicts mental health trajectory based on history.
    """
    try:
        logger.info(f"Received trajectory request with {len(data.mh_history)} history points.")
        result = trajectory.predict_trajectory_logic(data.mh_history)
        return result
    except Exception as e:
        logger.error(f"Error in /predict_trajectory: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/cluster_risk", response_model=ClusterOutput)
async def cluster_risk_endpoint(data: ClusterInput):
    """
    Clusters the provided feature vectors and returns the cluster ID for the last vector.
    """
    try:
        logger.info(f"Received cluster request with {len(data.feature_vectors)} vectors.")
        result = clustering.cluster_risk_logic(data.feature_vectors)
        return result
    except Exception as e:
        logger.error(f"Error in /cluster_risk: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/detect_anomaly", response_model=AnomalyOutput)
async def detect_anomaly_endpoint(data: AnomalyInput):
    """
    Detects if the most recent score is an anomaly.
    """
    try:
        logger.info(f"Received anomaly request with {len(data.recent_scores)} scores.")
        result = anomaly.detect_anomaly_logic(data.recent_scores)
        return result
    except Exception as e:
        logger.error(f"Error in /detect_anomaly: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/process_audio", response_model=AudioOutput)
async def process_audio_endpoint(file: UploadFile = File(...)):
    """
    Processes audio file to extract features. 
    Strictly features only, no diagnosis.
    """
    try:
        logger.info(f"Received audio file: {file.filename}")
        contents = await file.read()
        if not contents:
             raise ValueError("Empty file")
        
        result = audio.process_audio_logic(contents)
        return result
    except Exception as e:
        logger.error(f"Error in /process_audio: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/process_text", response_model=TextOutput)
async def process_text_endpoint(data: TextInput):
    """
    Analyzes text sentiment.
    """
    try:
        logger.info("Received text analysis request.")
        result = text.process_text_logic(data.text)
        return result
    except Exception as e:
        logger.error(f"Error in /process_text: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
