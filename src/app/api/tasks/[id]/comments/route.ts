import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createCommentSchema } from '@/lib/validations';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { id: taskId } = params;
    const body = await req.json();
    const { content } = createCommentSchema.parse(body);

    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: user.id },
    });

    if (!task) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Task not found' } }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        userId: user.id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userName: comment.user?.name || user.name || 'Anonymous',
        userImage: comment.user?.image || user.image || undefined,
        createdAt: comment.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/tasks/[id]/comments:', err);
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: err.message } }, { status: 400 });
  }
}

