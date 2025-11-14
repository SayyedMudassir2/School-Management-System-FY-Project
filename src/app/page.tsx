import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="ml-2 text-lg font-bold tracking-tight">Aedura Elite</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started <ArrowRight className="ml-2" /></Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

          <div className="container mx-auto py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                The Future of School Management is Here
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Aedura Elite provides a seamless, integrated platform to manage all aspects of your educational institution. From attendance to fees, communication to smart analytics.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                   <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#">Learn More <ArrowRight className="ml-2" /></Link>
                </Button>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://picsum.photos/seed/dashboard/1200/600"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  data-ai-hint="app dashboard"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aedura Elite. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
