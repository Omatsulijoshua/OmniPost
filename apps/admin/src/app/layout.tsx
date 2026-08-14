import React from 'react';
import './globals.css';

export const metadata = {
  title: 'OmniPost Admin Portal',
  description: 'Enterprise Operations & Administration Platform for OmniPost SaaS',
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
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
