
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
    description: 'Comprehensive student information system.',
    href: '#',
    icon: Users,
  },
  {
    name: 'Academic Management',
    description: 'Streamline curriculum planning and examinations.',
    href: '#',
    icon: GraduationCap,
  },
  {
    name: 'Communication Hub',
    description: 'Integrated messaging system with multi-channel...',
    href: '#',
    icon: MessageSquare,
  },
  {
    name: 'Financial Management',
    description: 'Complete fee management system with online...',
    href: '#',
    icon: Banknote,
  },
  {
    name: 'Staff Management',
    description: 'Efficient tools for managing staff records, attendance,...',
    href: '#',
    icon: UserCog,
  },
  {
    name: 'Transport Management',
    description: 'Real-time transport tracking, route management, and...',
    href: '#',
    icon: Bus,
  },
  {
    name: 'Analytics & Reports',
    description: 'Powerful analytics tools for data-driven decisions.',
    href: '/dashboard',
    icon: BarChart,
  },
  {
    name: 'Resource Management',
    description: 'Digital library system, inventory tracking, and...',
    href: '#',
    icon: BookOpen,
  },
  {
    name: 'Attendance System',
    description: 'Automated attendance tracking for students and...',
    href: '/dashboard/attendance',
    icon: CalendarCheck,
  },
  {
    name: 'Examination Portal',
    description: 'Complete examination management system from...',
    href: '#',
    icon: FileCheck,
  },
  {
    name: 'Notice Board',
    description: 'Digital notice board for announcements, events, an...',
    href: '#',
    icon: Bell,
  },
  {
    name: 'Security & Access',
    description: 'Role-based access control with data encryption and...',
    href: '#',
    icon: Shield,
  }
];


export function DesktopNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <nav className="hidden md:flex items-center gap-6">
      <a
        href="#home"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Home
      </a>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary outline-none"
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
            <div className="flex justify-between items-center">
              <h4 className="font-medium leading-none text-foreground">Features</h4>
              <Link href="#" className='text-sm font-medium text-primary hover:underline'>View all</Link>
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
            <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center bg-muted/50 rounded-lg p-4">
                    <div>
                        <p className="font-semibold text-foreground">Get started</p>
                        <p className="text-sm text-muted-foreground">Their food sources have decreased, and their numbers</p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <a
        href="#testimonials"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Testimonials
      </a>
      <a
        href="#contact"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Contact
      </a>
    </nav>
     <div className="hidden md:flex items-center gap-2">
        <Button asChild>
          <Link href="/login">
            Login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
