import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

export const UserDropdown: React.FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'Alex Morgan';
  const planType = (session?.user as any)?.planType || 'Personal plan';
  const userImage = session?.user?.image;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-200/60 transition-colors text-left group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-stone-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E2E8D8] text-[#3D5A40] flex items-center justify-center font-semibold text-xs border border-stone-200">
              AM
            </div>
          )}
          <div className="min-w-0">
            <div className="text-xs font-semibold text-stone-900 truncate">
              {userName}
            </div>
            <div className="text-[11px] text-stone-500 truncate">
              {planType}
            </div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1.5 w-full bg-white rounded-xl shadow-xl border border-border-subtle p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-stone-100 mb-1">
            <div className="text-xs font-semibold text-stone-900">{userName}</div>
            <div className="text-[11px] text-stone-500 truncate">{session?.user?.email || 'alex.morgan@example.com'}</div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: '/login' });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

