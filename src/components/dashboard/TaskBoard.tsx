import React, { useState } from 'react';
import { ArrowUpDown, MoreHorizontal, ChevronRight, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from './TaskItem';
import { QuickAddTask } from './QuickAddTask';
import { TaskDetailModal } from '@/components/modals/TaskDetailModal';
import { TaskItemData } from '@/types';

type SortOption = 'default' | 'priority' | 'time' | 'title';

export const TaskBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'by-project'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItemData | null>(null);

  const { data: activeTasksData, isLoading: isLoadingActive } = useTasks({ view: 'home' });
  const { data: completedTasksData } = useTasks({ view: 'completed' });

  const activeTasks = activeTasksData?.tasks || [];
  const completedTasks = completedTasksData?.tasks || [];

  // Filter tasks into priorities and up next
  const priorityTasks = activeTasks.filter((t) => t.section === 'PRIORITIES');
  const upNextTasks = activeTasks.filter((t) => t.section !== 'PRIORITIES');

  // Sorting helper
  const sortTasks = (tasks: TaskItemData[]) => {
    return [...tasks].sort((a, b) => {
      if (sortBy === 'priority') {
        const pOrder: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3, NONE: 4 };
        return (pOrder[a.priorityFlag] || 4) - (pOrder[b.priorityFlag] || 4);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'time') {
        return (a.dueTime || '').localeCompare(b.dueTime || '');
      }
      return a.sortOrder - b.sortOrder;
    });
  };

  const sortedPriorityTasks = sortTasks(priorityTasks);
  const sortedUpNextTasks = sortTasks(upNextTasks);

  // Group by project for the "By project" tab
  const tasksByProject: Record<string, { projectTitle: string; colorHex: string; tasks: TaskItemData[] }> = {};
  activeTasks.forEach((task) => {
    const key = task.project ? task.project.id : 'unassigned';
    if (!tasksByProject[key]) {
      tasksByProject[key] = {
        projectTitle: task.project ? task.project.title : 'No Project',
        colorHex: task.project ? task.project.colorHex : '#8E9480',
        tasks: [],
      };
    }
    tasksByProject[key].tasks.push(task);
  });

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        {/* Header with Tabs & Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-white">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors pb-0.5 ${
                activeTab === 'all'
                  ? 'text-stone-900 border-b-2 border-[#3D5A40]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>All tasks</span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-stone-100 text-stone-600 rounded-full">
                {activeTasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('by-project')}
              className={`text-xs sm:text-sm font-semibold transition-colors pb-0.5 ${
                activeTab === 'by-project'
                  ? 'text-stone-900 border-b-2 border-[#3D5A40]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              By project
            </button>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort</span>
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-border-subtle p-1 z-20 text-xs">
                <button
                  onClick={() => { setSortBy('default'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${sortBy === 'default' ? 'font-semibold bg-stone-50' : 'text-stone-700'}`}
                >
                  Default {sortBy === 'default' && <Check className="w-3.5 h-3.5 text-[#3D5A40]" />}
                </button>
                <button
                  onClick={() => { setSortBy('priority'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${sortBy === 'priority' ? 'font-semibold bg-stone-50' : 'text-stone-700'}`}
                >
                  Priority {sortBy === 'priority' && <Check className="w-3.5 h-3.5 text-[#3D5A40]" />}
                </button>
                <button
                  onClick={() => { setSortBy('time'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${sortBy === 'time' ? 'font-semibold bg-stone-50' : 'text-stone-700'}`}
                >
                  Due Time {sortBy === 'time' && <Check className="w-3.5 h-3.5 text-[#3D5A40]" />}
                </button>
                <button
                  onClick={() => { setSortBy('title'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${sortBy === 'title' ? 'font-semibold bg-stone-50' : 'text-stone-700'}`}
                >
                  Title {sortBy === 'title' && <Check className="w-3.5 h-3.5 text-[#3D5A40]" />}
                </button>
              </div>
            )}

            <button className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task List Body */}
        {isLoadingActive ? (
          <div className="py-16 flex items-center justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#3D5A40]" />
          </div>
        ) : activeTab === 'all' ? (
          <div>
            {/* SECTION 1: YOUR PRIORITIES */}
            <div className="bg-[#5A5E47] px-4 py-2 flex items-center justify-between text-white select-none">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  YOUR PRIORITIES
                </span>
                <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.2 rounded-full">
                  {sortedPriorityTasks.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-border-subtle">
              {sortedPriorityTasks.length > 0 ? (
                sortedPriorityTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))
              ) : (
                <div className="py-4 text-center text-xs text-stone-400 italic">
                  No priority tasks remaining.
                </div>
              )}
            </div>

            {/* SECTION 2: UP NEXT */}
            <div className="bg-[#5A5E47] px-4 py-2 flex items-center justify-between text-white select-none mt-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  UP NEXT
                </span>
                <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.2 rounded-full">
                  {sortedUpNextTasks.length}
                </span>
              </div>
            </div>

            <div className="divide-y divide-border-subtle">
              {sortedUpNextTasks.length > 0 ? (
                sortedUpNextTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))
              ) : (
                <div className="py-4 text-center text-xs text-stone-400 italic">
                  No upcoming tasks.
                </div>
              )}
            </div>

            {/* Inline Quick Add Task Row */}
            <QuickAddTask defaultSection="UP_NEXT" />
          </div>
        ) : (
          /* By Project Tab View */
          <div className="divide-y divide-border-subtle">
            {Object.keys(tasksByProject).map((projId) => {
              const group = tasksByProject[projId];
              return (
                <div key={projId}>
                  <div className="bg-[#5A5E47] px-4 py-2 flex items-center gap-2 text-white">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: group.colorHex }}
                    />
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {group.projectTitle} ({group.tasks.length})
                    </span>
                  </div>
                  <div className="divide-y divide-border-subtle">
                    {group.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            <QuickAddTask defaultSection="UP_NEXT" />
          </div>
        )}

        {/* Collapsible Completed Section */}
        {completedTasks.length > 0 && (
          <div className="border-t border-border-subtle bg-stone-50/50">
            <button
              onClick={() => setIsCompletedOpen(!isCompletedOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-100/60 transition-colors text-left"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                {isCompletedOpen ? (
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                )}
                <span>Completed today</span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-stone-200 text-stone-700 rounded-full">
                  {completedTasks.length}
                </span>
              </div>
              <span className="text-xs italic text-stone-400">
                Small steps count.
              </span>
            </button>

            {isCompletedOpen && (
              <div className="divide-y divide-border-subtle border-t border-border-subtle bg-white">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
};

