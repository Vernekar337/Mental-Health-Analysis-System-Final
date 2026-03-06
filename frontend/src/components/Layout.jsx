import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Activity, LogOut, Menu, Clock, MessageSquare, Bell, Mic, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">Mental Health<span className="text-slate-400 text-sm block font-normal">Surveillance System</span></h1>
          {user && <span className="text-xs text-slate-500 mt-2 block uppercase tracking-wider">{user.role} Portal</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {user?.role === 'Student' && (
            <>
              <Link to="/student/dashboard" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/dashboard') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link to="/student/assessments" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/assessments') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Activity className="w-5 h-5 mr-3" />
                Assessments
              </Link>
              <Link to="/student/report" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/report') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-5 h-5 mr-3" />
                Reports
              </Link>
              <Link to="/student/history" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/history') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Clock className="w-5 h-5 mr-3" />
                History
              </Link>
              <Link to="/student/reflection" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/reflection') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Activity className="w-5 h-5 mr-3" />
                Reflection
              </Link>
              <Link to="/student/relax" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/relax') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <MessageSquare className="w-5 h-5 mr-3" />
                Relax Room
              </Link>
              <Link to="/student/audio-diary" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/student/audio-diary') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Mic className="w-5 h-5 mr-3" />
                Audio Diary
              </Link>
            </>
          )}

          {user?.role === 'Counselor' && (
            <>
              <Link to="/counselor/dashboard" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/counselor/dashboard') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Home className="w-5 h-5 mr-3" />
                Case Dashboard
              </Link>
              <Link to="/counselor/cases" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/counselor/cases') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-5 h-5 mr-3" />
                All Cases
              </Link>
              <Link to="/counselor/cases" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname.startsWith('/counselor/student') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Users className="w-5 h-5 mr-3" />
                Student Profiles
              </Link>
            </>
          )}

          {user?.role === 'Parent' && (
            <>
              <Link to="/parent/report" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/parent/report') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-5 h-5 mr-3" />
                Student Report
              </Link>
              <Link to="/parent/alerts" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/parent/alerts') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Bell className="w-5 h-5 mr-3" />
                Alerts
              </Link>
              <Link to="/parent/link-child" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/parent/link-child') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <UserPlus className="w-5 h-5 mr-3" />
                Link Child
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center px-4 py-2 text-slate-400 hover:text-white w-full transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 md:hidden flex justify-between items-center">
          <span className="font-bold text-slate-800">MH System</span>
          <button className="text-slate-600"><Menu /></button>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
