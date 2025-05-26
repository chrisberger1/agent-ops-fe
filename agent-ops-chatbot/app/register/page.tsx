// pages/register.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department_id: '',
    designation_id: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/login'); // Redirect to login page after successful registration
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium">Department</label>
          <select
            name="department_id"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Department</option>
            <option value="1">Digital Engineering</option>
            <option value="2">AI & Data</option>
          </select>
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium">Designation</label>
          <select
            name="designation_id"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Designation</option>
            <option value="1">Staff</option>
            <option value="2">Senior Consultant</option>
            <option value="3">Manager</option>
            <option value="4">Senior Manager</option>
          </select>
        </div>
        <button
          onClick={handleRegister}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Register
        </button>
      </div>
    </div>
  );
}
