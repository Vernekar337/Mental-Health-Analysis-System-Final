import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import LoadingBoundary from '../../components/LoadingBoundary';

const CaseReview = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await api.get('/counselor/cases');
        setCases(response.data);
      } catch (err) {
        console.error("Failed to fetch cases");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  if (loading) return <LoadingBoundary />;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Case Review Queue</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all student cases requiring your attention.
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {cases.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              No active cases found.
            </li>
          ) : (
            cases.map((currCase) => (
              <li key={currCase.id || currCase._id}>
                <Link to={`/counselor/cases/${currCase.id || currCase._id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-emerald-600 truncate">
                        {currCase.studentName || "Student ID: " + currCase.studentId}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${currCase.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                            currCase.risk_level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}`}>
                          {currCase.risk_level || 'Low Risk'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <AlertCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Trigger: {currCase.triggerReason || 'Routine Check'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Generated {new Date(currCase.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                        <ChevronRight className="flex-shrink-0 ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CaseReview;
