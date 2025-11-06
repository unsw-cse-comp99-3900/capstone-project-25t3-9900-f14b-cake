'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/constants';

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
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
            // Decode Google ID token (JWT) to get email
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

            // Call backend /login API: pass Google's JWT token directly
            try {
              const loginResponse = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: email,
                  google_jwt: googleIdToken, // Google 返回的 JWT token，直接传给后端
                }),
              });

              if (!loginResponse.ok) {
                const errorData = await loginResponse.json().catch(() => ({}));
                setError(errorData.message || 'Login failed');
                return;
              }

              const loginData = await loginResponse.json();
              
              // Store the backend token
              localStorage.setItem('auth_token', loginData.token);
              
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

  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      {/* Top blue section */}
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

          {/* Decorative icons removed */}
        </div>
      </section>

      {/* Bottom auth area */}
      <section className="relative bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-0 w-full -mt-28 md:-mt-50">
          <div className="rounded-3xl border border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(2,6,23,0.25)] p-12 md:p-16">
            <div className="text-center mb-8">
              <h2 className="text-[32px] md:text-[36px] font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in with Google to continue</p>
            </div>

            <div className="space-y-10">
              <div className="flex justify-center">
                <div ref={googleBtnRef} />
              </div>

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
