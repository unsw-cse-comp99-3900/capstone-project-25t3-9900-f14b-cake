'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

import type { NavbarProps } from "./type";

export default function Navbar({ 
  showBackButton = false, 
  title = '', 
  showUserButton = true 
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center gap-6">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_back</span>
          </button>
        )}
        {title && (
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        )}
        {!showBackButton && !title && (
          <div className="flex items-center gap-6 text-base font-medium text-gray-800">
            <button 
              onClick={() => router.push('/home')}
              className="flex items-center gap-3 hover:opacity-80 transition-all duration-200"
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
              { label: 'Home', href: '/home', icon: 'home' },
              { label: 'Game', href: '/game', icon: 'sports_esports' },
              { label: 'Progress', href: '/progress', icon: 'trending_up' },
              { label: 'History', href: '/bank/history', icon: 'history' },
            ].map(({ label, href, icon }) => {
              const isActive = href === '/bank/history' 
                ? pathname.startsWith('/bank')
                : pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {showUserButton && (
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-200">
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>notifications</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
            <span className="text-gray-700 font-medium hidden md:block">User</span>
          </div>
        </div>
      )}
    </nav>
  );
}
