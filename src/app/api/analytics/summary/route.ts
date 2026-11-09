import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { startOfDay, endOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Active tasks assigned to today / priorities / up next
    const activeTasksCount = await prisma.task.count({
      where: {
        userId: user.id,
        isCompleted: false,
        OR: [
          { section: { in: ['PRIORITIES', 'UP_NEXT'] } },
          { dueDate: { gte: todayStart, lte: todayEnd } },
          { dueTime: { contains: 'Today' } },
        ],
      },
    });

    // Completed tasks today
    const completedTodayCount = await prisma.task.count({
      where: {
        userId: user.id,
        isCompleted: true,
        completedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const totalToday = activeTasksCount + completedTodayCount;

    // Focus session minutes today
    const focusSessions = await prisma.focusSession.findMany({
      where: {
        userId: user.id,
        isCompleted: true,
        startedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const focusMinutesToday = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    return NextResponse.json({
      onListToday: activeTasksCount,
      completedToday: completedTodayCount,
      totalToday,
      focusMinutesToday,
      focusMotivationText: 'a little better, every day',
    });
  } catch (err: any) {
    console.error('Error in GET /api/analytics/summary:', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}
