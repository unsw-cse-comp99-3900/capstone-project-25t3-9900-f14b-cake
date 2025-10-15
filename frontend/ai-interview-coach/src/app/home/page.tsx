'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const router = useRouter();
  const [records] = useState([
    'Interview Record 1',
    'Interview Record 2',
    'Interview Record 3',
    'Interview Record 4',
    'Interview Record 5',
    'Interview Record 6',
    'Interview Record 7',
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-blue-50">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 py-20 pt-24 px-6">
        <section className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-700">
            Elevate your interview performance
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Practice with AI, get instant feedback, and track your progress over time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => router.push('/interview')}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white text-base font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              Start an interview
            </button>
          </div>
        </section>

        <section className="w-full max-w-xl">
          <div className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent interviews</h2>
              <span className="text-sm text-blue-600">{records.length} total</span>
            </div>
            <div className="max-h-96 overflow-y-auto pr-1">
              {records.map((record, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between border border-gray-100 hover:border-blue-200 rounded-xl px-4 py-3 mb-3 text-gray-700 text-sm md:text-base cursor-pointer hover:bg-blue-50/50 transition-colors"
                >
                  <span className="truncate">{record}</span>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 text-xl">chevron_right</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
