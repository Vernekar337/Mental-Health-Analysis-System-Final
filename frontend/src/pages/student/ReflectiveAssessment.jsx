import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { getReflectionQuestions, submitReflection } from '../../services/api';

const ReflectiveAssessment = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {

      try {

        const res = await getReflectionQuestions();

        const data = res.data.questions || [];

        const formatted = data.map((q, i) => ({
          id: i + 1,
          question: q,
          type: "text",
          placeholder: "Write your thoughts..."
        }));

        setQuestions(formatted);

      } catch (error) {

        console.error("Failed to fetch reflective questions", error);

      } finally {

        setLoading(false);

      }

    };
    fetchQuestions();
  }, []);

  const handleTextChange = (id, value) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleOptionSelect = (id, option) => {
    setResponses(prev => ({ ...prev, [id]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answers = Object.values(responses);

      await submitReflection({
        assessmentType: "REFLECTION",
        responses: answers
      });
      console.log("Reflection payload:", {
        assessmentType: "REFLECTION",
        responses: answers
      })
      alert("Reflections submitted successfully.");
      navigate('/student/dashboard');
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Assessment...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reflective Assessment</h1>
        <p className="text-slate-500 mt-1">Short questions to help understand your current state.</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <HelpCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Why am I seeing this?</p>
          <p className="text-sm text-blue-700 mt-1">
            These questions are generated based on your recent assessment results to provide deeper insights for your counselor.
            There are no right or wrong answers.
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{q.question}</h3>

            {q.type === 'text' && (
              <textarea
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[120px] text-slate-700 placeholder-slate-400"
                placeholder={q.placeholder}
                value={responses[q.id] || ''}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
              />
            )}

            {q.type === 'mcq' && (
              <div className="space-y-2">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(q.id, option)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${responses[q.id] === option
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${responses[q.id] === option ? 'border-emerald-600' : 'border-slate-400'
                        }`}>
                        {responses[q.id] === option && (
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 mr-2" />
          {submitting ? 'Submitting...' : 'Submit Responses'}
        </button>
      </div>
    </div>
  );
};

export default ReflectiveAssessment;
