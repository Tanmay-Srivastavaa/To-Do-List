export type TaskSection = 'PRIORITIES' | 'UP_NEXT' | 'INBOX';
export type PriorityFlag = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface LabelData {
  id: string;
  name: string;
  colorHex?: string | null;
  taskCount?: number;
}

export interface ProjectData {
  id: string;
  title: string;
  subtitle?: string | null;
  colorHex: string;
  icon: string;
  totalTasks?: number;
  completedTasks?: number;
  activeTasks?: number;
  progressPercentage?: number;
}

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  userName?: string;
  userImage?: string;
  createdAt: string;
}

export interface TaskItemData {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  completedAt?: string | null;
  section: TaskSection;
  dueDate?: string | null;
  dueTime?: string | null;
  priorityFlag: PriorityFlag;
  sortOrder: number;
  project?: {
    id: string;
    title: string;
    colorHex: string;
    icon?: string;
  } | null;
  labels: LabelData[];
  commentsCount: number;
  comments?: TaskComment[];
  createdAt: string;
}

export interface AnalyticsSummary {
  onListToday: number;
  completedToday: number;
  totalToday: number;
  focusMinutesToday: number;
  focusMotivationText: string;
}

export interface DayCompletion {
  dayLabel: string;
  date: string;
  completedCount: number;
}

export interface WeeklyChartData {
  timeframe: string;
  days: DayCompletion[];
  deltaText: string;
}

export interface FocusSessionData {
  id: string;
  taskId?: string | null;
  durationMinutes: number;
  startedAt: string;
  completedAt?: string | null;
  isCompleted: boolean;
}

