import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Eye,
  EyeOff,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

// ── Reusable Toggle Switch ─────────────────────────────────────
const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${checked ? 'bg-emerald-600' : 'bg-gray-200'
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
  const [linkSuccess, setLinkSuccess] = useState(null);

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
      // Accept either { children: [...] } or a bare array
      setChildren(Array.isArray(data) ? data : (data.children ?? []));
    } catch (err) {
      console.error('Failed to load children', err);
      setListError('Failed to load linked children. Please refresh.');
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
    setLinkSuccess(null);

    try {
      const res = await api.post('/parent/link-child', { email: email.trim() });
      const { student } = res.data;
      setLinkSuccess(`${student?.name ?? 'Child'} linked successfully!`);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Parent Link
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your children's profiles and monitor their mental health summaries.
        </p>
      </div>

      {/* ── SECTION 1: LINK CHILD ───────────────────────────── */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
            <UserPlus className="h-5 w-5 mr-2 text-emerald-600" />
            Link Child
          </h3>

          {linkError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200 flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-800">{linkError}</span>
            </div>
          )}
          {linkSuccess && (
            <div className="mb-4 rounded-md bg-emerald-50 p-3 border border-emerald-200 flex items-start">
              <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-emerald-800">{linkSuccess}</span>
            </div>
          )}

          <form onSubmit={handleLinkChild} className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="child-email" className="block text-sm font-medium text-gray-700 mb-1">
                Student Email
              </label>
              <input
                id="child-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={linkLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {linkLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                {linkLoading ? 'Linking…' : 'Link Child'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── SECTION 2: VISIBILITY TOGGLES ───────────────────── */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
            <Eye className="h-5 w-5 mr-2 text-blue-500" />
            Child Visibility
          </h3>

          {visibilityError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200 flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-800">{visibilityError}</span>
            </div>
          )}

          {listLoading ? (
            <div className="flex items-center text-gray-500 text-sm py-4">
              <Loader2 className="animate-spin h-4 w-4 mr-2" /> Loading children…
            </div>
          ) : children.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-2">No linked children yet. Link a child above.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {children.map((child) => {
                const id = child.id ?? child._id;
                const isToggling = togglingId === id;
                return (
                  <li key={id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{child.name}</p>
                      <p className="text-xs text-gray-500">{child.isPublic ? 'Profile is Public' : 'Profile is Private'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isToggling && <Loader2 className="animate-spin h-4 w-4 text-gray-400" />}
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
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <Users className="h-5 w-5 mr-2 text-gray-400" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">Linked Children</h3>
        </div>

        {listLoading ? (
          <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
            <Loader2 className="animate-spin h-5 w-5 mr-2" /> Loading…
          </div>
        ) : listError ? (
          <div className="p-6">
            <div className="rounded-md bg-red-50 p-3 border border-red-200 flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-800">{listError}</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Child Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MH Index</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {children.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-sm text-gray-500 italic">
                      No linked children. Use the form above to link your child's account.
                    </td>
                  </tr>
                ) : (
                  children.map((child) => {
                    const id = child.id ?? child._id;
                    return (
                      <tr key={id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{child.name}</div>
                          <div className="text-xs text-gray-500">{child.email ?? ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          {child.mhIndex ?? child.mh_index ?? '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${child.isPublic
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {child.isPublic
                              ? <><Eye className="h-3 w-3 mr-1" /> Public</>
                              : <><EyeOff className="h-3 w-3 mr-1" /> Private</>}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentLinkPage;
