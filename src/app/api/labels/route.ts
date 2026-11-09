import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const labels = await prisma.label.findMany({
      where: { userId: user.id },
      include: {
        tasks: {
          select: { taskId: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formattedLabels = labels.map((l) => ({
      id: l.id,
      name: l.name,
      colorHex: l.colorHex,
      taskCount: l.tasks.length,
    }));

    return NextResponse.json({
      labels: formattedLabels,
    });
  } catch (err: any) {
    console.error('Error in GET /api/labels:', err);
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { name, colorHex } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Name is required' } }, { status: 400 });
    }

    const label = await prisma.label.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: name.trim().toLowerCase(),
        },
      },
      update: {
        colorHex: colorHex || '#D6CFC4',
      },
      create: {
        userId: user.id,
        name: name.trim().toLowerCase(),
        colorHex: colorHex || '#D6CFC4',
      },
    });

    return NextResponse.json(
      {
        id: label.id,
        name: label.name,
        colorHex: label.colorHex,
        taskCount: 0,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/labels:', err);
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: err.message } }, { status: 400 });
  }
}
