import React, { useState, useRef, useEffect } from 'react';
import { Plus, Flag, Clock, Folder, CornerDownLeft, X, Loader2 } from 'lucide-react';
import { useCreateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

interface QuickAddTaskProps {
  defaultSection?: 'PRIORITIES' | 'UP_NEXT' | 'INBOX';
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({ defaultSection = 'UP_NEXT' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [section, setSection] = useState<'PRIORITIES' | 'UP_NEXT' | 'INBOX'>(defaultSection);
  const [dueTime, setDueTime] = useState('Today');
  const [priorityFlag, setPriorityFlag] = useState<'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'>('NONE');

  const inputRef = useRef<HTMLInputElement>(null);
  const createTaskMutation = useCreateTask();
  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];

  // Global hotkey: ⌘N or Ctrl+N opens quick-add
  useKeyboardShortcut({ key: 'n', ctrlOrMeta: true }, () => {
    setIsExpanded(true);
  });

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTaskMutation.mutateAsync({
      title: title.trim(),
      projectId: projectId || null,
      section,
      dueTime: dueTime || null,
      priorityFlag,
    });

    setTitle('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-stone-50/60 rounded-b-2xl cursor-pointer transition-colors text-stone-500 hover:text-stone-800 border-t border-border-subtle group"
      >
        <div className="flex items-center gap-3 text-xs sm:text-sm font-normal">
          <Plus className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
          <span>Add a task to your day</span>
        </div>
        <kbd className="px-2 py-0.5 text-[10px] font-mono bg-stone-100 text-stone-400 rounded border border-stone-200 group-hover:text-stone-600 transition-colors">
          ⌘N
        </kbd>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-b-2xl border-t border-border-subtle space-y-3 animate-in fade-in duration-150"
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 bg-transparent outline-none font-medium"
        />
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick selection chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project selector */}
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg border-none text-xs outline-none cursor-pointer"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Section selector */}
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as any)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg border-none text-xs outline-none cursor-pointer"
          >
            <option value="PRIORITIES">Priorities</option>
            <option value="UP_NEXT">Up Next</option>
            <option value="INBOX">Inbox</option>
          </select>

          {/* Due time selector */}
          <input
            type="text"
            placeholder="Time (e.g. 10:00 AM)"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-28 px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg text-xs outline-none"
          />

          {/* Priority selector */}
          <select
            value={priorityFlag}
            onChange={(e) => setPriorityFlag(e.target.value as any)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg border-none text-xs outline-none cursor-pointer"
          >
            <option value="NONE">No Flag</option>
            <option value="HIGH">High Priority (Red)</option>
            <option value="MEDIUM">Medium Priority (Amber)</option>
            <option value="LOW">Low Priority (Blue)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-3 py-1 text-stone-500 hover:bg-stone-100 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || createTaskMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3D5A40] hover:bg-[#314833] text-white rounded-lg text-xs font-medium shadow-xs disabled:opacity-50"
          >
            {createTaskMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="w-3.5 h-3.5" />
            )}
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

