import React from 'react';

export const metadata = {
  title: 'OmniPost Admin Console',
  description: 'System administration dashboard for OmniPost SaaS platform.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
