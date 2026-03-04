from fastapi import FastAPI
import librosa
import numpy as np

app = FastAPI()

@app.post("/predict-audio")
async def predict_audio(data: dict):

    audio_path = data["audioPath"]

    y, sr = librosa.load(audio_path)

    energy = np.mean(librosa.feature.rms(y=y))

    if energy < 0.02:
        emotion = "sad"
    elif energy < 0.04:
        emotion = "calm"
    else:
        emotion = "stressed"

    confidence = float(np.random.uniform(0.7,0.9))

    return {
        "emotion": emotion,
        "confidence": confidence
    }