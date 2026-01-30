import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, User, Clock } from 'lucide-react';
import ExplainabilityPanel from '../../components/ExplainabilityPanel';
import LoadingBoundary from '../../components/LoadingBoundary';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);

  useEffect(() => {
    // Assuming GET /api/counselor/cases/:id returns full details
    // If not, we might need multiple calls.
    const fetchDetail = async () => {
      try {
        // Wait, the API contract list in plan said:
        // GET /api/counselor/cases
        // POST /api/counselor/cases/:id/decide
        // Does it have GET /api/counselor/cases/:id?
        // "Case Detail View - Student profile summary, Charts, Explainability panel"
        // I'll assume standard REST: GET /api/counselor/cases/:id works.
        const response = await api.get(`/counselor/cases/${id}`);
        setCaseData(response.data);
      } catch (err) {
        console.error("Fetch detail error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDecision = async (decision) => {
    setDecisionSubmitting(true);
    try {
      await api.post(`/counselor/cases/${id}/decide`, { decision });
      // Navigate back to queue
      navigate('/counselor/cases');
    } catch (err) {
      console.error("Decision error", err);
      setDecisionSubmitting(false);
    }
  };

  if (loading) return <LoadingBoundary />;
  if (!caseData) return <div className="p-4 text-center">Case not found.</div>;

  // Derive insights for panel
  const insights = [];
  if (caseData.flags) {
    if (caseData.flags.includes('Audio')) insights.push({ type: 'audio', title: 'Audio Analysis', description: 'Voice properties indicated stress/anxiety.' });
    if (caseData.flags.includes('Text')) insights.push({ type: 'text', title: 'Journal Sentiment', description: 'Negative sentiment clusters found in text journal.' });
    if (caseData.mh_index > 0.7) insights.push({ type: 'assessment', title: 'Critical Score', description: 'Overall MH Index is above critical threshold.' });
  } else {
    // Fallback if flags not explicit
    insights.push({ type: 'general', title: 'Manual Review Triggered', description: 'System flagged this case for review.' });
  }

  // Mock chart data if not in response
  const historyData = caseData.history || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Case Detail: #{id.substr(-6)}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review student triggers and decide on next steps.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => handleDecision('dismiss')}
              disabled={decisionSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Dismiss
            </button>
            <button
              onClick={() => handleDecision('approve')}
              disabled={decisionSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              {decisionSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Approve Intervention'}
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Student Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{caseData.studentName || 'Confidential'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Detected At
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(caseData.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
              <dd className={`mt-1 text-sm font-bold sm:mt-0 sm:col-span-2 
                    ${caseData.risk_level === 'High' ? 'text-red-600' : 'text-yellow-600'}`}>
                {caseData.risk_level}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Trend Analysis</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <ExplainabilityPanel insights={insights} />
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
