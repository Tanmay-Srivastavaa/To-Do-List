import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { updateTaskSchema } from '@/lib/validations';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const validated = updateTaskSchema.parse(body);

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Task not found' } }, { status: 404 });
    }

    const updateData: any = {};

    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.projectId !== undefined) updateData.projectId = validated.projectId;
    if (validated.section !== undefined) updateData.section = validated.section;
    if (validated.dueDate !== undefined) {
      updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    }
    if (validated.dueTime !== undefined) updateData.dueTime = validated.dueTime;
    if (validated.priorityFlag !== undefined) updateData.priorityFlag = validated.priorityFlag;
    if (validated.sortOrder !== undefined) updateData.sortOrder = validated.sortOrder;

    if (validated.isCompleted !== undefined) {
      updateData.isCompleted = validated.isCompleted;
      updateData.completedAt = validated.isCompleted ? new Date() : null;
    }

    // Handle label associations if provided
    if (validated.labelIds !== undefined) {
      await prisma.taskLabel.deleteMany({ where: { taskId: id } });
      if (validated.labelIds.length > 0) {
        updateData.labels = {
          create: validated.labelIds.map((labelId) => ({
            label: { connect: { id: labelId } },
          })),
        };
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      isCompleted: updated.isCompleted,
      completedAt: updated.completedAt?.toISOString() || null,
      section: updated.section as 'PRIORITIES' | 'UP_NEXT' | 'INBOX',
      dueDate: updated.dueDate?.toISOString() || null,
      dueTime: updated.dueTime,
      priorityFlag: updated.priorityFlag as 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE',
      sortOrder: updated.sortOrder,
      project: updated.project
        ? {
            id: updated.project.id,
            title: updated.project.title,
            colorHex: updated.project.colorHex,
            icon: updated.project.icon,
          }
        : null,
      labels: updated.labels.map((tl) => ({
        id: tl.label.id,
        name: tl.label.name,
        colorHex: tl.label.colorHex,
      })),
      commentsCount: updated.comments.length,
      comments: updated.comments.map((c) => ({
        id: c.id,
        content: c.content,
        userId: c.userId,
        userName: c.user?.name || 'Anonymous',
        userImage: c.user?.image || undefined,
        createdAt: c.createdAt.toISOString(),
      })),
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (err: any) {
    console.error('Error in PATCH /api/tasks/[id]:', err);
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: err.message } }, { status: 400 });
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

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingTask) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Task not found' } }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error('Error in DELETE /api/tasks/[id]:', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

