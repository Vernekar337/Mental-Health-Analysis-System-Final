import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Calendar, Mail, User, Check, Trash2, Clock } from 'lucide-react';

const ConsultationRequests = () => {
  // We will use mock data for demonstration since the API endpoint might not be fully wired up
  const mockRequests = [
    {
      id: 1,
      parentName: 'Robert Johnson',
      parentEmail: 'robert.j@example.com',
      studentName: 'Alex Johnson',
      message: 'I would like to discuss the recent drop in Alex\'s mental health index and the recommended therapies mentioned in the latest report.',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'pending'
    },
    {
      id: 2,
      parentName: 'Mary Smith',
      parentEmail: 'mary.smith88@example.com',
      studentName: 'Sarah Smith',
      message: 'Sarah has been mentioning high academic stress. Can we arrange a brief consultation next Tuesday afternoon?',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: 'pending'
    }
  ];

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Assuming an endpoint exists. For now, we seed with mock data.
        // const response = await api.get('/counselor/consultation-requests');
        // setRequests(response.data);

        // Simulating network delay
        setTimeout(() => {
          setRequests(mockRequests);
          setLoading(false);
        }, 500);

      } catch (err) {
        console.error("Failed to fetch requests", err);
        setRequests(mockRequests);
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = (id) => {
    // In reality, logic to send an email / schedule meeting
    setRequests(prev => prev.filter(req => req.id !== id));
    // Show perhaps a toast notification here
  };

  const handleDecline = (id) => {
    // Remove from list
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Loading consultation requests...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate flex items-center">
          <MessageSquare className="h-8 w-8 mr-3 text-emerald-600" />
          Consultation Requests
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review and respond to parent requests for student consultations.
        </p>
      </div>

      {/* Notification-style List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 mb-4">
              <Check className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-900">All Caught Up</p>
            <p className="text-sm">You have no pending consultation requests.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{req.parentName}</h3>
                    <span className="flex items-center text-xs text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(req.timestamp)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" />
                      <a href={`mailto:${req.parentEmail}`} className="hover:text-emerald-600 transition-colors">{req.parentEmail}</a>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      <span>Regarding: <span className="font-semibold text-slate-800">{req.studentName}</span></span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-md border border-slate-100 text-slate-700 text-sm italic">
                    "{req.message}"
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-1">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept & Contact
                  </button>
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-slate-400" />
                    Dismiss
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ConsultationRequests;
