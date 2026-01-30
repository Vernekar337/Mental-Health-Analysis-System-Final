import librosa
import numpy as np
import io
from app.utils.logger import logger

# Constants
SR = 22050 # Sample rate

def process_audio_logic(file_bytes: bytes) -> dict:
    """
    Extracts audio features: pitch_mean, pitch_variance, energy, pause_ratio.
    Returns calculated features and simple boolean indicators.
    NO diagnosis.
    """
    try:
        # Load audio from bytes
        # librosa.load expects a file path or file-like object
        y, sr = librosa.load(io.BytesIO(file_bytes), sr=SR)
        
        # 1. Energy (RMS)
        rms = librosa.feature.rms(y=y)
        energy = float(np.mean(rms))
        
        # 2. Pitch (F0) using piptrack or pyin
        # pyin is robust but slower. piptrack is faster. Use piptrack for lightweight.
        # Or simple zero crossing rate? Feature request says "pitch".
        # Let's use librosa.yin or pyin if available, or piptrack. 
        # For simplicity and speed:
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        # Filter NaNs
        valid_f0 = f0[~np.isnan(f0)]
        
        if len(valid_f0) > 0:
            pitch_mean = float(np.mean(valid_f0))
            pitch_variance = float(np.var(valid_f0))
        else:
            pitch_mean = 0.0
            pitch_variance = 0.0
            
        # 3. Pause Ratio
        # Simple heuristic: Silence is where RMS is below threshold
        # Threshold: 10% of max energy or hardcoded?
        # Let's use a dynamic threshold relative to max energy.
        energy_threshold = 0.02 * np.max(rms) if np.max(rms) > 0 else 0.001
        silence_frames = np.sum(rms < energy_threshold)
        total_frames = len(rms[0])
        pause_ratio = float(silence_frames / total_frames) if total_frames > 0 else 0.0

        # Indicators (Hardcoded thresholds as per 'Classical ML' rules)
        low_energy = energy < 0.01
        high_pitch_variability = pitch_variance > 500.0 # Arbitrary threshold, needs tuning in real life
        reduced_speech_rate = pause_ratio > 0.4 # More than 40% silence?
        
        logger.info(f"Audio processed. Energy={energy:.4f}, PitchMean={pitch_mean:.2f}")

        return {
            "features": {
                "pitch_mean": pitch_mean,
                "pitch_variance": pitch_variance,
                "energy": energy,
                "pause_ratio": pause_ratio
            },
            "indicators": {
                "low_energy": low_energy,
                "high_pitch_variability": high_pitch_variability,
                "reduced_speech_rate": reduced_speech_rate
            }
        }

    except Exception as e:
        logger.error(f"Error in audio processing: {str(e)}")
        # If we can't process audio, maybe it's too short/empty?
        # Return zeros to avoid crashing
        return {
            "features": {
                "pitch_mean": 0.0,
                "pitch_variance": 0.0,
                "energy": 0.0,
                "pause_ratio": 0.0
            },
            "indicators": {
                "low_energy": False,
                "high_pitch_variability": False,
                "reduced_speech_rate": False
            }
        }
