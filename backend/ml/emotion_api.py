from fastapi import FastAPI
import librosa
import numpy as np
import joblib

app = FastAPI()

model = joblib.load("emotion_model.pkl")


def extract_features(file_path):

    y_audio, sr = librosa.load(file_path, sr=22050)

    mfcc = librosa.feature.mfcc(
        y=y_audio,
        sr=sr,
        n_mfcc=40
    )

    features = np.mean(mfcc.T, axis=0)

    return features.reshape(1, -1)


@app.post("/predict")
def predict(data: dict):

    file_path = data["filePath"]

    features = extract_features(file_path)

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features).max()

    mental_state_map = {
        "happy": "Positive",
        "calm": "Stable",
        "neutral": "Stable",
        "sad": "Low Mood",
        "angry": "High Stress",
        "fear": "Anxiety",
        "disgust": "Distress",
        "surprise": "Alert"
    }

    return {
        "emotion": prediction,
        "confidence": float(probability),
        "mentalState": mental_state_map.get(prediction, "Unknown")
    }