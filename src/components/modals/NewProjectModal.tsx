import React, { useState } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { useCreateProject } from '@/hooks/useProjects';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Forest Green', hex: '#4E7D65' },
  { name: 'Terracotta', hex: '#C9705E' },
  { name: 'Lavender', hex: '#8B8A9F' },
  { name: 'Ocean Slate', hex: '#4A7C94' },
  { name: 'Amber Gold', hex: '#B8860B' },
  { name: 'Sage Leaf', hex: '#6B8E23' },
];

const ICON_PRESETS = ['layout', 'coffee', 'book-open', 'folder', 'zap', 'star'];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].hex);
  const [selectedIcon, setSelectedIcon] = useState('layout');

  const createProjectMutation = useCreateProject();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createProjectMutation.mutateAsync({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      colorHex: selectedColor,
      icon: selectedIcon,
    });

    setTitle('');
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-border-subtle relative">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#3D5A40]" />
            <h3 className="text-base font-semibold text-stone-900">Create New Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile App Redesign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3D5A40] focus:bg-white transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Next Milestone / Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. Next: Architecture review · Friday"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3D5A40] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Theme Color
            </label>
            <div className="flex items-center gap-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  type="button"
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === color.hex ? 'scale-125 ring-2 ring-offset-2 ring-stone-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Icon Identifier
            </label>
            <div className="flex items-center gap-2">
              {ICON_PRESETS.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-all ${
                    selectedIcon === icon
                      ? 'border-[#3D5A40] bg-[#3D5A40]/10 text-[#3D5A40] font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProjectMutation.isPending || !title.trim()}
              className="px-5 py-2 bg-[#3D5A40] hover:bg-[#314833] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
            >
              {createProjectMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

