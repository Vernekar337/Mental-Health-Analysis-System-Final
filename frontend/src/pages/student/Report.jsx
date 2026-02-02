import React, { useEffect, useState } from 'react';
import { FileText, Shield, Activity, Calendar, UserCheck, AlertTriangle } from 'lucide-react';
import { getStudentReport } from '../../services/api';

const StudentReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getStudentReport();
        setReport(res.data);
      } catch (error) {
        console.error("Failed to fetch report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Report...</div>;
  if (!report) return <div className="p-8 text-center text-slate-500">No report available.</div>;

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 border-b border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-emerald-400" />
                Mental Health Analysis Report
              </h1>
              <p className="text-slate-400 text-sm uppercase tracking-wider">
                Confidential • Educational Use Only
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-slate-800 rounded px-3 py-1 text-sm text-emerald-400 border border-slate-700">
                {report.lastAssessmentDate}
              </div>
              <div className="text-xs text-slate-500 mt-1">Generated Date</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">

          {/* 1. Executive Summary Grid */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Executive Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">MH Index</span>
                <div className="text-3xl font-bold text-slate-900 mt-1">{report.mhIndex}</div>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity</span>
                <div className={`text-2xl font-bold mt-1 ${report.severity === 'High' ? 'text-red-600' :
                    report.severity === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{report.severity}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trend</span>
                <div className="text-xl font-bold text-slate-700 mt-2 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  {report.trend}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Level</span>
                <div className="text-xl font-bold text-slate-800 mt-2 flex items-center">
                  <AlertTriangle className={`w-4 h-4 mr-2 ${report.riskLevel === 'High' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                  {report.riskLevel}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Analysis & Insights */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Analysis & Insights</h2>
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <ul className="space-y-4">
                {report.explainability && report.explainability.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                    <p className="ml-4 text-slate-700 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 text-sm rounded border border-emerald-100 flex items-start">
                <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                <p>This analysis is generated based on self-reported assessment data and patterns. It refers to potential risk factors and is not a clinical diagnosis.</p>
              </div>
            </div>
          </div>

          {/* 3. Review Status */}
          <div className="flex flex-col md:flex-row gap-6 mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${report.caseStatus === 'Reviewed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Review Status</h3>
                <p className="text-lg font-medium text-slate-700">{report.caseStatus}</p>
              </div>
            </div>

            {report.counselorName && (
              <div className="text-right">
                <p className="text-sm text-slate-500">Reviewed by</p>
                <p className="font-semibold text-slate-800">{report.counselorName}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(report.reviewedAt).toLocaleDateString()} at {new Date(report.reviewedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentReport;
