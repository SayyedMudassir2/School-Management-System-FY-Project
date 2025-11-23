
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { DesktopNav } from './components/desktop-nav';
import { MobileNav } from './components/mobile-nav';
import { SmallTitle } from './components/small-title';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
import { Features } from './components/features';
import { AdditionalFeatures } from './components/additional-features';
import { Footer } from './components/footer';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-lg">
        <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <DesktopNav />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Button asChild className="group">
                <Link href="/login">
                  Login <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="relative isolate px-6 pt-12 lg:px-8">
          <div className="container mx-auto pb-24 pt-10 sm:pb-32 sm:pt-20">
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
              
              <div className="flex justify-center">
                <SmallTitle>
                  Welcome to the Future of School Management
                </SmallTitle>
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                The Official Management Portal <br /> of Our School
              </h1>
              
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Aedura is our school’s centralized, all-in-one digital system.  It's designed to simplify communication, academics, administration, and daily school operations.  It provides a seamless experience for students, parents, teachers, and administrators.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="group">
                  <a href="#features">
                    See all features
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-16 flow-root sm:mt-24 animate-in fade-in-0 slide-in-from-bottom-16 duration-1000 delay-300">
              <div className="-m-2 rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://storage.googleapis.com/aieditor-code-gen-files/3c401886-4f7f-44de-a28a-796720f18837.png"
                  alt="Aedura App Screenshot"
                  width={2432}
                  height={1442}
                  data-ai-hint="app dashboard"
                  className="rounded-md shadow-2xl ring-1 ring-white/10"
                />
              </div>
            </div>
          </div>
        </section>

        <Stats />
        <Features />
        <AdditionalFeatures />
        <Testimonials />
      </main>

      <Footer year={year} />
    </div>
  );
}
