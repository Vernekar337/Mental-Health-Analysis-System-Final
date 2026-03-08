import React, { useEffect, useState } from 'react';
import { FileText, Shield, Activity, UserCheck } from 'lucide-react';
import { getStudentReport, getInsights } from '../../services/api';

const StudentReport = () => {

  const [report, setReport] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchReport = async () => {

      try {

        const res = await getStudentReport();

        setReport(res.data);

        // insights may load slower
        const insightsRes = await getInsights();
        setInsights(insightsRes.data);

      } catch (error) {

        console.error("Failed to fetch report", error);

      } finally {

        setLoading(false);

      }

    };

    fetchReport();

  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Report...</div>;
  }

  if (!report) {
    return <div className="p-8 text-center text-slate-500">No report available.</div>;
  }

  return (

    <div className="max-w-4xl mx-auto my-8">

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200">

        {/* HEADER */}

        <div className="bg-slate-900 text-white p-8 border-b border-slate-800">

          <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-emerald-400" />
            Mental Health Analysis Report
          </h1>

          <p className="text-slate-400 text-sm uppercase tracking-wider">
            Confidential • Educational Use Only
          </p>

        </div>

        {/* BODY */}

        <div className="p-8 space-y-8">

          {/* SUMMARY */}

          <div>

            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Executive Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  MH Index
                </span>

                <div className="text-3xl font-bold text-slate-900 mt-1">
                  {report.mhIndex ?? "-"}
                </div>

                <span className="text-xs text-slate-500">/100</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Severity
                </span>

                <div className="text-xl font-bold mt-1 text-amber-600">
                  {report.severity}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Trend
                </span>

                <div className="text-xl font-bold text-slate-700 mt-2 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  {report.trend}
                </div>
              </div>

            </div>

          </div>

          {/* INSIGHTS */}

          <div>

            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Analysis Insights
            </h2>

            <div className="bg-white border border-slate-200 rounded-lg p-6">

              {insights.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  Insights are being generated...
                </p>
              ) : (

                <ul className="space-y-4">

                  {insights.map((item, idx) => (

                    <li key={idx} className="flex items-start">

                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>

                      <p className="ml-4 text-slate-700 leading-relaxed">
                        {item}
                      </p>

                    </li>

                  ))}

                </ul>

              )}

              <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 text-sm rounded border border-emerald-100 flex items-start">

                <Shield className="w-5 h-5 mr-3 flex-shrink-0" />

                <p>
                  This analysis is generated from self-reported assessments and behavioral patterns. It is not a clinical diagnosis.
                </p>

              </div>

            </div>

          </div>

          {/* CASE STATUS */}

          <div className="flex items-center p-6 bg-slate-50 rounded-xl border border-slate-200">

            <div className="p-3 rounded-full mr-4 bg-emerald-100 text-emerald-600">
              <UserCheck className="w-6 h-6" />
            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900 uppercase">
                Case Status
              </h3>

              <p className="text-lg font-medium text-slate-700">
                {report.caseStatus}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default StudentReport;