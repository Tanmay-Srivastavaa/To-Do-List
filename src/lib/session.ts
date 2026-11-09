import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) return user;
    }
  } catch (err) {
    console.error('Session error:', err);
  }

  // Fallback to baseline Alex Morgan during local dev testing if mock auth enabled
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_AUTH === 'true' || process.env.NODE_ENV !== 'production') {
    let user = await prisma.user.findFirst({
      where: { email: 'alex.morgan@example.com' },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Alex Morgan',
          email: 'alex.morgan@example.com',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          planType: 'Personal plan',
        },
      });
    }
    return user;
  }

  return null;
}

