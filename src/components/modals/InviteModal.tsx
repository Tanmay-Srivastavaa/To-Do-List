import React, { useState } from 'react';
import { X, Copy, Check, Users } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/invite?ref=folio-alex` : 'https://folio.app/invite';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-border-subtle relative">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#3D5A40]" />
            <h3 className="text-base font-semibold text-stone-900">Invite a Friend</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-stone-600 mb-4">
            Share the calm productivity of Folio. Anyone with this link can join your shared workspace.
          </p>

          <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-xl">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="bg-transparent text-xs text-stone-700 w-full px-2 py-1 outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3D5A40] hover:bg-[#314833] text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

