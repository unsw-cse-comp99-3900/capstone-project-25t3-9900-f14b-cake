'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

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
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-3 border-b border-blue-100 bg-white/80 backdrop-blur shadow-sm">
      <div className="flex items-center gap-6">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-blue-50 text-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_back</span>
          </button>
        )}
        {title && (
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        )}
        {!showBackButton && !title && (
          <div className="flex items-center gap-6 text-base font-medium text-gray-800">
            <button 
              onClick={() => router.push('/home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <Image 
                src="/icon.png" 
                alt="AI Interview Coach" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-gray-900 text-lg font-semibold">AI Interview Coach</span>
            </button>
            {[
              { label: 'Home', href: '/home' },
              { label: 'Game', href: '/game' },
              { label: 'Progress', href: '/progress' },
              { label: 'Bank', href: '/bank' },
            ].map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`px-3 py-1.5 rounded-full transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {showUserButton && (
        <button
          onClick={() => router.push('/profile')}
          className="hover:text-blue-700 transition-colors"
          aria-label="Profile"
        >
          <span className="material-symbols-outlined text-gray-700" style={{ fontSize: 35 }}>account_circle</span>
        </button>
      )}
    </nav>
  );
}
