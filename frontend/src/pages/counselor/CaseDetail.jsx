import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, AlertTriangle, CheckCircle, XCircle, FileText, Activity } from 'lucide-react';
import { getCaseDetail, updateCaseStatus } from '../../services/api';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await getCaseDetail(id);
        setCaseData(res.data);
      } catch (error) {
        console.error("Failed to fetch case", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  const handleDecision = async (status) => {
    if (!window.confirm(`Are you sure you want to ${status} this case?`)) return;

    setProcessing(true);
    try {
      await updateCaseStatus(id, status);
      alert(`Case ${status} successfully.`);
      navigate('/counselor/dashboard');
    } catch (error) {
      console.error("Action failed", error);
      alert("Failed to update case.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Case Details...</div>;
  if (!caseData) return <div className="p-8 text-center text-slate-500">Case not found.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button onClick={() => navigate('/counselor/dashboard')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      {/* Header / Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl mr-6">
              {caseData.studentName?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{caseData.studentName}</h1>
              <p className="text-slate-500 text-sm mt-1 font-mono">ID: {caseData.studentId}</p>
              <div className="flex items-center mt-2 gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${caseData.riskLevel === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                    caseData.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                  {caseData.riskLevel} Risk
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-600 text-sm font-medium">{caseData.triggerReason}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleDecision('Dismiss')}
              disabled={processing || caseData.status !== 'Pending Review'}
              className="flex items-center bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Dismiss
            </button>
            <button
              onClick={() => handleDecision('Approved')}
              disabled={processing || caseData.status !== 'Pending Review'}
              className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Intervention
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Report View (Embedded) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Latest Vitals</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">MH Index</span>
                  <span className="font-bold text-slate-900">{caseData.mhIndex}/100</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${caseData.mhIndex}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Severity</span>
                  <span className={`font-bold ${caseData.severity === 'High' ? 'text-red-600' : 'text-amber-600'
                    }`}>{caseData.severity}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Trend</span>
                  <span className="font-medium text-slate-700">{caseData.trend}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Flagged Factors</h3>
            <ul className="space-y-3">
              {caseData.explainability?.map((reason, idx) => (
                <li key={idx} className="flex items-start text-sm text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Detailed Context */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Assessment & Journal Context
              </h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                The student has shown a consistent decline in reported mood over the last 3 weekly assessments (PHQ-9).
                Recent journal entries contain keywords associated with high stress and academic pressure.
                Sleep metrics (self-reported) indicate insomnia.
              </p>

              <h4 className="font-semibold text-slate-800 mb-3">Recommendation</h4>
              <div className="bg-slate-50 border-l-4 border-emerald-500 p-4">
                <p className="text-slate-700 text-sm">
                  Based on the high risk score and persistence of symptoms, an in-person check-in is recommended.
                  Confirm "Approve Intervention" to notify the student's assigned academic advisor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CaseDetail;
