'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Loader2, Folder } from 'lucide-react';
import Link from 'next/link';
import { useProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { QuickAddTask } from '@/components/dashboard/QuickAddTask';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TaskDetailModal } from '@/components/modals/TaskDetailModal';
import { TaskItemData } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const { data: projectData, isLoading: isLoadingProject } = useProject(projectId);
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({ projectId, includeCompleted: true });
  const [selectedTask, setSelectedTask] = useState<TaskItemData | null>(null);

  const project = projectData?.project;
  const tasks = tasksData?.tasks || [];

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleDeleteProject = async () => {
    if (confirm('Are you sure you want to delete this project and all its associated tasks?')) {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      }
    }
  };

  if (isLoadingProject) {
    return (
      <div className="py-24 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-24 text-white">
        <h2 className="text-xl font-bold">Project Not Found</h2>
        <Link href="/" className="mt-4 inline-block text-xs underline text-stone-300">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Project Banner Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: project.colorHex }}
            >
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-xs text-stone-500 mt-0.5">
                  {project.subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleDeleteProject}
            className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Stats */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-2 font-medium">
            <span>
              {completedCount} of {totalCount} tasks complete
            </span>
            <span className="font-semibold text-stone-800">{percentage}%</span>
          </div>
          <ProgressBar value={percentage} colorHex={project.colorHex} heightClass="h-2.5" />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Project Tasks ({tasks.length})
          </span>
        </div>

        {isLoadingTasks ? (
          <div className="py-12 flex items-center justify-center text-stone-400">
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
          <div className="py-12 text-center text-xs text-stone-400 italic">
            No tasks in this project yet. Add one below!
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

