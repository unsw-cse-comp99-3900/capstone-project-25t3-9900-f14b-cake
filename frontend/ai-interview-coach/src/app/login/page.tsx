'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Page Title */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Image 
              src="/icon.png" 
              alt="AI Interview Coach" 
              width={32} 
              height={32}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">AI Interview Coach</h1>
        </div>
        <p className="text-gray-600 text-lg">Your personal interview preparation assistant</p>
      </div>
      
      <div className="modern-card p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your interview preparation</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 scale-125"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <button
            onClick={() => router.push('/register')}
            className="btn-secondary w-full"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
