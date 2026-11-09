import React from 'react';
import { MessageSquare, Clock, Flag } from 'lucide-react';
import { TaskItemData } from '@/types';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { useToggleTask } from '@/hooks/useTasks';

interface TaskItemProps {
  task: TaskItemData;
  onClick: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  const toggleMutation = useToggleTask();

  const handleCheckboxChange = (checked: boolean) => {
    toggleMutation.mutate({ taskId: task.id, isCompleted: checked });
  };

  const getPriorityFlagColor = (flag: string) => {
    switch (flag) {
      case 'HIGH':
        return 'text-[#DC5B43] fill-[#DC5B43]';
      case 'MEDIUM':
        return 'text-amber-500 fill-amber-500';
      case 'LOW':
        return 'text-blue-400 fill-blue-400';
      default:
        return 'text-transparent';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between px-4 py-3 hover:bg-stone-50/80 cursor-pointer transition-colors border-b border-border-subtle last:border-b-0 ${
        task.isCompleted ? 'opacity-50' : ''
      }`}
    >
      {/* Left side: Checkbox + Title + Badges */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
        <Checkbox
          checked={task.isCompleted}
          onChange={handleCheckboxChange}
        />

        <div className="min-w-0 flex items-center gap-2.5 flex-wrap">
          <span
            className={`text-xs sm:text-sm font-medium transition-all ${
              task.isCompleted
                ? 'line-through text-stone-400'
                : 'text-stone-800 group-hover:text-stone-900'
            }`}
          >
            {task.title}
          </span>

          {/* Project indicator */}
          {task.project && (
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-500">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: task.project.colorHex }}
              />
              <span className="text-[11px] font-normal">{task.project.title}</span>
            </div>
          )}

          {/* Comments count */}
          {task.commentsCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 font-normal">
              <MessageSquare className="w-3 h-3" />
              <span>{task.commentsCount}</span>
            </span>
          )}

          {/* Label pills */}
          {task.labels && task.labels.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5">
              {task.labels.map((l) => (
                <Badge key={l.id} variant="label">
                  {l.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Due Time + Priority Flag */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {task.dueTime && (
          <span className="flex items-center gap-1 text-xs text-stone-500 font-normal">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{task.dueTime}</span>
          </span>
        )}

        {task.priorityFlag && task.priorityFlag !== 'NONE' && (
          <Flag
            className={`w-3.5 h-3.5 ${getPriorityFlagColor(task.priorityFlag)}`}
          />
        )}
      </div>
    </div>
  );
};

