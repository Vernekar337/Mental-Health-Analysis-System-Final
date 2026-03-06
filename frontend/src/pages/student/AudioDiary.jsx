import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  UploadCloud,
  Play,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Save,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const AudioDiaryPage = () => {
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioId, setAudioId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Analysis State
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);

  // UI State
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchHistory();

    // Cleanup object URL on unmount
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const fetchHistory = async () => {
    try {
      // Use standard fetch per requirements, or the axios api instance if configured
      const response = await api.get('/audio/history');
      if (response.data && response.data.history) {
        setHistory(response.data.history);
      } else if (Array.isArray(response.data)) {
        setHistory(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
      // Don't show hard error for history fail, just leave empty
    }
  };

  const startRecording = async () => {
    setError(null);
    setSuccessMsg(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioId(null);
    setSelectedFile(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or error occurred.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    setError(null);
    setSuccessMsg(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);

    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        setAudioUrl(URL.createObjectURL(file));
      } else {
        setError("Please upload a valid audio file.");
      }
    }
  };

  const saveDiary = async (source) => {
    let payloadBlob = null;
    let filename = '';

    if (source === 'record' && audioBlob) {
      payloadBlob = audioBlob;
      filename = `diary_${Date.now()}.webm`;
    } else if (source === 'upload' && selectedFile) {
      payloadBlob = selectedFile;
      filename = selectedFile.name;
    } else {
      setError("No audio available to save.");
      return;
    }

    setUploadLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('audio', payloadBlob, filename);

    try {
      const response = await api.post('/audio/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.audioId) {
        setAudioId(response.data.audioId);
        setSuccessMsg("Audio saved successfully. Ready for analysis.");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload audio. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const analyzeEmotion = async () => {
    if (!audioId) return;

    setAnalysisLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await api.post('/audio/analyze/', { audioId });

      if (response.data) {
        setAnalysisResult({
          emotion: response.data.emotion,
          confidence: response.data.confidence,
          mentalState: response.data.mentalState,
          timestamp: new Date().toISOString()
        });
        // Refresh history after new analysis
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze audio. Please try again.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const clearState = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioId(null);
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Audio Diary
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Record or upload audio journals to track your emotional well-being over time.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="rounded-md bg-emerald-50 p-4 border border-emerald-200">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="text-sm font-medium text-emerald-800">{successMsg}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="space-y-6">
          {/* SECTION 1: RECORD AUDIO */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-100 flex flex-col h-full">
            <div className="px-4 py-5 sm:p-6 flex-1">
              <h3 className="text-lg leading-6 font-medium text-blue-900 mb-4 flex items-center">
                <Mic className="h-5 w-5 mr-2 text-blue-500" />
                Record Audio Diary
              </h3>

              <div className="flex justify-center mb-6">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors animate-pulse"
                  >
                    <Square className="h-5 w-5 mr-2 fill-current" />
                    Stop Recording
                  </button>
                )}
              </div>

              {audioBlob && !selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-2">Recording Preview Preview</p>
                  <audio src={audioUrl} controls className="w-full max-w-xs" />
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={clearState}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => saveDiary('record')}
                      disabled={uploadLoading || audioId}
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center"
                    >
                      {uploadLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      {audioId ? 'Saved' : 'Save Diary'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: UPLOAD AUDIO */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-100">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-blue-900 mb-4 flex items-center">
                <UploadCloud className="h-5 w-5 mr-2 text-blue-500" />
                Upload Audio File
              </h3>

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="audio/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">MP3, WAV, WEBM up to 10MB</p>
                </div>
              </div>

              {selectedFile && !audioBlob && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{selectedFile.name}</p>
                  <audio src={audioUrl} controls className="w-full max-w-xs mt-2" />
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={clearState}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => saveDiary('upload')}
                      disabled={uploadLoading || audioId}
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                      {uploadLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                      {audioId ? 'Uploaded' : 'Upload Diary'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* SECTION 3: ML ANALYSIS */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-100">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-blue-900 mb-4 flex items-center justify-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Emotion Analysis
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Run our AI model on your saved audio to detect emotional markers and mental states.
              </p>

              <button
                onClick={analyzeEmotion}
                disabled={!audioId || analysisLoading}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${!audioId
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  } transition-colors w-full justify-center`}
              >
                {analysisLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {analysisLoading ? 'Analyzing...' : 'Analyze Emotion (ML)'}
              </button>
              {!audioId && (
                <p className="mt-2 text-xs text-amber-600 font-medium">Please save or upload an audio diary first.</p>
              )}
            </div>
          </div>

          {/* SECTION 4: ANALYSIS RESULTS */}
          {analysisResult && (
            <div className="bg-blue-50 overflow-hidden shadow rounded-lg border border-blue-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-bold text-blue-900 mb-4 flex items-center border-b border-blue-200 pb-2">
                  Current Result
                </h3>

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Detected Emotion</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{analysisResult.emotion}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Confidence</dt>
                    <dd className="mt-1 text-lg font-semibold text-indigo-600">
                      {Math.round(analysisResult.confidence * 100)}%
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Mental State</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900 bg-white p-3 rounded border border-gray-200 shadow-sm inline-block">
                      {analysisResult.mentalState}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 mt-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-400" />
            Analysis History
          </h3>
        </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emotion</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mental State</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.length > 0 ? history.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.timestamp || item.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.emotion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.confidence ? `${Math.round(item.confidence * 100)}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.mentalState}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500 italic">
                          No audio analysis history found. Record a diary to begin tracking.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDiaryPage;
