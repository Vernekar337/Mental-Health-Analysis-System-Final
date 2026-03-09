import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Heart, AlertCircle } from "lucide-react";
import api from "../../services/api";

const CounselorDashboard = () => {

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCases = async () => {

      try {

        const res = await api.get("/counselor/cases");

        setCases(res.data.cases || []);

      } catch (err) {

        console.error("Failed to fetch counselor cases", err);

      } finally {

        setLoading(false);

      }

    };

    fetchCases();

  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Counselor Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Students who have made their profiles visible to counselors.
        </p>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200 flex items-center">
          <Users className="w-5 h-5 mr-2 text-emerald-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            Active Student Cases
          </h3>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">MH Index</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Last Assessment</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {cases.map((item) => (

                <tr
                  key={item.studentId}
                  className="hover:bg-slate-50 transition-colors"
                >

                  {/* Student */}
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.studentName}
                  </td>

                  {/* MH Index */}
                  <td className="px-6 py-4 flex items-center text-slate-700">
                    <Heart className="w-4 h-4 mr-1 text-emerald-500" />
                    {item.mhIndex ?? "--"}
                  </td>

                  {/* Severity */}
                  <td className="px-6 py-4">

                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                        ${item.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : item.severity === "Moderate"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                      {item.severity}
                    </span>

                  </td>

                  {/* Last Assessment */}
                  <td className="px-6 py-4 text-slate-500 text-sm">

                    {item.lastAssessmentDate
                      ? new Date(item.lastAssessmentDate).toLocaleDateString()
                      : "N/A"}

                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">

                    <Link
                      to={`/counselor/student/${item.studentId}`}
                      className="text-emerald-600 font-medium hover:underline"
                    >
                      View Profile
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default CounselorDashboard;