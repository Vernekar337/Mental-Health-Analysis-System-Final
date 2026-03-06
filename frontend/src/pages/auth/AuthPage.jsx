import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Role → redirect map ───────────────────────────────────────
const ROLE_REDIRECT = {
  student: '/student/dashboard',
  Student: '/student/dashboard',
  parent: '/parent/report',
  Parent: '/parent/report',
  counselor: '/counselor/dashboard',
  Counselor: '/counselor/dashboard',
  admin: '/admin/dashboard',
  Admin: '/admin/dashboard',
};

// ── Shared input style ────────────────────────────────────────
const inputCls =
  'block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

// ── Main Component ────────────────────────────────────────────
const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Tab state
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Register form
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', age: '', role: 'student',
  });

  // Shared UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helpers
  const clearError = () => setError(null);

  const handleRedirect = (role) => {
    const dest = ROLE_REDIRECT[role] ?? '/student/dashboard';
    navigate(dest, { replace: true });
  };

  // ── POST helper ──────────────────────────────────────────────
  const postJSON = async (url, body) => {
    const res = await fetch(`http://localhost:5000${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'Request failed');
    return data;
  };

  // ── Fetch /api/auth/me to confirm role ───────────────────────
  const fetchMe = async (token) => {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  };

  // ── LOGIN ────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();

    const { email, password } = loginForm;
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const data = await postJSON('/api/auth/login', { email, password });
      const token = data.token;
      localStorage.setItem('token', token);

      // Verify via /me for the canonical role
      let role = data.role;
      try {
        const me = await fetchMe(token);
        role = me.role ?? role;
        login({ name: me.name, role }, token);
      } catch {
        login({ role }, token);
      }

      handleRedirect(role);
    } catch (err) {
      setError(err.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ─────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();

    const { name, email, password, age, role } = regForm;
    if (!name.trim() || !email.trim() || !password || !age) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const data = await postJSON('/api/auth/register', {
        name, email, password, age: Number(age), role,
      });
      const token = data.token;
      localStorage.setItem('token', token);

      let finalRole = data.role ?? role;
      try {
        const me = await fetchMe(token);
        finalRole = me.role ?? finalRole;
        login({ name: me.name, role: finalRole }, token);
      } catch {
        login({ name, role: finalRole }, token);
      }

      handleRedirect(finalRole);
    } catch (err) {
      setError(err.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">

      {/* Logo / brand */}
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-none">Mental Health</h1>
          <p className="text-xs text-slate-500 tracking-wide">Surveillance System</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); clearError(); }}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors focus:outline-none ${tab === t
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {t === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <div className="p-8">

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start bg-red-50 border border-red-200 rounded-md p-3">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* ── LOGIN FORM ──────────────────────────────────── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                <p className="text-sm text-gray-500 mb-6">Sign in to your account.</p>
              </div>

              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2"
              >
                {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Signing in…</> : 'Login'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('register'); clearError(); }}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ───────────────────────────────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} noValidate className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
                <p className="text-sm text-gray-500 mb-6">Join the system to get started.</p>
              </div>

              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={regForm.name}
                  onChange={(e) => setRegForm(f => ({ ...f, name: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={regForm.email}
                  onChange={(e) => setRegForm(f => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regForm.password}
                  onChange={(e) => setRegForm(f => ({ ...f, password: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    id="reg-age"
                    type="number"
                    required
                    min={1}
                    max={120}
                    placeholder="21"
                    value={regForm.age}
                    onChange={(e) => setRegForm(f => ({ ...f, age: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="reg-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    id="reg-role"
                    value={regForm.role}
                    onChange={(e) => setRegForm(f => ({ ...f, role: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="counselor">Counselor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2"
              >
                {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Creating account…</> : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('login'); clearError(); }}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Login
                </button>
              </p>
            </form>
          )}

        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Mental Health Surveillance System. All rights reserved.
      </p>
    </div>
  );
};

export default AuthPage;
