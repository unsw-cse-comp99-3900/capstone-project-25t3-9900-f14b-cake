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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-1 py-20 pt-24">
        <button
          onClick={() => router.push('/interview')}
          className="px-10 py-4 border-2 border-gray-300 rounded-lg text-lg font-medium hover:border-blue-500 hover:bg-gray-50 transition-colors mb-12"
        >
          Start an interview
        </button>

        <div className="border-2 border-gray-300 rounded-xl p-6 w-96 max-h-96 overflow-y-auto shadow-inner">
          {records.map((record, index) => (
            <div
              key={index}
              className="border-2 border-gray-300 rounded-lg px-6 py-4 mb-4 text-center text-gray-700 text-base font-medium hover:border-blue-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {record}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
