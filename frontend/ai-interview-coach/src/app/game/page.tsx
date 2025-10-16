'use client';

import Navbar from '@/components/Navbar';

export default function GamePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 p-10 pt-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Mode</h2>
        <p className="text-lg text-gray-600">Practice interview skills through gamification</p>
      </main>
    </div>
  );
}