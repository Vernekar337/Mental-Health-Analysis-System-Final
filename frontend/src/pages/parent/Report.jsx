import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, User, BookOpen, Activity } from 'lucide-react';
import { getParentReport } from '../../services/api';

const ParentReport = () => {

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchReport = async () => {

      try {

        const res = await getParentReport();

        const data = res.data || {};

        setReport({
          summary: data.summary || "No summary available.",
          counselorName: data.counselorName || "Counselor",
          reportDate: data.reportDate
            ? new Date(data.reportDate).toLocaleDateString()
            : "N/A",

          metrics: {
            mood: data.metrics?.mood || "N/A",
            stress: data.metrics?.stress || "N/A",
            sleep: data.metrics?.sleep || "N/A"
          },

          recommendations: data.recommendations || []

        });

      } catch (error) {

        console.error("Failed to fetch parent report", error);

      } finally {

        setLoading(false);

      }

    };

    fetchReport();

  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Report...
      </div>
    );

  if (!report)
    return (
      <div className="p-8 text-center text-slate-500">
        No report available.
      </div>
    );

  return (

    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">

          Parent Report

        </h1>

        <p className="text-slate-500 mt-1">

          Mental health status overview for your child.

        </p>

      </div>

      {/* Approval Banner */}

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center">

        <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />

        <div>

          <p className="text-sm font-semibold text-emerald-800">

            Verified & Approved

          </p>

          <p className="text-xs text-emerald-600">

            Reviewed by {report.counselorName} on {report.reportDate}

          </p>

        </div>

      </div>

      {/* Main Content */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Summary */}

        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">

          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

            <User className="w-5 h-5 mr-2 text-slate-500" />

            Executive Summary

          </h2>

          <p className="text-slate-600 leading-relaxed">

            {report.summary}

          </p>

        </div>

        {/* Metrics */}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

            <Activity className="w-5 h-5 mr-2 text-slate-500" />

            Key Metrics

          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center border-b border-slate-50 pb-2">

              <span className="text-slate-600 text-sm">

                Mood Stability

              </span>

              <span className="font-semibold text-emerald-600 text-sm">

                {report.metrics.mood}

              </span>

            </div>

            <div className="flex justify-between items-center border-b border-slate-50 pb-2">

              <span className="text-slate-600 text-sm">

                Stress Level

              </span>

              <span className="font-semibold text-amber-600 text-sm">

                {report.metrics.stress}

              </span>

            </div>

            <div className="flex justify-between items-center">

              <span className="text-slate-600 text-sm">

                Sleep Quality

              </span>

              <span className="font-semibold text-red-500 text-sm">

                {report.metrics.sleep}

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Recommendations */}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

          <BookOpen className="w-5 h-5 mr-2 text-slate-500" />

          Home Recommendations

        </h2>

        <div className="space-y-3">

          {report.recommendations.length === 0 && (

            <p className="text-sm text-slate-500">

              No recommendations available.

            </p>

          )}

          {report.recommendations.map((rec, idx) => (

            <div key={idx} className="flex items-start">

              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold mr-3 mt-0.5">

                {idx + 1}

              </div>

              <p className="text-slate-700 text-sm">

                {rec}

              </p>

            </div>

          ))}

        </div>

      </div>

      <div className="text-center text-xs text-slate-400 mt-8">

        <p>

          Confidential Document • Not for detailed diagnosis

        </p>

      </div>

    </div>

  );

};

export default ParentReport;