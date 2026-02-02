import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { getCounselorCases } from '../../services/api';

const CounselorDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getCounselorCases();
        setCases(res.data);
      } catch (error) {
        console.error("Failed to fetch cases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Counselor Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of student cases requiring attention.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Active Cases</span>
          <div className="text-3xl font-bold text-slate-900 mt-2">12</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-red-600 uppercase">High Risk</span>
          <div className="text-3xl font-bold text-red-600 mt-2">3</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-amber-600 uppercase">Pending Review</span>
          <div className="text-3xl font-bold text-amber-600 mt-2">5</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Resolved (This Week)</span>
          <div className="text-3xl font-bold text-emerald-600 mt-2">8</div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Priority Cases</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search students..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Trigger Reason</th>
                <th className="px-6 py-3">Risk Level</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Updated</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs mr-3">
                        {item.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{item.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-sm">
                    {item.triggerReason}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                      item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      {item.status === 'Reviewed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                      ) : item.status === 'Pending Review' ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500 mr-2" />
                      )}
                      <span className="text-slate-600">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {item.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/counselor/cases/${item.id}`} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1 rounded shadow-sm transition-colors">
                      View Case
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
