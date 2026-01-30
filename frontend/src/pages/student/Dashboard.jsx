import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import ExplainabilityPanel from '../../components/ExplainabilityPanel';
import LoadingBoundary from '../../components/LoadingBoundary';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard data from backend
        // Assuming POST /api/assessments/history works and returns list
        // And we might calculate stats on frontend or backend provides /student/dashboard endpoint if defined?
        // User requirements said strictly use existing backend APIs.
        // Student endpoints: 
        // POST /api/assessments, GET /api/assessments/history
        // Dashboard needs charts. So we fetch history.
        const response = await api.get('/assessments/history');
        setData(response.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingBoundary />;

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  // Pre-process data for charts
  // Assuming response.data is array of { date, score, risk_level, index }
  // Backend contract isn't fully visible but I assume 'history' returns array.
  // We need to map it to Recharts format.
  const chartData = Array.isArray(data) ? data.map(item => ({
    date: new Date(item.createdAt || item.date).toLocaleDateString(),
    index: item.mh_index || item.score || 0, // Fallback keys
  })) : [];

  const lastAssessment = Array.isArray(data) && data.length > 0 ? data[data.length - 1] : null;

  // Mock-up Insights based on real data for Explainability Panel
  // In a real scenario, the backend might return 'insights' field. 
  // If not, we derive simple ones or check if backend contract provided them.
  // Requirement: "Explainability Panel - When any risk flag exists: Show WHY".
  // I will check if lastAssessment has risk flags.
  const insights = [];
  if (lastAssessment) {
    if (lastAssessment.risk_level === 'High' || lastAssessment.risk_level === 'Moderate') {
      insights.push({
        type: 'assessment',
        title: 'Elevated Risk Level',
        description: `Your last assessment indicated a ${lastAssessment.risk_level} risk level based on your responses.`
      });
    }
    // If we had breakdown in assessment object
    if (lastAssessment.breakdown) {
      // e.g. { phq9: 15, gad7: 10 }
      if (lastAssessment.breakdown.phq9 > 10) insights.push({ type: 'text', title: 'Depression Markers', description: 'PHQ-9 score suggests significant depressive symptoms.' });
      if (lastAssessment.breakdown.gad7 > 10) insights.push({ type: 'text', title: 'Anxiety Markers', description: 'GAD-7 score suggests significant anxiety symptoms.' });
    }
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Your Dashboard
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Status Card 1 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Last Assessment</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {lastAssessment ? new Date(lastAssessment.createdAt || lastAssessment.date).toLocaleDateString() : 'No assessments yet'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card 2 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Current Trend</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {/* Derive trend from last 2 points if API doesn't give it directly */}
                      {chartData.length >= 2 ?
                        (chartData[chartData.length - 1].index > chartData[chartData.length - 2].index ? 'Increasing' : 'Stable/Decreasing')
                        : 'Insufficient Data'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card 3 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Latest Index</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {lastAssessment ? (lastAssessment.mh_index || lastAssessment.score || 0).toFixed(2) : '-'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Mental Health Index History</h3>
        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line type="monotone" dataKey="index" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No history data available to chart.</p>
            </div>
          )}
        </div>
      </div>

      {/* Explainability Panel */}
      <ExplainabilityPanel insights={insights} />

    </div>
  );
};

export default StudentDashboard;
