
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, ChevronDown, BookOpen, Users, Banknote, LayoutDashboard, GraduationCap, MessageSquare, Bus, BarChart, FileCheck, Bell, Shield, UserCog, CalendarCheck } from 'lucide-react';

const features = [
  {
    name: 'Student Management',
    description: 'It\'s a comprehensive student information system.',
    href: '/login',
    icon: Users,
  },
  {
    name: 'Academic Management',
    description: 'You can streamline curriculum planning and examinations.',
    href: '/login',
    icon: GraduationCap,
  },
  {
    name: 'Communication Hub',
    description: 'It\'s an integrated messaging system with multi-channel support.',
    href: '/login',
    icon: MessageSquare,
  },
  {
    name: 'Financial Management',
    description: 'It\'s a complete fee management system with online payment.',
    href: '/login',
    icon: Banknote,
  },
  {
    name: 'Staff Management',
    description: 'There are efficient tools for managing staff records, attendance, and more.',
    href: '/login',
    icon: UserCog,
  },
  {
    name: 'Transport Management',
    description: 'There\'s real-time transport tracking, route management, and more.',
    href: '/login',
    icon: Bus,
  },
  {
    name: 'Analytics & Reports',
    description: 'There are powerful analytics tools for data-driven decisions.',
    href: '/login',
    icon: BarChart,
  },
  {
    name: 'Resource Management',
    description: 'It has a digital library system, inventory tracking, and more.',
    href: '/login',
    icon: BookOpen,
  },
  {
    name: 'Attendance System',
    description: 'There\'s automated attendance tracking for students and staff.',
    href: '/login',
    icon: CalendarCheck,
  },
  {
    name: 'Examination Portal',
    description: 'It\'s a complete examination management system.',
    href: '/login',
    icon: FileCheck,
  },
  {
    name: 'Notice Board',
    description: 'It\'s a digital notice board for announcements, events, and more.',
    href: '/login',
    icon: Bell,
  },
  {
    name: 'Security & Access',
    description: 'There\'s role-based access control with data encryption.',
    href: '/login',
    icon: Shield,
  }
];


export function DesktopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="hidden md:flex items-center gap-1 ml-6">
      <a
        href="/#home"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        Home
      </a>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary outline-none"
          >
            Features
            <ChevronDown className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="w-[56rem] p-6" align="start">
          <div className="grid gap-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium leading-none text-foreground">Features</h4>
              <a href="/#features" className='text-sm font-medium text-primary hover:underline'>View all</a>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="-m-3 flex items-start rounded-lg p-3 hover:bg-muted"
                >
                  <div className="flex-shrink-0 rounded-md bg-primary/10 text-primary p-2">
                    <feature.icon className="h-6 w-6" />
                  </div>

                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground">
                      {feature.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
          </div>
        </PopoverContent>
      </Popover>
      <a
        href="/#testimonials"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        Testimonials
      </a>
       <Link
        href="/help"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        Help Center
      </Link>
      <a
        href="/#contact"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        Contact
      </a>
    </nav>
  );
}
