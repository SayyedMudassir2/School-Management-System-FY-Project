
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
  
  const parentAvatar = PlaceHolderImages.find(img => img.id === 'teacher-avatar');
  const teacherAvatar = PlaceHolderImages.find(img => img.id === 'admin-avatar');
  const studentAvatar = PlaceHolderImages.find(img => img.id === 'student-avatar-1');


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
        <section id="home" className="relative isolate px-6 lg:px-8 pt-12">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

          <div className="container mx-auto pb-24 sm:pb-32">
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
              <div className="flex justify-center">
                <SmallTitle>
                  Welcome to Aedura
                </SmallTitle>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-6xl mt-4">
                The Official Management Portal <br /> of Our School
              </h1>
              <p className="mt-6 mx-auto max-w-[700px] text-lg leading-8 text-muted-foreground sm:text-xl">
                Aedura is our school’s centralized, all-in-one digital system designed to simplify communication, academics, administration, and daily school operations.
                It provides a seamless experience for students, parents, teachers, and administrators.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
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
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get In Touch</h2>
              <p className="mt-4 text-lg text-muted-foreground">We're here to help and answer any question you might have.</p>
            </div>
            <div className="mt-16 max-w-xl mx-auto px-4 sm:px-0">
              <Card className="glassmorphic transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your Name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="your.email@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What can we help you with?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message..." rows={5} />
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
               <div className="text-center mt-8 text-muted-foreground">
                  <p>Email: <a href="mailto:contact@aedura.elite" className="text-primary hover:underline">contact@aedura.elite</a></p>
                  <p>Phone: <a href="tel:+1234567890" className="text-primary hover:underline">(123) 456-7890</a></p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer year={year} />
    </div>
  );
}
