import os
import librosa
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier

DATASET_PATH = r"C:\Users\Sahil.s.Vernekar\OneDrive\Documents\MERN+ML Projects\Mental-Health-Analysis-System\backend\ml\dataset"

X = []
y = []

# RAVDESS emotion mapping
emotion_map = {
    "01": "neutral",
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fear",
    "07": "disgust",
    "08": "surprise"
}


def extract_features(file_path):

    y_audio, sr = librosa.load(file_path, sr=22050)

    mfcc = librosa.feature.mfcc(
        y=y_audio,
        sr=sr,
        n_mfcc=40
    )

    features = np.mean(mfcc.T, axis=0)

    return features


print("Scanning dataset...")

for actor in os.listdir(DATASET_PATH):

    actor_path = os.path.join(DATASET_PATH, actor)

    if not os.path.isdir(actor_path):
        continue

    for file in os.listdir(actor_path):

        if not file.endswith(".wav"):
            continue

        file_path = os.path.join(actor_path, file)

        parts = file.split("-")

        emotion_code = parts[2]

        emotion = emotion_map.get(emotion_code)

        if emotion is None:
            continue

        try:

            features = extract_features(file_path)

            X.append(features)

            y.append(emotion)

        except Exception as e:

            print("Skipping:", file, e)


X = np.array(X)
y = np.array(y)

print("Dataset size:", X.shape)

print("Training model...")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10
)

model.fit(X, y)

joblib.dump(model, "emotion_model.pkl")

print("Model saved as emotion_model.pkl")