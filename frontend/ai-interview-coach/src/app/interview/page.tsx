'use client';

import Navbar from '@/components/Navbar';

export default function InterviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 p-10 pt-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">AI Interview</h2>
        <p className="text-lg text-gray-600">Start your AI-powered mock interview</p>
      </main>
    </div>
  );
}
