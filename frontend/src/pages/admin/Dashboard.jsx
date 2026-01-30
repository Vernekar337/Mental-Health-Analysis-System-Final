import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingBoundary from '../../components/LoadingBoundary';
import { Users, FileText, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get('/admin/overview');
        setStats(response.data);
      } catch (err) {
        console.error("Admin stats error", err);
        // Fallback default
        setStats({ totalUsers: 0, activeCases: 0, resolvedCases: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <LoadingBoundary />;

  const chartData = [
    { name: 'Active', count: stats.activeCases || 0 },
    { name: 'Resolved', count: stats.resolvedCases || 0 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <Users className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <FileText className="h-8 w-8 text-amber-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Active Cases</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeCases}</p>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
          <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm font-medium text-gray-500">Resolved</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.resolvedCases}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Case Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="count" fill="#10B981" barSize={40} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
