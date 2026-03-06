import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { Activity, FileText, Brain } from "lucide-react";
import { getInsights } from "../../services/api"

import {
  getStudentReport,
  getAssessmentHistory
} from "../../services/api";

import StatCard from "../../components/StatCard";
import ExplainabilityPanel from "../../components/ExplainabilityPanel";

const StudentDashboard = () => {

  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([])
  const [insightLoading, setInsightLoading] = useState(true)

  useEffect(() => {

    const fetchData = async () => {

      try {

        const [reportRes, historyRes] = await Promise.all([
          getStudentReport(),
          getAssessmentHistory()
        ]);

        setReport(reportRes.data);

        // convert mhIndex → score for chart
        const formattedHistory = historyRes.data.map(item => ({
          date: item.date,
          score: item.mhIndex
        }));

        setHistory(formattedHistory);

      } catch (err) {

        console.error("Dashboard fetch error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchData();
    const fetchInsights = async () => {

      try {

        const res = await getInsights()

        setInsights(res.data)

      }

      catch (err) {

        console.error("Insight error:", err)

      }

      finally {

        setInsightLoading(false)

      }

    }

    fetchInsights()

  }, []);

  if (loading) {

    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );

  }

  return (

    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Student Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Mental health overview and trends
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            to="/student/assessments"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center"
          >
            <Activity className="w-4 h-4 mr-2" />
            Take Assessment
          </Link>

          <Link
            to="/student/report"
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Full Report
          </Link>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Mental Health Index"
          value={report?.mhIndex ?? "N/A"}
          subtext="Scale of 0-100"
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">

          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Current Severity
          </h3>

          <div
            className={`mt-2 text-3xl font-bold ${report?.severity === "Severe"
              ? "text-red-600"
              : report?.severity === "Moderate"
                ? "text-amber-600"
                : "text-emerald-600"
              }`}
          >
            {report?.severity ?? "Unknown"}
          </div>

          <p className="mt-1 text-sm text-slate-600">
            Based on last assessment
          </p>

        </div>

        <StatCard
          title="Trend"
          value={report?.trend ?? "-"}
          subtext="Recent trend"
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">

          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Case Status
          </h3>

          <div className="mt-2 flex items-center">

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-800">

              {report?.caseStatus ?? "None"}

            </span>

          </div>

        </div>

      </div>

      {/* Chart + Insights */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">

          <div className="flex items-center justify-between mb-6">

            <h3 className="text-lg font-semibold text-slate-800">
              Mental Health Index Trend
            </h3>

            <Brain className="text-slate-400 w-5 h-5" />

          </div>

          <div className="h-72 w-full">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={history}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 100]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#059669"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Insights */}

        <div className="lg:col-span-1">

          <ExplainabilityPanel
            reasons={insights}
            loading={insightLoading}
          />

        </div>

      </div>

    </div>

  );

};

export default StudentDashboard;