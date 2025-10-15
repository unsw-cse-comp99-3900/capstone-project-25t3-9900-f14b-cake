'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';
import { authService } from '@/features/auth/services';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      // Call the actual login API
      const response = await authService.login({
        email,
        password,
      });

      // Use fetcher to set token with remember me option
      fetcher.setToken(response.token, remember);
      
      // Save user info separately
      if (response.user) {
        if (remember) {
          localStorage.setItem('username', response.user.name || response.user.email);
          localStorage.setItem('userEmail', response.user.email);
        } else {
          sessionStorage.setItem('username', response.user.name || response.user.email);
          sessionStorage.setItem('userEmail', response.user.email);
        }
      }

      router.push('/home');
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-16 rounded-2xl shadow-lg w-126">
        <h2 className="text-center text-3xl font-bold mb-10 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="mb-6">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              disabled={isLoading}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-base"
            >
              {isLoading ? 'Logging in...' : 'Login'}
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
