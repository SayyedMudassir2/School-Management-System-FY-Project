
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X, ChevronDown, BookOpen, Users, Banknote, LayoutDashboard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Logo } from '@/components/logo';


const features = [
    {
      name: 'Attendance Tracking',
      description: 'You can monitor student attendance with ease.',
      href: '#',
      icon: Users,
    },
    {
      name: 'Fee Management',
      description: 'You can streamline fee collection and reporting.',
      href: '#',
      icon: Banknote,
    },
    {
      name: 'Gradebooks',
      description: 'You can manage grades and academic performance.',
      href: '#',
      icon: BookOpen,
    },
    {
      name: 'Dashboards',
      description: 'You can get a complete overview of your institution.',
      href: '/dashboard',
      icon: LayoutDashboard,
    }
  ];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Open Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-xs bg-background/95 backdrop-blur-sm p-0"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Logo className="h-10 w-auto" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <nav className="flex flex-col items-start gap-2 p-4">
              <a
                href="#home"
                onClick={() => setOpen(false)}
                className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Home
              </a>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                  <AccordionTrigger className="w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    <span>Features</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pl-4">
                    <div className="flex flex-col gap-1 py-2">
                        {features.map((feature) => (
                            <Link
                                key={feature.name}
                                href={feature.href}
                                onClick={() => setOpen(false)}
                                className="flex items-start rounded-md p-3 text-sm hover:bg-muted"
                            >
                                <feature.icon className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                                <div className="ml-3">
                                    <p className="font-medium text-foreground">
                                    {feature.name}
                                    </p>
                                    <p className="text-muted-foreground">
                                    {feature.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <a
                href="#testimonials"
                onClick={() => setOpen(false)}
                className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block w-full rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Contact
              </a>
            </nav>
            <div className="mt-auto p-4 border-t space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
               <Button asChild className="w-full" variant="outline">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
