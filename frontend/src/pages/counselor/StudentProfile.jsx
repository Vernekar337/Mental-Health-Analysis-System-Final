import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import { ArrowLeft, User, Heart, Send } from 'lucide-react'
import LoadingBoundary from '../../components/LoadingBoundary'

const StudentProfile = () => {

  const { studentId } = useParams()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await api.get(`/counselor/case/${studentId}`)

        setProfile(res.data)

      } catch (err) {

        console.error(err)

      } finally {

        setLoading(false)

      }

    }

    fetchProfile()

  }, [studentId])


  const submitSuggestion = async (e) => {

    e.preventDefault()

    if (!suggestion.trim()) return

    try {

      await api.post("/counselor/suggestion", {
        studentId,
        message: suggestion
      })

      setSuggestion("")

      alert("Suggestion submitted")

    } catch (err) {

      console.error(err)

    }

  }

  if (loading) return <LoadingBoundary />

  if (!profile) return <div>No profile</div>

  const { student, analysis, assessments, suggestions } = profile

  return (

    <div className="max-w-6xl mx-auto space-y-6">

      <Link
        to="/counselor/cases"
        className="flex items-center text-sm text-slate-500"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to cases
      </Link>

      <div className="bg-white border rounded-lg p-6">

        <h2 className="text-2xl font-bold mb-2">
          {student.name}
        </h2>

        <p className="text-sm text-slate-500">
          Student ID: {student.id}
        </p>

        <div className="mt-4 flex gap-6">

          <div>
            <p className="text-sm text-slate-500">MH Index</p>
            <p className="text-2xl font-bold">
              {analysis?.mhIndex ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Severity</p>
            <p className="font-semibold">
              {assessments?.[0]?.severity ?? "Unknown"}
            </p>
          </div>

        </div>

      </div>

      {/* Suggestions */}

      <div className="bg-white border rounded-lg p-6">

        <h3 className="font-bold mb-4">
          Add Recommendation
        </h3>

        <form onSubmit={submitSuggestion}>

          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={4}
            className="w-full border rounded-md p-2 mb-3"
          />

          <button
            className="bg-emerald-600 text-white px-4 py-2 rounded-md"
          >
            Post Suggestion
          </button>

        </form>

      </div>

      {/* Past suggestions */}

      <div className="bg-white border rounded-lg p-6">

        <h3 className="font-bold mb-4">
          Previous Suggestions
        </h3>

        {(suggestions || []).map((s) => (
          <div
            key={s._id}
            className="border-b py-3"
          >
            <p>{s.message}</p>
            <span className="text-xs text-slate-500">
              {s.counselorId?.name}
            </span>
          </div>
        ))}

      </div>

    </div>

  )

}

export default StudentProfile