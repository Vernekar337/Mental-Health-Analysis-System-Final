import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    role: "student"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      await api.post("/auth/register", form);

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message || "Registration failed"
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
          Register
        </h2>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="counselor">Counselor</option>
        </select>

        <button
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

      </form>

    </div>

  );

};

export default Register;