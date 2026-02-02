import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { getParentAlerts, acknowledgeAlert } from '../../services/api';

const ParentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getParentAlerts();
      setAlerts(res.data);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeAlert(id);
      // Optimistically update UI
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    } catch (error) {
      console.error("Failed to acknowledge alert", error);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle className="w-5 h-5 text-red-600" />, text: 'text-red-800' };
      case 'medium':
        return { bg: 'bg-amber-50', border: 'border-amber-200', icon: <Info className="w-5 h-5 text-amber-600" />, text: 'text-amber-800' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', icon: <Info className="w-5 h-5 text-blue-600" />, text: 'text-blue-800' };
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Alerts...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
          <Bell className="w-8 h-8 mr-3 text-slate-700" />
          Alerts & Notifications
        </h1>
        <p className="text-slate-500 mt-1 ml-11">Important updates regarding your child's well-being.</p>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 && (
          <div className="text-center py-10 text-slate-400 bg-white rounded-lg border border-slate-200">
            No new alerts.
          </div>
        )}

        {alerts.map((alert) => {
          const style = getSeverityStyles(alert.severity);
          return (
            <div key={alert.id} className={`p-6 rounded-lg border shadow-sm transition-all ${style.bg} ${style.border}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0">
                    {style.icon}
                  </div>
                  <div>
                    <p className={`font-semibold ${style.text} mb-1`}>
                      {alert.severity.toUpperCase()} PRIORITY
                    </p>
                    <p className="text-slate-800 font-medium text-lg">
                      {alert.message}
                    </p>
                    <div className="flex items-center text-slate-500 text-xs mt-3">
                      <Clock className="w-3 h-3 mr-1" />
                      {alert.timestamp}
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  {alert.acknowledged ? (
                    <div className="flex items-center text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Acknowledged</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParentAlerts;
