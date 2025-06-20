// pages/login.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
      });

      if (res.ok) {
        const login_res = await res.json();
        localStorage.setItem('user', JSON.stringify(login_res.user));
        router.push('/chat');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          type="email"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mb-2"
        >
          Log In
        </button>
        <p className="text-center text-sm">
          Don’t have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push('/register')}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
