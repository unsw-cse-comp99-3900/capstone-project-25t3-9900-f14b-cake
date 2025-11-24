'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/constants';
import { setToken } from '@/lib/tokenManager';

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useOtherEmail, setUseOtherEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          const googleIdToken = response?.credential as string | undefined;
          // console.log('Google JWT Token:', googleIdToken);
          // console.log('Full response:', response);
          if (!googleIdToken) {
            setError('Google sign-in failed');
            return;
          }
          try {
            let email = '';
            try {
              const payloadStr = atob(googleIdToken.split('.')[1] ?? '');
              const payload = JSON.parse(payloadStr);
              email = payload?.email || '';
              if (payload?.name) {
                localStorage.setItem('username', payload.name as string);
              }
              if (payload?.picture) {
                localStorage.setItem('avatar', payload.picture as string);
              }
              if (email) {
                localStorage.setItem('email', email);
              }
            } catch (_) {
              setError('Failed to decode Google token');
              return;
            }

            if (!email) {
              setError('Email not found in Google token');
              return;
            }

            try {
              const loginResponse = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: email,
                  google_jwt: googleIdToken
                }),
              });

              if (!loginResponse.ok) {
                const errorData = await loginResponse.json().catch(() => ({}));
                setError(errorData.message || 'Login failed');
                return;
              }

              const loginData = await loginResponse.json();
              
              // Store the backend token with timestamp
              setToken(loginData.token);
              
              // Store user_id if needed
              if (loginData.user_id) {
                localStorage.setItem('user_id', loginData.user_id);
              }

              router.push('/home');
            } catch (e: any) {
              console.error('Backend login error:', e);
              setError('Failed to authenticate with server: ' + (e.message || 'Unknown error'));
            }
          } catch (e: any) {
            setError('Failed to process login: ' + (e.message || 'Unknown error'));
          }
        },
        auto_select: false,
        ux_mode: 'popup',
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  const handleOtherEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginResponse = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          google_jwt: 'text', 
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        setError(errorData.message || 'Login failed');
        setLoading(false);
        return;
      }

      const loginData = await loginResponse.json();
      
      // Store the backend token with timestamp
      setToken(loginData.token);
      
      if (loginData.user_id) {
        localStorage.setItem('user_id', loginData.user_id);
      }

      localStorage.setItem('email', email);

      router.push('/home');
    } catch (e: any) {
      console.error('Backend login error:', e);
      setError('Failed to authenticate with server: ' + (e.message || 'Unknown error'));
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      <section className="relative bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 min-h-[45vh] flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/15">
              <Image src="/icon.png" alt="AI Interview Coach" width={18} height={18} className="rounded" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">AI Interview Coach</h1>
          </div>
          <p className="mx-auto max-w-3xl text-center text-blue-100/90 text-lg md:text-xl">
            Stop job hunting the old way. Start with AI — get hired fast.
          </p>

        </div>
      </section>

      <section className="relative bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-0 w-full -mt-28 md:-mt-50">
          <div className="rounded-3xl border border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(2,6,23,0.25)] p-12 md:p-16">
            <div className="text-center mb-8">
              <h2 className="text-[32px] md:text-[36px] font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">
                {useOtherEmail ? 'Sign in with your email' : 'Sign in with Google to continue'}
              </p>
            </div>

            <div className="space-y-6">
              {!useOtherEmail ? (
                <>
                  <div className="flex justify-center">
                    <div ref={googleBtnRef} />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setUseOtherEmail(true)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Use other email
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleOtherEmailLogin();
                          }
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={handleOtherEmailLogin}
                      disabled={loading || !email}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <button
                      onClick={() => {
                        setUseOtherEmail(false);
                        setEmail('');
                        setError(null);
                      }}
                      className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      Back to Google sign in
                    </button>
                  </div>
                </>
              )}

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <p className="text-center text-[11px] md:text-xs text-slate-500">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
