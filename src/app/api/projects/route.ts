import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { createProjectSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
        isArchived: false,
      },
      include: {
        tasks: {
          select: {
            id: true,
            isCompleted: true,
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const formattedProjects = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.isCompleted).length;
      const activeTasks = totalTasks - completedTasks;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        colorHex: p.colorHex,
        icon: p.icon,
        totalTasks,
        completedTasks,
        activeTasks,
        progressPercentage,
      };
    });

    return NextResponse.json({
      projects: formattedProjects,
    });
  } catch (err: any) {
    console.error('Error in GET /api/projects:', err);
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
    const validated = createProjectSchema.parse(body);

    const maxSort = await prisma.project.aggregate({
      where: { userId: user.id },
      _max: { sortOrder: true },
    });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: validated.title,
        subtitle: validated.subtitle || null,
        colorHex: validated.colorHex,
        icon: validated.icon,
        sortOrder: nextSort,
      },
    });

    return NextResponse.json(
      {
        id: project.id,
        title: project.title,
        subtitle: project.subtitle,
        colorHex: project.colorHex,
        icon: project.icon,
        totalTasks: 0,
        completedTasks: 0,
        activeTasks: 0,
        progressPercentage: 0,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error in POST /api/projects:', err);
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: err.message } }, { status: 400 });
  }
}
