import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createFocusSessionSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await req.json();
    const validated = createFocusSessionSchema.parse(body);

    const now = new Date();
    const startedAt = new Date(now.getTime() - validated.durationMinutes * 60 * 1000);

    const session = await prisma.focusSession.create({
      data: {
        userId: user.id,
        taskId: validated.taskId || null,
        durationMinutes: validated.durationMinutes,
        startedAt,
        completedAt: now,
        isCompleted: validated.isCompleted,
      },
    });

    return NextResponse.json(
      {
        id: session.id,
        taskId: session.taskId,
        durationMinutes: session.durationMinutes,
        startedAt: session.startedAt.toISOString(),
        completedAt: session.completedAt?.toISOString() || null,
        isCompleted: session.isCompleted,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/focus-sessions:', err);
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: err.message } }, { status: 400 });
  }
}

