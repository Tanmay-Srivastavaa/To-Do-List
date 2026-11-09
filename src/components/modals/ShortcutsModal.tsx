import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ K / Ctrl+K', description: 'Open search and command palette' },
    { key: '⌘ N / Ctrl+N', description: 'Quick-add new task' },
    { key: 'Esc', description: 'Close modals & menus' },
    { key: 'Space', description: 'Toggle task complete (when focused)' },
    { key: 'Enter', description: 'Submit new task / comment' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-border-subtle relative">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-stone-600" />
            <h3 className="text-base font-semibold text-stone-900">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-stone-100 mt-2">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 text-sm">
              <span className="text-stone-600">{s.description}</span>
              <kbd className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-md text-xs font-mono text-stone-700 font-semibold shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

