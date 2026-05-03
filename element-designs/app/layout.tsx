import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Element Designs — Design That Elevates Digital Presence',
  description:
    'Element Designs is a premium digital studio crafting elevated digital experiences through purposeful design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
