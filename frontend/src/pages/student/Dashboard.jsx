import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, FileText, ArrowRight, Brain } from 'lucide-react';
import { getStudentReport, getAssessmentHistory } from '../../services/api';
import StatCard from '../../components/StatCard';
import ExplainabilityPanel from '../../components/ExplainabilityPanel';

const StudentDashboard = () => {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, historyRes] = await Promise.all([
          getStudentReport(),
          getAssessmentHistory()
        ]);
        setReport(reportRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">Mental health overview and trends</p>
        </div>
        <div className="flex gap-3">
          <Link to="/student/assessments" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Take Assessment
          </Link>
          <Link to="/student/report" className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            View Full Report
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mental Health Index"
          value={report?.mhIndex ?? 'N/A'}
          subtext="Scale of 0-100"
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Current Severity</h3>
          <div className={`mt-2 text-3xl font-bold ${report?.severity === 'High' ? 'text-red-600' :
              report?.severity === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
            {report?.severity ?? 'Unknown'}
          </div>
          <p className="mt-1 text-sm text-slate-600">Based on last assessment</p>
        </div>
        <StatCard
          title="Trend"
          value={report?.trend ?? '-'}
          subtext="Since last month"
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Case Status</h3>
          <div className="mt-2 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${report?.caseStatus === 'Pending Review' ? 'bg-amber-100 text-amber-800' :
                report?.caseStatus === 'Reviewed' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-800'
              }`}>
              {report?.caseStatus ?? 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Mental Health Index Trend</h3>
            <Brain className="text-slate-400 w-5 h-5" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainability Panel */}
        <div className="lg:col-span-1">
          <ExplainabilityPanel reasons={["Consistent sleep patterns observed.", "Self-reported stress levels are manageable.", "Positive engagement in recent journal entries."]} />
          {/* Note: Hardcoded reasons for demo as per 'Only render API responses (dummy data allowed)' and 'No ML logic' */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
