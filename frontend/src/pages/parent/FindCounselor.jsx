import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { requestConsultation } from '../../services/api'
import { getCounselorDirectory } from '../../services/api';

const FindCounselor = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCounselors = async () => {

      try {

        const res = await getCounselorDirectory();

        setCounselors(res.data.counselors || []);

      } catch (error) {

        console.error("Failed to load counselors", error);

      } finally {

        setLoading(false);

      }

    };

    fetchCounselors();

  }, []);

  const handleRequest = async (counselorId) => {

    try {

      await requestConsultation(counselorId)

      alert("Consultation request sent successfully")

    } catch (error) {

      console.error(error)

      alert("Failed to send request")

    }

  }

  const filteredCounselors = counselors.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Find a Counselor
        </h1>

        <p className="text-slate-500 mt-1">
          Connect with mental health professionals for your child.
        </p>

      </div>

      {/* Search */}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 flex items-center">

        <Search className="w-5 h-5 ml-3 text-slate-400" />

        <input
          type="text"
          placeholder="Search counselor by name..."
          className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>

      {/* Loading */}

      {loading && (
        <div className="text-center text-slate-500">
          Loading counselors...
        </div>
      )}

      {/* Counselors Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCounselors.length === 0 && !loading && (

          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200 border-dashed">

            No counselors available.

          </div>

        )}

        {filteredCounselors.map(counselor => (

          <div
            key={counselor._id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col"
          >

            <div className="p-6 flex-1">

              <div className="flex items-start justify-between mb-4">

                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">

                  <User className="w-8 h-8 text-slate-400" />

                </div>

                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-sm font-medium">

                  <Star className="fill-current w-3.5 h-3.5 mr-1" />

                  4.8

                </div>

              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">

                {counselor.name}

              </h3>

              <p className="text-sm font-medium text-emerald-600 mb-4">

                Licensed Counselor

              </p>

              <div className="space-y-2 mb-4">

                <div className="flex items-center text-sm text-slate-600">

                  <User className="w-4 h-4 mr-2 text-slate-400" />

                  <span>{counselor.email}</span>

                </div>

                <div className="flex items-center text-sm text-slate-600">

                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />

                  <span>Online / Campus</span>

                </div>

                <div className="flex items-center text-sm text-slate-600">

                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />

                  <span>Available for consultation</span>

                </div>

              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">

              <button
                onClick={() => handleRequest(counselor._id)}
                className="w-full flex items-center justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >

                <MessageSquare className="w-4 h-4 mr-2" />

                Request Consultation

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );

};

export default FindCounselor;