import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await api.post("/auth/login", {
        email,
        password
      });

      const { token, role, name } = res.data;

      login({ role, name }, token);

      if (role === "student") navigate("/student/dashboard");
      if (role === "parent") navigate("/parent/report");
      if (role === "counselor") navigate("/counselor/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.message || "Login failed"
      );

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          Login
        </h2>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>

  );

};

export default Login;