import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TaskSection = {
  PRIORITIES: 'PRIORITIES',
  UP_NEXT: 'UP_NEXT',
  INBOX: 'INBOX',
} as const;

const PriorityFlag = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  NONE: 'NONE',
} as const;

async function main() {
  console.log('Seeding Folio database with baseline user and tasks...');

  // 1. Create or Find Baseline User (Alex Morgan)
  const user = await prisma.user.upsert({
    where: { email: 'alex.morgan@example.com' },
    update: {},
    create: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      planType: 'Personal plan',
    },
  });

  // Clean existing user data for a clean slate
  await prisma.comment.deleteMany({ where: { userId: user.id } });
  await prisma.focusSession.deleteMany({ where: { userId: user.id } });
  await prisma.taskLabel.deleteMany({});
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.label.deleteMany({ where: { userId: user.id } });
  await prisma.project.deleteMany({ where: { userId: user.id } });

  // 2. Create Baseline Projects
  const projectWeb = await prisma.project.create({
    data: {
      userId: user.id,
      title: 'Website refresh',
      subtitle: 'Next: Design review · Tomorrow',
      colorHex: '#4E7D65', // Forest green
      icon: 'layout',
      sortOrder: 1,
    },
  });

  const projectPersonal = await prisma.project.create({
    data: {
      userId: user.id,
      title: 'Personal',
      subtitle: 'A little space for everyday life',
      colorHex: '#C9705E', // Terracotta / Coral
      icon: 'coffee',
      sortOrder: 2,
    },
  });

  const projectLearning = await prisma.project.create({
    data: {
      userId: user.id,
      title: 'Learning',
      subtitle: 'Next: Finish chapter 4 · Wednesday',
      colorHex: '#8B8A9F', // Soft Lavender
      icon: 'book-open',
      sortOrder: 3,
    },
  });

  // 3. Create Labels
  const labelDeepWork = await prisma.label.create({
    data: { userId: user.id, name: 'deep work', colorHex: '#D6CFC4' },
  });

  const labelLittleThings = await prisma.label.create({
    data: { userId: user.id, name: 'little things', colorHex: '#D6CFC4' },
  });

  // 4. Create Tasks Under "YOUR PRIORITIES"
  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectWeb.id,
      title: 'Design review & mobile navigation prototype',
      section: TaskSection.PRIORITIES,
      dueTime: '10:00 AM',
      priorityFlag: PriorityFlag.HIGH,
      sortOrder: 1,
      labels: { create: [{ labelId: labelDeepWork.id }] },
      comments: {
        create: [
          { userId: user.id, content: 'Check the drawer gesture on iOS Safari' },
          { userId: user.id, content: 'Updated typography scale in Figma' },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectWeb.id,
      title: 'Finalize brand color tokens and CSS variables',
      section: TaskSection.PRIORITIES,
      dueTime: '11:30 AM',
      priorityFlag: PriorityFlag.HIGH,
      sortOrder: 2,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectPersonal.id,
      title: 'Pick up groceries and organic coffee beans',
      section: TaskSection.PRIORITIES,
      dueTime: 'Today',
      priorityFlag: PriorityFlag.MEDIUM,
      sortOrder: 3,
    },
  });

  // 5. Create Tasks Under "UP NEXT"
  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectWeb.id,
      title: 'Client synchronization meeting & milestone demo',
      section: TaskSection.UP_NEXT,
      dueTime: '2:00 PM',
      priorityFlag: PriorityFlag.HIGH,
      sortOrder: 4,
      comments: {
        create: [
          { userId: user.id, content: 'Sent zoom link to team' },
          { userId: user.id, content: 'Prepared slide deck' },
          { userId: user.id, content: 'Deck approved by lead' },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectLearning.id,
      title: 'Read chapter 3: Distributed Systems in Go',
      section: TaskSection.UP_NEXT,
      dueTime: 'Today',
      priorityFlag: PriorityFlag.MEDIUM,
      sortOrder: 5,
    },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: projectPersonal.id,
      title: 'Water balcony plants and organize bookshelf',
      section: TaskSection.UP_NEXT,
      dueTime: '6:00 PM',
      priorityFlag: PriorityFlag.LOW,
      sortOrder: 6,
      labels: { create: [{ labelId: labelLittleThings.id }] },
    },
  });

  // 6. Create 3 Completed Tasks for Today
  for (let i = 1; i <= 3; i++) {
    await prisma.task.create({
      data: {
        userId: user.id,
        projectId: projectWeb.id,
        title: `Completed morning preparation task #${i}`,
        isCompleted: true,
        completedAt: new Date(),
        dueTime: '8:30 AM',
        sortOrder: 10 + i,
      },
    });
  }

  // 7. Create baseline Focus Sessions for analytics
  const today = new Date();
  await prisma.focusSession.create({
    data: {
      userId: user.id,
      durationMinutes: 25,
      startedAt: new Date(today.getTime() - 1000 * 60 * 120),
      completedAt: new Date(today.getTime() - 1000 * 60 * 95),
      isCompleted: true,
    },
  });

  await prisma.focusSession.create({
    data: {
      userId: user.id,
      durationMinutes: 25,
      startedAt: new Date(today.getTime() - 1000 * 60 * 60),
      completedAt: new Date(today.getTime() - 1000 * 60 * 35),
      isCompleted: true,
    },
  });

  console.log('Database seeded successfully matching Folio screenshots!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

