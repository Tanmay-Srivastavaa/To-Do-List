import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { PanelLeft, Search, Bell } from 'lucide-react';
import { CommandPalette } from '@/components/modals/CommandPalette';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface TopbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global hotkey: ⌘K or Ctrl+K opens Command Palette
  useKeyboardShortcut({ key: 'k', ctrlOrMeta: true }, () => {
    setIsSearchOpen(true);
  });

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Home';
    if (pathname === '/inbox') return 'Inbox';
    if (pathname === '/today') return 'Today';
    if (pathname === '/upcoming') return 'Upcoming';
    if (pathname === '/completed') return 'Completed';
    if (pathname.startsWith('/projects')) return 'Project Detail';
    return 'Dashboard';
  };

  return (
    <>
      <header className="h-14 px-6 flex items-center justify-between border-b border-stone-800/20 text-folio-canvasLight select-none">
        {/* Left: Sidebar Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg transition-colors ${
              !isSidebarOpen
                ? 'bg-white/15 text-white hover:bg-white/25 shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center text-xs text-stone-300 font-medium">
            <span className="text-stone-400 mr-1.5">/</span>
            <span className="text-white">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Right: Search, Notifications & Avatar */}
        <div className="flex items-center gap-4">
          {/* Global Search Pill Input */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl text-stone-300 hover:text-white text-xs transition-all shadow-inner w-56 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Search anything...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 text-stone-300 rounded border border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notification Bell */}
          <button
            className="relative p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C9705E] rounded-full ring-2 ring-canvas" />
          </button>

          {/* Profile Initial Pill */}
          <div className="w-7 h-7 rounded-full bg-[#E2E8D8] text-[#3D5A40] flex items-center justify-center font-bold text-xs ring-1 ring-white/20">
            AM
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

