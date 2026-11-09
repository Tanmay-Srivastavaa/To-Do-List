import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { id } = params;
    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
      include: {
        tasks: {
          include: {
            labels: {
              include: { label: true },
            },
            comments: true,
          },
          orderBy: [
            { isCompleted: 'asc' },
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }, { status: 404 });
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.isCompleted).length;
    const activeTasks = totalTasks - completedTasks;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        subtitle: project.subtitle,
        colorHex: project.colorHex,
        icon: project.icon,
        totalTasks,
        completedTasks,
        activeTasks,
        progressPercentage,
        tasks: project.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          isCompleted: t.isCompleted,
          completedAt: t.completedAt?.toISOString() || null,
          section: t.section,
          dueDate: t.dueDate?.toISOString() || null,
          dueTime: t.dueTime,
          priorityFlag: t.priorityFlag,
          sortOrder: t.sortOrder,
          labels: t.labels.map((tl) => ({
            id: tl.label.id,
            name: tl.label.name,
            colorHex: tl.label.colorHex,
          })),
          commentsCount: t.comments.length,
          createdAt: t.createdAt.toISOString(),
        })),
      },
    });
  } catch (err: any) {
    console.error('Error in GET /api/projects/[id]:', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { id } = params;
    const project = await prisma.project.findFirst({
      where: { id, userId: user.id },
    });

    if (!project) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Project not found' } }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error('Error in DELETE /api/projects/[id]:', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

