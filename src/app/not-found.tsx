"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-destructive/10 via-background to-background"></div>
      
      <Card className="w-full max-w-lg mx-auto text-center glassmorphic animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        <CardHeader>
          <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
            <SearchX className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight mt-6">404 - Page Not Found</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Sorry, the page you are looking for does not exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Back to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
