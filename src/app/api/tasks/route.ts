import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createTaskSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'home';
    const section = searchParams.get('section');
    const projectId = searchParams.get('projectId');
    const label = searchParams.get('label');
    const search = searchParams.get('search');

    const where: any = {
      userId: user.id,
    };

    if (view === 'completed') {
      where.isCompleted = true;
    } else if (view === 'inbox') {
      where.projectId = null;
      where.isCompleted = false;
    } else if (view === 'home') {
      // In home view, show uncompleted tasks or if section is specified
      if (searchParams.get('includeCompleted') !== 'true') {
        where.isCompleted = false;
      }
    }

    if (section) {
      where.section = section;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (label) {
      where.labels = {
        some: {
          label: {
            name: {
              equals: label,
            },
          },
        },
      };
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: true,
        labels: {
          include: {
            label: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    const formattedTasks = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      isCompleted: t.isCompleted,
      completedAt: t.completedAt?.toISOString() || null,
      section: t.section as 'PRIORITIES' | 'UP_NEXT' | 'INBOX',
      dueDate: t.dueDate?.toISOString() || null,
      dueTime: t.dueTime,
      priorityFlag: t.priorityFlag as 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE',
      sortOrder: t.sortOrder,
      project: t.project
        ? {
            id: t.project.id,
            title: t.project.title,
            colorHex: t.project.colorHex,
            icon: t.project.icon,
          }
        : null,
      labels: t.labels.map((tl) => ({
        id: tl.label.id,
        name: tl.label.name,
        colorHex: tl.label.colorHex,
      })),
      commentsCount: t.comments.length,
      comments: t.comments.map((c) => ({
        id: c.id,
        content: c.content,
        userId: c.userId,
        userName: c.user?.name || 'Anonymous',
        userImage: c.user?.image || undefined,
        createdAt: c.createdAt.toISOString(),
      })),
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({
      tasks: formattedTasks,
      total: formattedTasks.length,
    });
  } catch (err: any) {
    console.error('Error in GET /api/tasks:', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await req.json();
    const validated = createTaskSchema.parse(body);

    // Get max sort order
    const maxSort = await prisma.task.aggregate({
      where: { userId: user.id },
      _max: { sortOrder: true },
    });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: validated.title,
        description: validated.description,
        projectId: validated.projectId || null,
        section: validated.section,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        dueTime: validated.dueTime || null,
        priorityFlag: validated.priorityFlag,
        sortOrder: nextSort,
        labels: validated.labelIds && validated.labelIds.length > 0
          ? {
              create: validated.labelIds.map((labelId) => ({
                label: { connect: { id: labelId } },
              })),
            }
          : undefined,
      },
      include: {
        project: true,
        labels: {
          include: {
            label: true,
          },
        },
        comments: true,
      },
    });

    const formattedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      completedAt: task.completedAt?.toISOString() || null,
      section: task.section as 'PRIORITIES' | 'UP_NEXT' | 'INBOX',
      dueDate: task.dueDate?.toISOString() || null,
      dueTime: task.dueTime,
      priorityFlag: task.priorityFlag as 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE',
      sortOrder: task.sortOrder,
      project: task.project
        ? {
            id: task.project.id,
            title: task.project.title,
            colorHex: task.project.colorHex,
            icon: task.project.icon,
          }
        : null,
      labels: task.labels.map((tl) => ({
        id: tl.label.id,
        name: tl.label.name,
        colorHex: tl.label.colorHex,
      })),
      commentsCount: 0,
      comments: [],
      createdAt: task.createdAt.toISOString(),
    };

    return NextResponse.json(formattedTask, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/tasks:', err);
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: err.message } },
      { status: 400 }
    );
  }
}
