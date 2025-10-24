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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome User!</h1>
                <p className="text-gray-600">Ready to land your next role as a Software Engineer? <span className="text-blue-600 cursor-pointer hover:underline">edit</span></p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Saved', count: 0, icon: 'bookmark', color: 'green' },
              { label: 'Applied', count: 0, icon: 'send', color: 'blue' },
              { label: 'Interview', count: 0, icon: 'headset_mic', color: 'purple' },
              { label: 'Offers', count: 0, icon: 'emoji_events', color: 'yellow' },
            ].map(({ label, count, icon, color }) => (
              <div key={label} className="modern-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    color === 'green' ? 'bg-green-100' :
                    color === 'blue' ? 'bg-blue-100' :
                    color === 'purple' ? 'bg-purple-100' :
                    'bg-yellow-100'
                  }`}>
                    <span className={`material-symbols-outlined text-${
                      color === 'green' ? 'green' :
                      color === 'blue' ? 'blue' :
                      color === 'purple' ? 'purple' :
                      'yellow'
                    }-600`} style={{ fontSize: 24 }}>{icon}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>

          {/* Main Action Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="modern-card p-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your Interview Practice</h2>
                <p className="text-gray-600 mb-8">Practice with AI, get instant feedback, and track your progress over time.</p>
                <button
                  onClick={() => router.push('/interview')}
                  className="btn-primary w-full py-4"
                >
                  Start an interview
                </button>
              </div>
            </div>

            <div className="modern-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent interviews</h3>
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{records.length} total</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {records.slice(0, 4).map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <span className="text-gray-700 font-medium">{record}</span>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
