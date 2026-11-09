import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/components/providers/AuthProvider';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Folio — Mindful To-Do & Focus System',
  description: 'A calm, earth-toned task management and deep work web application inspired by mindful editorial design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-folio-primary">
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

