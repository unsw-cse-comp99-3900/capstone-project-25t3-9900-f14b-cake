'use client';

import Navbar from '@/components/Navbar';

export default function BankPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 p-10 pt-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Question Bank</h2>
        <p className="text-lg text-gray-600">Browse and practice various interview questions</p>
      </main>
    </div>
  );
}
