import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectData, LabelData, AnalyticsSummary, WeeklyChartData } from '@/types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<{ projects: ProjectData[] }> => {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
  });
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: ['projects', id],
    enabled: !!id,
    queryFn: async (): Promise<{ project: ProjectData & { tasks: any[] } }> => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error('Failed to fetch project details');
      return res.json();
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; subtitle?: string; colorHex: string; icon: string }) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useLabels() {
  return useQuery({
    queryKey: ['labels'],
    queryFn: async (): Promise<{ labels: LabelData[] }> => {
      const res = await fetch('/api/labels');
      if (!res.ok) throw new Error('Failed to fetch labels');
      return res.json();
    },
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; colorHex?: string }) => {
      const res = await fetch('/api/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create label');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async (): Promise<AnalyticsSummary> => {
      const res = await fetch('/api/analytics/summary');
      if (!res.ok) throw new Error('Failed to fetch analytics summary');
      return res.json();
    },
  });
}

export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: async (): Promise<WeeklyChartData> => {
      const res = await fetch('/api/analytics/weekly');
      if (!res.ok) throw new Error('Failed to fetch weekly analytics');
      return res.json();
    },
  });
}

export function useLogFocusSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { durationMinutes: number; taskId?: string; isCompleted: boolean }) => {
      const res = await fetch('/api/focus-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to log focus session');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'summary'] });
    },
  });
}

