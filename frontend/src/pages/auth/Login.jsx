import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // Mock login
    login({ role: role, name: role === 'Student' ? 'Demo Student' : role === 'Parent' ? 'Parent User' : 'Dr. Smith' }, 'mock-token');

    if (role === 'Student') navigate('/student/dashboard');
    else if (role === 'Counselor') navigate('/counselor/dashboard');
    else if (role === 'Parent') navigate('/parent/report');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Login</h2>
        <div className="space-y-3">
          <button onClick={() => handleLogin('Student')} className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-medium">
            Login as Student (Demo)
          </button>
          <button onClick={() => handleLogin('Counselor')} className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-900 font-medium">
            Login as Counselor (Demo)
          </button>
          <button onClick={() => handleLogin('Parent')} className="w-full bg-slate-500 text-white py-2 rounded hover:bg-slate-600 font-medium">
            Login as Parent (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
