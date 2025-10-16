'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert(`Registered as ${name}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-16 rounded-2xl shadow-lg w-126">
        <h2 className="text-center text-3xl font-bold mb-10 text-gray-800">
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-4 text-base border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 text-base border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-8">
            <input
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-5 py-4 text-base border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-base"
          >
            Register
          </button>
        </form>
        <button
          onClick={() => router.push('/login')}
          className="w-full mt-6 py-4 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-blue-500 transition-colors text-base font-medium"
        >
          go to login
        </button>
      </div>
    </div>
  );
}
