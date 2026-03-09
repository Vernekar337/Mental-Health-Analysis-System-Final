import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Search, AlertCircle, Heart, ChevronRight, Filter } from 'lucide-react';
import LoadingBoundary from '../../components/LoadingBoundary';

const AllCases = () => {

  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('All')

  useEffect(() => {

    const fetchCases = async () => {

      try {

        const response = await api.get('/counselor/cases');

        if (response.data && response.data.cases) {
          setCases(response.data.cases);
        } else {
          setCases([]);
        }

      } catch (err) {

        console.error("Failed to fetch cases", err)

      } finally {

        setLoading(false)

      }

    }

    fetchCases()

  }, [])

  const filteredCases = cases.filter((c) => {

    const matchesSearch =
      c.studentName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRisk = filterRisk === 'All' || c.severity === filterRisk;

    return matchesSearch && matchesRisk

  })

  if (loading) return <LoadingBoundary />

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div>
        <h2 className="text-3xl font-bold text-slate-900 flex items-center">
          <Users className="h-8 w-8 mr-3 text-emerald-600" />
          Student Cases
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Students who made their profiles visible to counselors.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex gap-4">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-md"
          />
        </div>

        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="border border-slate-300 rounded-md px-3"
        >
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCases.map((student) => (

          <div
            key={student.studentId}
            className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col"
          >

            <div className="flex justify-between mb-4">

              <h3 className="font-bold text-slate-900">
                {student.studentName}
              </h3>

              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold
                  ${student.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : student.severity === "Moderate"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"}
                `}
              >
                {student.severity}
              </span>

            </div>

            <div className="flex justify-between text-sm mb-2">

              <span className="text-slate-500 flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                MH Index
              </span>

              <span className="font-semibold">
                {student.mhIndex ?? "--"}
              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-slate-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Last Assessment
              </span>

              <span>
                {student.lastAssessmentDate
                  ? new Date(student.lastAssessmentDate).toLocaleDateString()
                  : "N/A"}
              </span>

            </div>

            <Link
              to={`/counselor/student/${student.studentId}`}
              className="mt-4 flex items-center justify-between text-emerald-600 font-medium text-sm"
            >
              View Profile
              <ChevronRight className="h-4 w-4" />
            </Link>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AllCases