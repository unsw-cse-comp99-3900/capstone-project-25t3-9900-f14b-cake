'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simulating user authentication logic
    if (name && password) {
      // Store username for display purposes
      if (remember) {
        localStorage.setItem('username', name);
        localStorage.setItem('auth_token', 'authenticated'); // Add auth marker
      } else {
        sessionStorage.setItem('username', name);
        sessionStorage.setItem('auth_token', 'authenticated'); // Add auth marker
      }

      router.push('/home');
    } else {
      alert('Please enter both name and password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">AI Interview Coach</h1>
        <p className="text-gray-600 text-center">Your personal interview preparation assistant</p>
      </div>
      
      <div className="bg-white p-16 rounded-2xl shadow-lg w-126">
        <h2 className="text-center text-3xl font-bold mb-10 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin}>
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
          <div className="flex items-center justify-between mb-8">
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-base"
            >
              Login
            </button>
            <label className="text-base flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 scale-125"
              />
              remember me
            </label>
          </div>
        </form>
        <button
          onClick={() => router.push('/register')}
          className="w-full py-4 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-blue-500 transition-colors text-base font-medium"
        >
          go to register
        </button>
      </div>
    </div>
  );
}
