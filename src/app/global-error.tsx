'use client';

import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect } from 'react';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-destructive/10 via-background to-background"></div>
            
            <Card className="w-full max-w-lg mx-auto text-center glassmorphic">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                        <ServerCrash className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-4xl font-bold tracking-tight mt-6">500 - Something went wrong</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                        We're sorry, but an unexpected error occurred on our end. Our team has been notified.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => reset()} size="lg">
                        Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
        <FirebaseErrorListener />
      </body>
    </html>
  );
}
