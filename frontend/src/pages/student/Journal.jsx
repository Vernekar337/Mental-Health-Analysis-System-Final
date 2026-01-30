import React, { useState, useRef } from 'react';
import api from '../../services/api';
import { Loader2, Mic, Square, Save, Upload, AlertCircle, CheckCircle, Volume2 } from 'lucide-react';

const Journal = () => {
  const [textEntry, setTextEntry] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [submittingText, setSubmittingText] = useState(false);
  const [submittingAudio, setSubmittingAudio] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  // --- Text Submission ---
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textEntry.trim()) return;

    setSubmittingText(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/journal/text', { text: textEntry });
      setTextEntry('');
      setStatus({ type: 'success', message: 'Text entry saved successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save text entry.' });
    } finally {
      setSubmittingText(false);
    }
  };

  // --- Audio Logic ---
  const startRecording = async () => {
    setStatus({ type: '', message: '' });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stopTimer();
        // Cleanup stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();

    } catch (err) {
      console.error("Mic error", err);
      setStatus({ type: 'error', message: 'Could not access microphone.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startTimer = () => {
    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      setRecordingDuration(prev => {
        if (prev >= 30) {
          stopRecording(); // Enforce limit
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const discardAudio = () => {
    setAudioBlob(null);
    setRecordingDuration(0);
    setStatus({ type: '', message: '' });
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    setSubmittingAudio(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    // Filename required by backend typically
    formData.append('file', audioBlob, 'journal_audio.webm');

    try {
      await api.post('/journal/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAudioBlob(null);
      setRecordingDuration(0);
      setStatus({ type: 'success', message: 'Audio journal uploaded successfully.' });
    } catch (err) {
      console.error("Audio upload error", err);
      setStatus({ type: 'error', message: 'Failed to upload audio.' });
    } finally {
      setSubmittingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Journal</h2>
        <p className="text-gray-500 mt-1">Express yourself through text or voice.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-md flex items-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Text Journal */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Save className="h-5 w-5 mr-2 text-blue-500" />
            Text Entry
          </h3>
          <form onSubmit={handleTextSubmit}>
            <textarea
              value={textEntry}
              onChange={(e) => setTextEntry(e.target.value)}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm resize-none p-3 border"
              placeholder="How are you feeling today?"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submittingText || !textEntry.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {submittingText ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>

        {/* Audio Journal */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Mic className="h-5 w-5 mr-2 text-purple-500" />
            Voice Journal (Max 30s)
          </h3>

          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            {!audioBlob ? (
              <>
                <div className={`relative rounded-full p-4 transition-all duration-300 ${isRecording ? 'bg-red-100 ring-4 ring-red-50' : 'bg-gray-100'}`}>
                  {isRecording ? (
                    <Square
                      className="h-10 w-10 text-red-600 cursor-pointer"
                      onClick={stopRecording}
                    />
                  ) : (
                    <Mic
                      className="h-10 w-10 text-gray-600 cursor-pointer hover:text-emerald-600"
                      onClick={startRecording}
                    />
                  )}
                </div>
                {isRecording && (
                  <div className="text-center">
                    <span className="text-red-600 font-mono text-xl animate-pulse">
                      00:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Recording... (Max 30s)</p>
                  </div>
                )}
                {!isRecording && <p className="text-sm text-gray-500">Tap microphone to inspire.</p>}
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-center p-4 bg-purple-50 rounded-lg mb-4">
                  <Volume2 className="h-6 w-6 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-800 font-medium">Audio recorded ({recordingDuration}s)</span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={discardAudio}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Discard
                  </button>
                  <button
                    onClick={uploadAudio}
                    disabled={submittingAudio}
                    className="flex-1 inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {submittingAudio ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
