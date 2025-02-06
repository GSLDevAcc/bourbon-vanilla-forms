// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavigationMenu from '@/components/navigation-menu';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bourbon Vanilla Forms',
  description: 'Production management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <NavigationMenu />
          <main className="ml-72">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}