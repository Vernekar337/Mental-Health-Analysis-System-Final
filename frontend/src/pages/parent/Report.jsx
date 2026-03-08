import React, { useEffect, useState } from 'react'
import {
  CheckCircle,
  User,
  BookOpen,
  Activity,
  Heart,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Lightbulb
} from 'lucide-react'

import { getParentReport } from '../../services/api'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

const ParentReport = () => {

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchReport = async () => {

      try {

        const res = await getParentReport()
        const data = res.data || {}

        setReport({
          childName: data.childName || "Student",
          counselorName: data.counselorName || "Counselor",
          reportDate: data.reportDate
            ? new Date(data.reportDate).toLocaleDateString()
            : "N/A",

          mhIndex: data.mhIndex ?? "—",
          severity: data.severity || "Unknown",
          trend: data.trend || "Stable",
          riskLevel: data.riskLevel || "Unknown",

          lastAssessmentDate: data.lastAssessmentDate
            ? new Date(data.lastAssessmentDate).toLocaleDateString()
            : "N/A",

          summary: data.summary || "No summary available.",

          studentReflection:
            data.studentReflection || "No reflection insights available.",

          metrics: {
            mood: data.metrics?.mood || "N/A",
            stress: data.metrics?.stress || "N/A",
            sleep: data.metrics?.sleep || "N/A"
          },

          recommendations: data.recommendations || [],

          trendData: data.trendData || []

        })

      } catch (error) {

        console.error("Failed to fetch parent report", error)

      } finally {

        setLoading(false)

      }

    }

    fetchReport()

  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Loading Report...
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        No report available.
      </div>
    )
  }

  return (

    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Parent Report
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Viewing mental health summary for
          <span className="font-semibold ml-1 text-slate-700">
            {report.childName}
          </span>
        </p>

      </div>

      {/* Approval Banner */}

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between shadow-sm">

        <div className="flex items-center">

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

        <div className="flex items-center text-sm text-slate-600 bg-white px-3 py-1.5 rounded-md shadow-sm border border-slate-200">

          <Calendar className="w-4 h-4 mr-2 text-slate-400" />

          Last Assessment:
          <span className="font-semibold ml-1 text-slate-800">
            {report.lastAssessmentDate}
          </span>

        </div>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">

          <div className="flex items-center text-slate-500 text-sm font-medium mb-2">

            <Heart className="w-4 h-4 mr-1.5" />

            MH Index

          </div>

          <p className="text-3xl font-bold text-slate-900">
            {report.mhIndex}
          </p>

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">

          <div className="flex items-center text-slate-500 text-sm font-medium mb-2">

            <Activity className="w-4 h-4 mr-1.5" />

            Severity

          </div>

          <p className={`text-xl font-bold ${report.severity === "High"
              ? "text-red-600"
              : report.severity === "Moderate"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}>

            {report.severity}

          </p>

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">

          <div className="flex items-center text-slate-500 text-sm font-medium mb-2">

            <TrendingUp className="w-4 h-4 mr-1.5" />

            Trend

          </div>

          <p className="text-xl font-bold text-emerald-600">
            {report.trend}
          </p>

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">

          <div className="flex items-center text-slate-500 text-sm font-medium mb-2">

            <AlertTriangle className="w-4 h-4 mr-1.5" />

            Risk Level

          </div>

          <p className={`text-xl font-bold ${report.riskLevel === "High Risk"
              ? "text-red-600"
              : report.riskLevel === "Moderate Risk"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}>

            {report.riskLevel}

          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

              <User className="w-5 h-5 mr-2 text-slate-500" />

              Executive Summary

            </h2>

            <p className="text-slate-600 leading-relaxed">
              {report.summary}
            </p>

          </div>

          <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6 relative overflow-hidden">

            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">

              <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />

              Latest Reflection Insight

            </h2>

            <p className="text-slate-700 italic">
              "{report.studentReflection}"
            </p>

          </div>

        </div>

        {/* Right column */}

        <div className="space-y-6">

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

              <TrendingUp className="w-5 h-5 mr-2 text-slate-500" />

              Recent MH Trend

            </h2>

            <div className="h-32 w-full">

              {report.trendData.length === 0 ? (

                <p className="text-sm text-slate-400">
                  No trend data available
                </p>

              ) : (

                <ResponsiveContainer width="100%" height="100%">

                  <LineChart data={report.trendData}>

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                    />

                  </LineChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

              <Activity className="w-5 h-5 mr-2 text-slate-500" />

              Key Metrics

            </h2>

            <div className="space-y-4">

              <div className="flex justify-between text-sm">

                <span>Mood Stability</span>

                <span className="font-semibold text-emerald-600">
                  {report.metrics.mood}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span>Stress Level</span>

                <span className="font-semibold text-amber-600">
                  {report.metrics.stress}
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span>Sleep Quality</span>

                <span className="font-semibold text-red-500">
                  {report.metrics.sleep}
                </span>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">

            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">

              <BookOpen className="w-5 h-5 mr-2 text-slate-500" />

              Home Recommendations

            </h2>

            <div className="space-y-3">

              {report.recommendations.length === 0 ? (

                <p className="text-sm text-slate-500">
                  No recommendations available
                </p>

              ) : (

                report.recommendations.map((rec, idx) => (

                  <div key={idx} className="flex items-start">

                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold mr-3">
                      {idx + 1}
                    </div>

                    <p className="text-slate-700 text-sm">
                      {rec}
                    </p>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

      <div className="text-center text-xs text-slate-400 pb-8">
        Confidential Document • Not for clinical diagnosis
      </div>

    </div>

  )

}

export default ParentReport