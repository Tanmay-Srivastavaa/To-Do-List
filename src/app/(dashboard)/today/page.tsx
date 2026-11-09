'use client';

import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { QuickAddTask } from '@/components/dashboard/QuickAddTask';
import { TaskDetailModal } from '@/components/modals/TaskDetailModal';
import { TaskItemData } from '@/types';
import { format } from 'date-fns';

export default function TodayPage() {
  const { data: tasksData, isLoading } = useTasks({ view: 'today' });
  const [selectedTask, setSelectedTask] = useState<TaskItemData | null>(null);

  const tasks = tasksData?.tasks || [];
  const todayDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 text-white mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#3D5A40] flex items-center justify-center text-white">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-normal text-white">Today</h1>
          <p className="text-xs text-stone-300">{todayDate}</p>
        </div>
      </div>

      {/* Task Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Today&apos;s Focus ({tasks.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 flex items-center justify-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#3D5A40]" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="divide-y divide-border-subtle">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-stone-400 text-sm">
            All caught up for today!
          </div>
        )}

        <QuickAddTask defaultSection="PRIORITIES" />
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}

