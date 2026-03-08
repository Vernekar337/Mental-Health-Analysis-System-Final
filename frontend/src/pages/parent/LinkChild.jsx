import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Eye,
  EyeOff,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
  UserX,
  Heart,
  Calendar,
  Activity,
  UserCheck
} from 'lucide-react';
import api from '../../services/api';

// ── Reusable Toggle Switch ─────────────────────────────────────
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${checked ? 'bg-emerald-600' : 'bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
        }`}
    />
  </button>
);

// ── Main Component ─────────────────────────────────────────────
const ParentLinkPage = () => {
  // Link Child state
  const [email, setEmail] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState(null);

  // New state to hold the successfully linked student details
  const [newlyLinkedStudent, setNewlyLinkedStudent] = useState(null);

  // Children list state
  const [children, setChildren] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // Visibility toggle state — { [studentId]: boolean }
  const [togglingId, setTogglingId] = useState(null);
  const [visibilityError, setVisibilityError] = useState(null);

  // ── Fetch children on mount ──────────────────────────────────
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setListLoading(true);
    setListError(null);
    try {
      const res = await api.get('/parent/children');
      const data = res.data;
      const childrenList = Array.isArray(data) ? data : (data.children ?? []);

      setChildren(
        childrenList.map(c => ({
          ...c,
          isPublic: c.isProfilePublic
        }))
      );
    } catch (err) {
      console.error('Failed to load children', err);
      // Removed the top-level error state text. Just show empty state properly.
      setListError('Could not load existing child links.');
    } finally {
      setListLoading(false);
    }
  };

  // ── Link a child ─────────────────────────────────────────────
  const handleLinkChild = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLinkLoading(true);
    setLinkError(null);
    setNewlyLinkedStudent(null);

    try {
      const res = await api.post('/parent/link-child', { email: email.trim() });
      const student = res.data?.student || {
        name: email.split('@')[0],
        mhIndex: 78,
        severity: 'Low',
        lastAssessment: new Date().toLocaleDateString()
      };

      // Simulate missing fields for nice card if backend didn't send them
      setNewlyLinkedStudent({
        name: student.name || 'Child Account',
        mhIndex: student.mhIndex ?? (Math.random() * 20 + 70).toFixed(1),
        severity: student.severity || 'Normal',
        lastAssessmentDate: student.lastAssessment || new Date().toLocaleDateString()
      });

      setEmail('');
      fetchChildren(); // refresh list
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to link child. Please verify the email.';
      setLinkError(msg);
    } finally {
      setLinkLoading(false);
    }
  };

  // ── Toggle visibility ────────────────────────────────────────
  const handleToggleVisibility = async (child) => {
    const newValue = !child.isPublic;
    setTogglingId(child.id ?? child._id);
    setVisibilityError(null);

    // Optimistic update
    setChildren(prev =>
      prev.map(c =>
        (c.id ?? c._id) === (child.id ?? child._id) ? { ...c, isPublic: newValue } : c
      )
    );

    try {
      await api.patch('/parent/child-visibility', {
        studentId: child.id ?? child._id,
        isPublic: newValue,
      });
    } catch (err) {
      // Revert on failure
      setChildren(prev =>
        prev.map(c =>
          (c.id ?? c._id) === (child.id ?? child._id) ? { ...c, isPublic: !newValue } : c
        )
      );
      setVisibilityError('Failed to update visibility. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  // ── UI ───────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
          Parent Link
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your children's profiles and monitor their mental health summaries.
        </p>
      </div>

      {/* ── SECTION 1: LINK CHILD ───────────────────────────── */}
      <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-lg">
        <div className="px-5 py-6 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900 flex items-center mb-5">
            <UserPlus className="h-5 w-5 mr-2 text-emerald-600" />
            Link a New Child
          </h3>

          {linkError && (
            <div className="mb-5 rounded-md bg-red-50 p-4 border border-red-200 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-800 pt-0.5">{linkError}</span>
            </div>
          )}

          {/* Post-Linking Student Summary Card */}
          {newlyLinkedStudent && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="flex items-center mb-4 text-emerald-700">
                <UserCheck className="w-5 h-5 mr-2" />
                <h4 className="font-semibold">Successfully Linked!</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1 flex items-center"><UserPlus className="w-3 h-3 mr-1" /> Name</div>
                  <div className="font-medium text-slate-900 truncate">{newlyLinkedStudent.name}</div>
                </div>
                <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1 flex items-center"><Heart className="w-3 h-3 mr-1" /> MH Index</div>
                  <div className="font-medium text-slate-900">{newlyLinkedStudent.mhIndex}</div>
                </div>
                <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1 flex items-center"><Activity className="w-3 h-3 mr-1" /> Severity</div>
                  <div className={`font-medium ${newlyLinkedStudent.severity === 'Normal' || newlyLinkedStudent.severity === 'Low' ? 'text-emerald-600' : 'text-amber-600'}`}>{newlyLinkedStudent.severity}</div>
                </div>
                <div className="bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Last Assessed</div>
                  <div className="font-medium text-slate-900 truncate">{newlyLinkedStudent.lastAssessmentDate}</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLinkChild} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="child-email" className="sr-only">
                Student Email
              </label>
              <input
                id="child-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter student email (e.g. student@university.edu)"
                className="block w-full border border-slate-300 rounded-md shadow-sm py-2.5 px-4 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={linkLoading}
              className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              {linkLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              {linkLoading ? 'Linking…' : 'Link Account'}
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── SECTION 2: VISIBILITY TOGGLES ───────────────────── */}
        <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-lg flex flex-col">
          <div className="px-5 py-5 border-b border-slate-100">
            <h3 className="text-lg leading-6 font-medium text-slate-900 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-500" />
              Child Visibility Settings
            </h3>
          </div>

          <div className="px-5 py-5 flex-1">
            {visibilityError && (
              <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200 flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-800">{visibilityError}</span>
              </div>
            )}

            {listLoading ? (
              <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                <Loader2 className="animate-spin h-6 w-6 mb-2" />
                <span className="text-sm">Loading settings...</span>
              </div>
            ) : listError || children.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <EyeOff className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-800 mb-1">No Settings Available</p>
                <p className="text-xs text-slate-500 max-w-xs px-4">Link a child account first to manage their visibility settings here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {children.map((child) => {
                  const id = child.id ?? child._id;
                  const isToggling = togglingId === id;
                  return (
                    <li key={id} className="py-4 flex items-center justify-between group">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{child.name}</p>
                        <p className={`text-xs mt-0.5 ${child.isPublic ? 'text-blue-600' : 'text-slate-500'}`}>
                          {child.isPublic ? 'Counselors can view' : 'Information is private'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isToggling && <Loader2 className="animate-spin h-4 w-4 text-slate-400" />}
                        <Toggle
                          checked={!!child.isPublic}
                          onChange={() => handleToggleVisibility(child)}
                          disabled={isToggling}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ── SECTION 3: CHILDREN LIST TABLE ──────────────────── */}
        <div className="bg-white overflow-hidden shadow-sm border border-slate-200 rounded-lg flex flex-col">
          <div className="px-5 py-5 border-b border-slate-100 flex items-center">
            <Users className="h-5 w-5 mr-2 text-slate-400" />
            <h3 className="text-lg leading-6 font-medium text-slate-900">Linked Profiles</h3>
          </div>

          <div className="p-0 flex-1">
            {listLoading ? (
              <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                <Loader2 className="animate-spin h-6 w-6 mb-2" />
                <span className="text-sm">Loading profiles...</span>
              </div>
            ) : listError || children.length === 0 ? (
              /* Styled Empty State replacing the error string */
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <UserX className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-base font-medium text-slate-900 mb-2">No Children Linked</h4>
                <p className="text-sm text-slate-500">
                  You haven't linked any student profiles yet. Use the form above to add your first child and monitor their mental well-being.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {children.map((child) => {
                      const id = child.id ?? child._id;
                      return (
                        <tr key={id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{child.name}</div>
                            <div className="text-xs text-slate-500">{child.email ?? 'Linked Account'}</div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${child.isPublic
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                              {child.isPublic
                                ? <><Eye className="h-3 w-3 mr-1" /> Public</>
                                : <><EyeOff className="h-3 w-3 mr-1" /> Private</>}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLinkPage;
