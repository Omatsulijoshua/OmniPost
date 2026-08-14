import './globals.css';
import React from 'react';

export const metadata = {
  title: 'OmniPost — Create once. Adapt everywhere. Publish everywhere.',
  description: 'Production-grade SaaS platform for content adaptation, scheduling, and publishing.',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/favicon.ico',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
