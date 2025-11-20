
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, MessageSquare, Phone } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
      <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/30 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-gradient-to-br from-primary/10 via-background to-background"></div>

          <div className="container mx-auto pb-24 sm:pb-32">
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
              
              <div className="flex justify-center">
                <SmallTitle>
                  Welcome to Aedura
                </SmallTitle>
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                The Official Management Portal <br /> of Our School
              </h1>
              
              <p className="mx-auto mt-6 max-w-[700px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Aedura is our school’s centralized, all-in-one digital system.  It's designed to simplify communication, academics, administration, and daily school operations.  It provides a seamless experience for students, parents, teachers, and administrators.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="group hover:bg-primary hover:text-primary-foreground">
                  <a href="#features">
                    See all features
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-16 flow-root sm:mt-24 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 delay-300">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://picsum.photos/seed/dashboard/1200/600"
                  alt="App screenshot"
                  width={1200}
                  height={600}
                  data-ai-hint="app dashboard"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </section>

        <Stats />

        <Features />

        <AdditionalFeatures />

        <Testimonials />

        <section id="contact" className="py-24 sm:py-32 bg-secondary/50 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get in Touch</h2>
                    <p className="mt-4 text-lg text-muted-foreground">We're here to help and answer any question you might have.</p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Card className="glassmorphic text-center flex flex-col">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-3 rounded-lg">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="mt-4">Email Support</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Get in touch with our support team via email</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                             <Button variant="outline" asChild className="w-full">
                                <a href="mailto:contact@aedura.elite">Send Email</a>
                            </Button>
                        </div>
                    </Card>
                     <Card className="glassmorphic text-center flex flex-col">
                        <CardHeader>
                            <div className="mx-auto bg-accent/10 p-3 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-accent" />
                            </div>
                            <CardTitle className="mt-4">Live Chat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Chat with our support team in real-time</p>
                        </CardContent>
                         <div className="p-6 pt-0">
                             <Button variant="outline" asChild className="w-full">
                                <Link href="#">Start Chat</Link>
                            </Button>
                        </div>
                    </Card>
                     <Card className="glassmorphic text-center flex flex-col">
                        <CardHeader>
                            <div className="mx-auto bg-green-500/10 p-3 rounded-lg">
                                <Phone className="h-6 w-6 text-green-500" />
                            </div>
                            <CardTitle className="mt-4">Phone Support</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">Call us directly for immediate assistance</p>
                        </CardContent>
                         <div className="p-6 pt-0">
                             <Button variant="outline" asChild className="w-full">
                                <a href="tel:+1234567890">Call Now</a>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

      </main>

      <Footer year={year} />
    </div>
  );
}
