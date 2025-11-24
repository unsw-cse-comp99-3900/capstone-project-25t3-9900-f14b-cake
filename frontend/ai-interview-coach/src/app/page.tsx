'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired, clearToken } from '@/lib/tokenManager';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check token expiration on mount
    if (isTokenExpired()) {
      clearToken();
      router.push('/login');
      return;
    }
    const checkInterval = setInterval(() => {
      if (isTokenExpired()) {
        clearToken();
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      }
    }, 5 * 60 * 1000);

    const token = getToken();
    const sessionToken = sessionStorage.getItem('auth_token');
    
    if (token || sessionToken) {
      router.push('/home');
    } else {
      router.push('/login');
    }

    return () => {
      clearInterval(checkInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}