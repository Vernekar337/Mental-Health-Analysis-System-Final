import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  BarChart2,
} from 'lucide-react';
import api from '../../services/api';

// ── Small bar chart (no library needed) ────────────────────────
const ScoreBar = ({ label, score, max, color }) => {
  const pct = Math.min(Math.round((score / max) * 100), 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{score} / {max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Trend icon helper ────────────────────────────────────────────
const TrendIcon = ({ trend }) => {
  if (!trend) return <Minus className="h-4 w-4 text-gray-400" />;
  const t = trend.toLowerCase();
  if (t.includes('improv') || t.includes('decreas')) return <TrendingDown className="h-4 w-4 text-emerald-500" />;
  if (t.includes('worsen') || t.includes('increas')) return <TrendingUp className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
};

// ── Severity color badge ────────────────────────────────────────
const severityClasses = {
  Minimal: 'bg-emerald-100 text-emerald-800',
  Mild: 'bg-blue-100 text-blue-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  'Moderately Severe': 'bg-orange-100 text-orange-800',
  Severe: 'bg-red-100 text-red-800',
};

// ── Main Component ──────────────────────────────────────────────
const CounselorSuggestionPage = () => {
  const { studentId } = useParams();

  // Student data
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [studentError, setStudentError] = useState(null);

  // Suggestion form
  const [suggestion, setSuggestion] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Previous suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  // ── Fetch student overview ───────────────────────────────────
  useEffect(() => {
    const fetchStudent = async () => {
      setStudentLoading(true);
      setStudentError(null);
      try {
        const res = await api.get(`/counselor/student/${studentId}`);
        setStudent(res.data?.student ?? res.data);
      } catch (err) {
        console.error('Failed to load student', err);
        setStudentError('Failed to load student data.');
      } finally {
        setStudentLoading(false);
      }
    };

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const res = await api.get(`/counselor/suggestions/${studentId}`);
        const data = res.data;
        setSuggestions(Array.isArray(data) ? data : (data.suggestions ?? []));
      } catch (err) {
        console.error('Failed to load suggestions', err);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
      fetchSuggestions();
    }
  }, [studentId]);

  // ── Submit suggestion ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await api.post('/counselor/suggestion', { studentId, suggestion: suggestion.trim() });
      setSubmitSuccess('Suggestion submitted successfully.');
      setSuggestion('');
      // Refresh suggestions list
      const res = await api.get(`/counselor/suggestions/${studentId}`);
      const data = res.data;
      setSuggestions(Array.isArray(data) ? data : (data.suggestions ?? []));
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to submit suggestion.';
      setSubmitError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Scores from student data ─────────────────────────────────
  const phq9 = student?.phq9Score ?? student?.scores?.phq9 ?? 0;
  const gad7 = student?.gad7Score ?? student?.scores?.gad7 ?? 0;
  const dass21 = student?.dass21Score ?? student?.scores?.dass21 ?? 0;

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back link + Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <Link to="/counselor/cases" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cases
          </Link>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Student Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">Review student mental health data and provide guidance.</p>
        </div>
      </div>

      {/* ── SECTION 1: STUDENT OVERVIEW ───────────────────────── */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <User className="h-5 w-5 mr-2 text-gray-400" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Overview</h3>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {studentLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading student data…
            </div>
          ) : studentError ? (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-800">{studentError}</span>
            </div>
          ) : student ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Left: identity */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{student.name ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">MH Index</p>
                  <p className="mt-1 text-2xl font-bold text-indigo-600">{student.mhIndex ?? student.mh_index ?? '—'} <span className="text-sm font-normal text-gray-500">/ 100</span></p>
                </div>
              </div>

              {/* Right: severity + trend */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Severity Level</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${severityClasses[student.severity] ?? 'bg-gray-100 text-gray-700'}`}>
                      {student.severity ?? '—'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Trend</p>
                  <div className="mt-1 flex items-center gap-2">
                    <TrendIcon trend={student.trend} />
                    <span className="text-sm font-medium text-gray-900">{student.trend ?? 'Insufficient Data'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No data found for this student.</p>
          )}
        </div>
      </div>

      {/* ── SECTION 2: ASSESSMENT BREAKDOWN ───────────────────── */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-gray-400" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assessment Breakdown</h3>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {studentLoading ? (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading scores…
            </div>
          ) : (
            <>
              {/* Score cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'PHQ-9', score: phq9, max: 27, bg: 'bg-blue-50', text: 'text-blue-700' },
                  { label: 'GAD-7', score: gad7, max: 21, bg: 'bg-orange-50', text: 'text-orange-700' },
                  { label: 'DASS-21', score: dass21, max: 63, bg: 'bg-purple-50', text: 'text-purple-700' },
                ].map(({ label, score, max, bg, text }) => (
                  <div key={label} className={`${bg} rounded-lg p-4 text-center`}>
                    <p className={`text-2xl font-bold ${text}`}>{score}</p>
                    <p className="text-xs text-gray-500 mt-1">{label} <span className="font-normal">/ {max}</span></p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="space-y-3">
                <ScoreBar label="PHQ-9 (Depression)" score={phq9} max={27} color="bg-blue-500" />
                <ScoreBar label="GAD-7 (Anxiety)" score={gad7} max={21} color="bg-orange-500" />
                <ScoreBar label="DASS-21 (Stress)" score={dass21} max={63} color="bg-purple-500" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── SECTION 3: WRITE SUGGESTION ───────────────────────── */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-400" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Write Suggestion</h3>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {submitError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200 flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-800">{submitError}</span>
            </div>
          )}
          {submitSuccess && (
            <div className="mb-4 rounded-md bg-emerald-50 p-3 border border-emerald-200 flex items-start">
              <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-emerald-800">{submitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-1">
              Suggestion for student
            </label>
            <textarea
              id="suggestion"
              rows={4}
              required
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="e.g. Recommend breathing exercises, reducing academic workload, and daily journaling…"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={submitLoading || !suggestion.trim()}
                className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {submitLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                {submitLoading ? 'Submitting…' : 'Submit Suggestion'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── SECTION 4: PREVIOUS SUGGESTIONS ───────────────────── */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-400" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Previous Suggestions</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {suggestionsLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading…
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500 italic">
              No suggestions recorded yet for this student.
            </div>
          ) : (
            suggestions.map((item, idx) => (
              <div key={item.id ?? item._id ?? idx} className="px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{item.counselorName ?? 'Counselor'}</p>
                      <p className="text-xs text-gray-500">
                        {item.date || item.createdAt
                          ? new Date(item.date ?? item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                <blockquote className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-md px-4 py-3 border-l-4 border-indigo-300 italic">
                  "{item.suggestion ?? item.text ?? '—'}"
                </blockquote>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default CounselorSuggestionPage;
