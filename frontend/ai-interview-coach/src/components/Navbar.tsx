'use client';

import { useRouter } from 'next/navigation';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  showBackButton?: boolean;
  title?: string;
  showUserButton?: boolean;
}

export default function Navbar({ 
  showBackButton = false, 
  title = '', 
  showUserButton = true 
}: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 border-b border-gray-300 bg-white">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
        )}
        {title && (
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        )}
        {!showBackButton && !title && (
          <div className="flex space-x-8 text-lg font-medium text-gray-800">
            <button 
              onClick={() => router.push('/home')}
              className="hover:text-blue-600 transition-colors"
            >
              logo
            </button>
            <button 
              onClick={() => router.push('/home')}
              className="hover:text-blue-600 transition-colors"
            >
              home
            </button>
            <button 
              onClick={() => router.push('/game')}
              className="hover:text-blue-600 transition-colors"
            >
              game
            </button>
            <button 
              onClick={() => router.push('/progress')}
              className="hover:text-blue-600 transition-colors"
            >
              progress
            </button>
            <button 
              onClick={() => router.push('/bank')}
              className="hover:text-blue-600 transition-colors"
            >
              bank
            </button>
          </div>
        )}
      </div>
      
      {showUserButton && (
        <button
          onClick={() => router.push('/profile')}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <UserIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </nav>
  );
}
