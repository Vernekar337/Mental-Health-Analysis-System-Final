from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import uuid
import numpy as np
import librosa
import joblib
from pydub import AudioSegment

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "emotion_model.pkl"
UPLOAD_DIR = BASE_DIR / "uploads" / "audio"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

model = joblib.load(MODEL_PATH)


def convert_to_wav(input_path: Path) -> Path:
    wav_path = input_path.with_suffix(".wav")
    audio = AudioSegment.from_file(str(input_path))
    audio.export(str(wav_path), format="wav")
    return wav_path


def extract_features(file_path: Path):
    if not file_path.exists():
        raise FileNotFoundError(f"Audio file not found: {file_path}")

    y_audio, sr = librosa.load(str(file_path), sr=22050, mono=True)

    mfcc = librosa.feature.mfcc(
        y=y_audio,
        sr=sr,
        n_mfcc=40
    )

    features = np.mean(mfcc.T, axis=0)
    return features.reshape(1, -1)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    ext = Path(file.filename).suffix.lower()
    if not ext:
        ext = ".webm"

    saved_name = f"{uuid.uuid4().hex}{ext}"
    raw_path = UPLOAD_DIR / saved_name

    try:
        with raw_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        audio_path = raw_path

        if raw_path.suffix.lower() == ".webm":
            audio_path = convert_to_wav(raw_path)

        features = extract_features(audio_path)

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

        return JSONResponse({
            "emotion": prediction,
            "confidence": float(probability),
            "mentalState": mental_state_map.get(prediction, "Unknown")
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {str(e)}")

    finally:
        try:
            if raw_path.exists():
                raw_path.unlink()
            wav_path = raw_path.with_suffix(".wav")
            if wav_path.exists():
                wav_path.unlink()
        except Exception:
            pass