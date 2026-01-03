
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useEffect, useState } from 'react';

// export const metadata: Metadata = {
//   title: 'Aedura - Elite School Management',
//   description: "Aedura is our school’s centralized, all-in-one digital system.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <title>Aedura - Elite School Management</title>
        <meta name="description" content="Aedura is our school’s centralized, all-in-one digital system." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "font-sans antialiased"
      )} suppressHydrationWarning>
        {isClient && <ProgressBar />}
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
