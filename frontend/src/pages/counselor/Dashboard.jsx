import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, AlertTriangle, CheckSquare, Loader2 } from 'lucide-react';
import LoadingBoundary from '../../components/LoadingBoundary';

const CounselorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Assuming an endpoint for counselor stats exists, or we fetch cases and count
        // "GET /api/counselor/cases" returns list.
        const response = await api.get('/counselor/cases');
        const cases = response.data;

        setStats({
          total: cases.length,
          pending: cases.filter(c => c.status === 'pending').length,
          highRisk: cases.filter(c => c.risk_level === 'High').length
        });
      } catch (err) {
        console.error("Stats fetch error", err);
        // Fallback stats or error state
        setStats({ total: 0, pending: 0, highRisk: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingBoundary />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Counselor Dashboard</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Assigned Cases</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Risk Cases</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.highRisk}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.pending}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/counselor/cases"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
        >
          View Case Queue
        </Link>
      </div>
    </div>
  );
};

export default CounselorDashboard;
