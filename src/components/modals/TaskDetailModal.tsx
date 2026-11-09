import React, { useState } from 'react';
import { X, Calendar, Clock, Flag, Tag, Send, Trash2, CheckCircle2 } from 'lucide-react';
import { TaskItemData } from '@/types';
import { useToggleTask, useDeleteTask, useAddComment } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/Badge';

interface TaskDetailModalProps {
  task: TaskItemData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const toggleMutation = useToggleTask();
  const deleteMutation = useDeleteTask();
  const addCommentMutation = useAddComment();

  if (!isOpen || !task) return null;

  const handleToggle = () => {
    toggleMutation.mutate({ taskId: task.id, isCompleted: !task.isCompleted });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteMutation.mutateAsync(task.id);
      onClose();
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addCommentMutation.mutateAsync({
      taskId: task.id,
      content: newComment.trim(),
    });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border-subtle overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={`p-1 rounded-md transition-colors ${
                task.isCompleted ? 'text-[#4E7D65]' : 'text-stone-300 hover:text-stone-400'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-400">
              {task.section}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div>
            <h2
              className={`text-xl font-semibold text-stone-900 ${
                task.isCompleted ? 'line-through text-stone-400' : ''
              }`}
            >
              {task.title}
            </h2>
            {task.description && (
              <p className="mt-2 text-sm text-stone-600 whitespace-pre-line">
                {task.description}
              </p>
            )}
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
            {task.project && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: task.project.colorHex }}
                />
                <span>{task.project.title}</span>
              </div>
            )}

            {task.dueTime && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{task.dueTime}</span>
              </div>
            )}

            {task.priorityFlag && task.priorityFlag !== 'NONE' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FBECE8] text-[#C9705E] rounded-lg text-xs font-medium">
                <Flag className="w-3.5 h-3.5" />
                <span>{task.priorityFlag} Priority</span>
              </div>
            )}

            {task.labels?.map((label) => (
              <Badge key={label.id} variant="label">
                #{label.name}
              </Badge>
            ))}
          </div>

          {/* Comments Section */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Comments & Notes ({task.comments?.length || 0})
            </h4>

            <div className="space-y-3 mb-4">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-stone-50 rounded-xl text-xs text-stone-800">
                    <div className="flex items-center justify-between font-semibold text-stone-600 mb-1">
                      <span>{comment.userName || 'Alex Morgan'}</span>
                      <span className="font-normal text-stone-400 text-[10px]">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-stone-700">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic">No notes or comments yet.</p>
              )}
            </div>

            {/* Add comment input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write a note or comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3D5A40] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || addCommentMutation.isPending}
                className="p-2 bg-[#3D5A40] hover:bg-[#314833] text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

