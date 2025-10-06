'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline'; // ✅ 使用 Heroicons

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
      {/* 顶部导航栏 */}
      <nav className="flex justify-between items-center px-10 py-4 border-b border-gray-300">
        <div className="flex space-x-8 text-lg font-medium text-gray-800">
          <button className="hover:text-blue-600 transition-colors">logo</button>
          <button className="hover:text-blue-600 transition-colors">game</button>
          <button className="hover:text-blue-600 transition-colors">progress</button>
          <button className="hover:text-blue-600 transition-colors">bank</button>
        </div>
        <button
          onClick={() => router.push('/profile')}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <UserIcon className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      {/* 主体内容 */}
      <main className="flex flex-col items-center justify-center flex-1 py-20">
        {/* Start 按钮 */}
        <button
          onClick={() => alert('Starting a new interview...')}
          className="px-10 py-4 border-2 border-gray-300 rounded-lg text-lg font-medium hover:border-blue-500 hover:bg-gray-50 transition-colors mb-12"
        >
          Start an interview
        </button>

        {/* Interview Record 区域 */}
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
