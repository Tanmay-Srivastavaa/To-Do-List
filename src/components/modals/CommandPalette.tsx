import React, { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle2, Folder, Tag, X, CornerDownLeft } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects, useLabels } from '@/hooks/useProjects';
import { TaskItemData } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask?: (task: TaskItemData) => void;
  onSelectProject?: (projectId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTask,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tasksData } = useTasks({ search: query, includeCompleted: true });
  const { data: projectsData } = useProjects();
  const { data: labelsData } = useLabels();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tasks = tasksData?.tasks || [];
  const filteredProjects = (projectsData?.projects || []).filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredLabels = (labelsData?.labels || []).filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200">
          <Search className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[11px] font-mono bg-stone-100 text-stone-500 rounded border border-stone-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Projects
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject?.(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-stone-100 text-stone-800 text-sm group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.colorHex }}
                      />
                      <span className="font-medium">{p.title}</span>
                      {p.subtitle && (
                        <span className="text-xs text-stone-400">· {p.subtitle}</span>
                      )}
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Tasks ({tasks.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTask?.(t);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-stone-100 text-stone-800 text-sm group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          t.isCompleted ? 'text-[#4E7D65]' : 'text-stone-300'
                        }`}
                      />
                      <span
                        className={`truncate font-normal ${
                          t.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'
                        }`}
                      >
                        {t.title}
                      </span>
                      {t.project && (
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: t.project.colorHex }}
                          title={t.project.title}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {t.dueTime && (
                        <span className="text-xs text-stone-400">{t.dueTime}</span>
                      )}
                      <CornerDownLeft className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Labels */}
          {filteredLabels.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Labels
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredLabels.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center px-3 py-2 rounded-xl text-stone-800 text-sm"
                  >
                    <Tag className="w-4 h-4 text-stone-400 mr-2.5" />
                    <span className="font-medium">#{l.name}</span>
                    <span className="ml-2 text-xs text-stone-400">({l.taskCount} tasks)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && tasks.length === 0 && filteredLabels.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-400">
              No matching results found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          <span>Navigate with arrows</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

