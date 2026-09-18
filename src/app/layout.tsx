import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase';
import { FaviconManager } from '@/components/favicon-manager';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'PELAYANAN DESA GINTUNGREJA',
  description: 'Aplikasi Pelayanan Publik Desa Gintungreja',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} font-sans antialiased relative min-h-screen overflow-x-hidden`} suppressHydrationWarning>
        <FirebaseClientProvider>
          <FaviconManager />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
