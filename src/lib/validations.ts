import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  section: z.enum(['PRIORITIES', 'UP_NEXT', 'INBOX']).default('UP_NEXT'),
  dueDate: z.string().datetime().optional().nullable(),
  dueTime: z.string().max(50).optional().nullable(),
  priorityFlag: z.enum(['HIGH', 'MEDIUM', 'LOW', 'NONE']).default('NONE'),
  labelIds: z.array(z.string()).optional().default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  isCompleted: z.boolean().optional(),
  section: z.enum(['PRIORITIES', 'UP_NEXT', 'INBOX']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  dueTime: z.string().max(50).optional().nullable(),
  priorityFlag: z.enum(['HIGH', 'MEDIUM', 'LOW', 'NONE']).optional(),
  sortOrder: z.number().int().optional(),
  labelIds: z.array(z.string()).optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  subtitle: z.string().max(100).optional().nullable(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex code').default('#4E7D65'),
  icon: z.string().default('layout'),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000),
});

export const createFocusSessionSchema = z.object({
  taskId: z.string().optional().nullable(),
  durationMinutes: z.number().min(1).max(180).default(25),
  isCompleted: z.boolean().default(true),
});

