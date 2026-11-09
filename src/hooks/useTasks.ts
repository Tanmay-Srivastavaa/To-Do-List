import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskItemData } from '@/types';

interface FetchTasksParams {
  view?: string;
  section?: string;
  projectId?: string;
  label?: string;
  search?: string;
  includeCompleted?: boolean;
}

export function useTasks(params: FetchTasksParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.view) queryParams.set('view', params.view);
  if (params.section) queryParams.set('section', params.section);
  if (params.projectId) queryParams.set('projectId', params.projectId);
  if (params.label) queryParams.set('label', params.label);
  if (params.search) queryParams.set('search', params.search);
  if (params.includeCompleted) queryParams.set('includeCompleted', 'true');

  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async (): Promise<{ tasks: TaskItemData[]; total: number }> => {
      const res = await fetch(`/api/tasks?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted }),
      });
      if (!res.ok) throw new Error('Failed to toggle task');
      return res.json();
    },
    onMutate: async ({ taskId, isCompleted }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous tasks
      const previousQueries = queryClient.getQueriesData<{ tasks: TaskItemData[]; total: number }>({ queryKey: ['tasks'] });

      // Optimistically update all matching task caches
      queryClient.setQueriesData<{ tasks: TaskItemData[]; total: number }>(
        { queryKey: ['tasks'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            tasks: old.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    isCompleted,
                    completedAt: isCompleted ? new Date().toISOString() : null,
                  }
                : task
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTaskData: {
      title: string;
      description?: string;
      projectId?: string | null;
      section?: 'PRIORITIES' | 'UP_NEXT' | 'INBOX';
      dueTime?: string | null;
      dueDate?: string | null;
      priorityFlag?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
      labelIds?: string[];
    }) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, content }: { taskId: string; content: string }) => {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

